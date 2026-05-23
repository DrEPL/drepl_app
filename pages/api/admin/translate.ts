import type { NextApiRequest, NextApiResponse } from 'next';
import { isAuthenticated } from '@/lib/auth';
import {
  supabaseAdmin,
  TRANSLATABLE_SCALAR_FIELDS,
  TRANSLATABLE_JSONB_FIELDS,
} from '@/lib/supabase';

const HF_MODEL = 'Helsinki-NLP/opus-mt-fr-en';
const HF_URLS = [
  `https://router.huggingface.co/hf-inference/models/${HF_MODEL}`,
  `https://api-inference.huggingface.co/models/${HF_MODEL}`,
];

const CONCURRENCY = 4;

async function callHF(url: string, text: string, apiKey: string): Promise<Response> {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ inputs: text, options: { wait_for_model: true } }),
  });
}

async function translateText(text: string, apiKey: string): Promise<string> {
  if (!text?.trim()) return '';

  let lastError = '';
  for (const url of HF_URLS) {
    const res = await callHF(url, text, apiKey);
    const bodyText = await res.text();
    if (!res.ok) {
      lastError = `HuggingFace ${res.status} @ ${url}: ${bodyText.slice(0, 300)}`;
      console.error(`[translate] ${lastError}`);
      continue;
    }
    let data: unknown;
    try {
      data = JSON.parse(bodyText);
    } catch {
      lastError = `Non-JSON from ${url}: ${bodyText.slice(0, 200)}`;
      continue;
    }
    if (Array.isArray(data) && data[0] && typeof data[0] === 'object' && 'translation_text' in data[0]) {
      return (data[0] as { translation_text: string }).translation_text;
    }
    lastError = `Unexpected response from ${url}: ${JSON.stringify(data).slice(0, 200)}`;
  }
  throw new Error(lastError || 'Translation failed on all endpoints');
}

// Simple promise pool with a fixed concurrency to avoid HF rate limits.
async function runPool<T, R>(items: T[], worker: (item: T) => Promise<R>, concurrency: number): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let cursor = 0;
  const runners = Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (true) {
      const i = cursor++;
      if (i >= items.length) return;
      results[i] = await worker(items[i]);
    }
  });
  await Promise.all(runners);
  return results;
}

// Recursively collects {fr, en?} leaves missing a meaningful `en`. Returns mutator callbacks
// that, when given the translated text, set node.en on the original object.
type LeafSetter = { fr: string; set: (en: string) => void };

function collectLeaves(node: unknown, out: LeafSetter[]) {
  if (!node) return;
  if (Array.isArray(node)) {
    for (const item of node) collectLeaves(item, out);
    return;
  }
  if (typeof node !== 'object') return;
  const obj = node as Record<string, unknown>;
  if (typeof obj.fr === 'string') {
    const fr = obj.fr.trim();
    const enExisting = typeof obj.en === 'string' ? obj.en.trim() : '';
    if (fr && !enExisting) {
      out.push({ fr, set: (en) => { obj.en = en; } });
    }
    // Even if this node looks like a leaf, recurse on sibling values
    // (in case there are nested translatable structures).
  }
  for (const key of Object.keys(obj)) {
    if (key === 'fr' || key === 'en') continue;
    collectLeaves(obj[key], out);
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  if (!isAuthenticated(req)) return res.status(401).json({ error: 'Non autorisé' });

  const { projectId } = req.body as { projectId: string };
  if (!projectId) return res.status(400).json({ error: 'projectId requis' });

  const apiKey = process.env.HF_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'HF_API_KEY non configurée' });

  const selectCols = [
    ...TRANSLATABLE_SCALAR_FIELDS,
    ...TRANSLATABLE_SCALAR_FIELDS.map((f) => `${f}_en`),
    ...TRANSLATABLE_JSONB_FIELDS,
  ].join(', ');

  const { data: project, error } = await supabaseAdmin
    .from('projects')
    .select(selectCols)
    .eq('id', projectId)
    .single();

  if (error || !project) return res.status(404).json({ error: 'Projet non trouvé' });
  const row = project as unknown as Record<string, unknown>;

  try {
    // 1. Scalar translations — skip when an _en value already exists.
    const scalarUpdates: Record<string, string> = {};
    const scalarTasks: { field: string; text: string }[] = [];
    for (const field of TRANSLATABLE_SCALAR_FIELDS) {
      const enKey = `${field}_en`;
      const enExisting = typeof row[enKey] === 'string' ? (row[enKey] as string).trim() : '';
      const frValue = typeof row[field] === 'string' ? (row[field] as string) : '';
      if (frValue.trim() && !enExisting) {
        scalarTasks.push({ field, text: frValue });
      }
    }

    const scalarResults = await runPool(
      scalarTasks,
      async (t) => ({ field: t.field, en: await translateText(t.text, apiKey) }),
      CONCURRENCY,
    );
    for (const r of scalarResults) {
      scalarUpdates[`${r.field}_en`] = r.en;
    }

    // 2. JSONB leaf translations — walk each structured column.
    const jsonbUpdates: Record<string, unknown> = {};
    for (const field of TRANSLATABLE_JSONB_FIELDS) {
      const source = row[field];
      if (!source) continue;
      // Deep clone so we don't mutate the Supabase response object directly.
      const cloned = JSON.parse(JSON.stringify(source));
      const leaves: LeafSetter[] = [];
      collectLeaves(cloned, leaves);
      if (leaves.length === 0) continue;
      const translated = await runPool(
        leaves,
        async (leaf) => ({ leaf, en: await translateText(leaf.fr, apiKey) }),
        CONCURRENCY,
      );
      for (const { leaf, en } of translated) leaf.set(en);
      jsonbUpdates[field] = cloned;
    }

    const updatePayload = { ...scalarUpdates, ...jsonbUpdates };
    if (Object.keys(updatePayload).length === 0) {
      return res.status(200).json({ ok: true, message: 'Tout est déjà traduit', updated: {} });
    }

    const { error: updateError } = await supabaseAdmin
      .from('projects')
      .update(updatePayload)
      .eq('id', projectId);

    if (updateError) throw updateError;

    return res.status(200).json({ ok: true, updated: updatePayload });
  } catch (err: unknown) {
    console.error('[translate] error:', err);
    return res.status(500).json({ error: err instanceof Error ? err.message : 'Erreur de traduction' });
  }
}
