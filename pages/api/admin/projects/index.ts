import type { NextApiRequest, NextApiResponse } from 'next';
import { isAuthenticated } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

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
    const body = req.body;

    // Valider les champs obligatoires
    if (!body.slug || !body.title || !body.category) {
      return res.status(400).json({ error: 'slug, title et category sont obligatoires' });
    }

    const { data, error } = await supabaseAdmin
      .from('projects')
      .insert([{
        slug: body.slug,
        title: body.title,
        short_description: body.short_description || '',
        problem: body.problem || '',
        solution: body.solution || '',
        results: body.results || '',
        category: body.category,
        technologies: body.technologies || [],
        categorized_technologies: body.categorized_technologies || [],
        image_url: body.image_url || '/file.svg',
        logo_url: body.logo_url || null,
        github_url: body.github_url || null,
        demo_url: body.demo_url || null,
        developed_at: body.developed_at || null,
        screenshots: body.screenshots || [],
        is_private_repo: body.is_private_repo || false,
        display_order: body.display_order || 0,
      }])
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(data);
  }

  return res.status(405).json({ error: 'Méthode non supportée' });
}
