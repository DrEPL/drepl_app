import type { NextApiRequest, NextApiResponse } from 'next';
import { isAuthenticated } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

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
    const body = req.body;

    const { data, error } = await supabaseAdmin
      .from('projects')
      .update({
        slug: body.slug,
        title: body.title,
        short_description: body.short_description,
        problem: body.problem,
        solution: body.solution,
        results: body.results,
        category: body.category,
        technologies: body.technologies,
        categorized_technologies: body.categorized_technologies,
        image_url: body.image_url,
        logo_url: body.logo_url || null,
        github_url: body.github_url || null,
        demo_url: body.demo_url || null,
        developed_at: body.developed_at || null,
        screenshots: body.screenshots,
        is_private_repo: body.is_private_repo,
        display_order: body.display_order,
      })
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
