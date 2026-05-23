import type { NextApiRequest, NextApiResponse } from 'next';
import { isAuthenticated } from '@/lib/auth';
import { supabaseAdmin, PROJECT_FIELDS } from '@/lib/supabase';

// Defaults for fields that should not be null when omitted from the body.
const INSERT_DEFAULTS: Record<string, unknown> = {
  short_description: '',
  problem: '',
  solution: '',
  results: '',
  technologies: [],
  categorized_technologies: [],
  image_url: '/file.svg',
  screenshots: [],
  is_private_repo: false,
  display_order: 0,
  key_features: [],
  kpi_stats: [],
  team_members: [],
  architecture_components: [],
  pipeline_steps: [],
  api_endpoints: [],
};

function pickInsertPayload(body: Record<string, unknown>) {
  const payload: Record<string, unknown> = {};
  for (const field of PROJECT_FIELDS) {
    if (body[field] !== undefined && body[field] !== null && body[field] !== '') {
      payload[field] = body[field];
    } else if (field in INSERT_DEFAULTS) {
      payload[field] = INSERT_DEFAULTS[field];
    } else {
      payload[field] = null;
    }
  }
  return payload;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  if (!isAuthenticated(req)) return res.status(401).json({ error: 'Non autorisé' });

  if (req.method === 'GET') {
    const { data, error } = await supabaseAdmin
      .from('projects')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === 'POST') {
    const body = req.body as Record<string, unknown>;

    if (!body.slug || !body.title || !body.category) {
      return res.status(400).json({ error: 'slug, title et category sont obligatoires' });
    }

    const payload = pickInsertPayload(body);

    const { data, error } = await supabaseAdmin
      .from('projects')
      .insert([payload])
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(data);
  }

  return res.status(405).json({ error: 'Méthode non supportée' });
}
