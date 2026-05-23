import type { NextApiRequest, NextApiResponse } from 'next';
import { isAuthenticated } from '@/lib/auth';
import { supabaseAdmin, PROJECT_FIELDS } from '@/lib/supabase';

function pickUpdatePayload(body: Record<string, unknown>) {
  const payload: Record<string, unknown> = {};
  for (const field of PROJECT_FIELDS) {
    if (field in body) {
      const value = body[field];
      // Coerce empty string to null for nullable scalar fields
      if (value === '' && field !== 'slug' && field !== 'title' && field !== 'category') {
        payload[field] = null;
      } else {
        payload[field] = value;
      }
    }
  }
  return payload;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  if (!isAuthenticated(req)) return res.status(401).json({ error: 'Non autorisé' });

  const { id } = req.query;
  if (!id || typeof id !== 'string') return res.status(400).json({ error: 'ID invalide' });

  if (req.method === 'GET') {
    const { data, error } = await supabaseAdmin
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return res.status(404).json({ error: 'Projet non trouvé' });
    return res.status(200).json(data);
  }

  if (req.method === 'PUT') {
    const body = req.body as Record<string, unknown>;

    const payload = pickUpdatePayload(body);

    const { data, error } = await supabaseAdmin
      .from('projects')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === 'DELETE') {
    const { error } = await supabaseAdmin
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) return res.status(500).json({ error: error.message });
    return res.status(204).end();
  }

  return res.status(405).json({ error: 'Méthode non supportée' });
}
