import type { NextApiRequest, NextApiResponse } from 'next';
import { isAuthenticated } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

const HF_API_URL = 'https://api-inference.huggingface.co/models/Helsinki-NLP/opus-mt-fr-en';

async function translateText(text: string, apiKey: string): Promise<string> {
  if (!text?.trim()) return '';
  const res = await fetch(HF_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ inputs: text }),
  });
  if (!res.ok) throw new Error(`HF API error: ${res.status}`);
  const data = await res.json();
  if (Array.isArray(data) && data[0]?.translation_text) return data[0].translation_text;
  throw new Error('Unexpected HF response format');
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
    return res.status(500).json({ error: err instanceof Error ? err.message : 'Erreur de traduction' });
  }
}
