import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Client public (lecture seule côté client et SSR public)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Client admin (écriture, utilisé uniquement côté serveur/API routes)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// Type pour un projet tel que stocké en DB
export interface ProjectRow {
  id: string;
  slug: string;
  title: string;
  short_description: string;
  problem: string;
  solution: string;
  results: string;
  category: 'IA' | 'Big Data' | 'Web/Mobile' | 'IoT';
  technologies: string[];
  categorized_technologies: { category: string; skills: string[] }[];
  image_url: string;
  logo_url: string | null;
  github_url: string | null;
  demo_url: string | null;
  developed_at: string | null;
  screenshots: { url: string; title: string; description: string }[];
  is_private_repo: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

// Convertir un ProjectRow en format compatible avec le code existant (camelCase)
export function rowToProject(row: ProjectRow) {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    shortDescription: row.short_description,
    problem: row.problem,
    solution: row.solution,
    results: row.results,
    category: row.category,
    technologies: row.technologies,
    categorizedTechnologies: row.categorized_technologies,
    imageUrl: row.image_url,
    logoUrl: row.logo_url ?? undefined,
    githubUrl: row.github_url ?? undefined,
    demoUrl: row.demo_url ?? undefined,
    developedAt: row.developed_at ?? undefined,
    screenshots: row.screenshots,
    isPrivateRepo: row.is_private_repo,
  };
}
