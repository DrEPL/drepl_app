import type { NextApiRequest, NextApiResponse } from 'next';
import { isAuthenticated } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

const HF_MODEL = 'Helsinki-NLP/opus-mt-fr-en';
const HF_URLS = [
  `https://router.huggingface.co/hf-inference/models/${HF_MODEL}`,
  `https://api-inference.huggingface.co/models/${HF_MODEL}`,
];

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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  if (!isAuthenticated(req)) return res.status(401).json({ error: 'Non autorisé' });

  const { projectId } = req.body as { projectId: string };
  if (!projectId) return res.status(400).json({ error: 'projectId requis' });

  const apiKey = process.env.HF_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'HF_API_KEY non configurée' });

  const { data: project, error } = await supabaseAdmin
    .from('projects')
    .select('title, short_description, problem, solution, results')
    .eq('id', projectId)
    .single();

  if (error || !project) return res.status(404).json({ error: 'Projet non trouvé' });

  try {
    const [title_en, short_description_en, problem_en, solution_en, results_en] = await Promise.all([
      translateText(project.title, apiKey),
      translateText(project.short_description, apiKey),
      translateText(project.problem, apiKey),
      translateText(project.solution, apiKey),
      translateText(project.results, apiKey),
    ]);

    const { error: updateError } = await supabaseAdmin
      .from('projects')
      .update({ title_en, short_description_en, problem_en, solution_en, results_en })
      .eq('id', projectId);

    if (updateError) throw updateError;

    return res.status(200).json({ ok: true, title_en, short_description_en, problem_en, solution_en, results_en });
  } catch (err: unknown) {
    console.error('[translate] error:', err);
    return res.status(500).json({ error: err instanceof Error ? err.message : 'Erreur de traduction' });
  }
}
