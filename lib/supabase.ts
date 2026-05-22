import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

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
  // EN fields
  title_en: string | null;
  short_description_en: string | null;
  problem_en: string | null;
  solution_en: string | null;
  results_en: string | null;
}

export function rowToProject(row: ProjectRow, locale: string = 'fr') {
  const isEn = locale === 'en';
  return {
    id: row.id,
    slug: row.slug,
    title: (isEn && row.title_en) ? row.title_en : row.title,
    shortDescription: (isEn && row.short_description_en) ? row.short_description_en : row.short_description,
    problem: (isEn && row.problem_en) ? row.problem_en : row.problem,
    solution: (isEn && row.solution_en) ? row.solution_en : row.solution,
    results: (isEn && row.results_en) ? row.results_en : row.results,
    category: row.category,
    technologies: row.technologies,
    categorizedTechnologies: row.categorized_technologies,
    imageUrl: row.image_url,
    logoUrl: row.logo_url ?? null,
    githubUrl: row.github_url ?? null,
    demoUrl: row.demo_url ?? null,
    developedAt: row.developed_at ?? null,
    screenshots: row.screenshots,
    isPrivateRepo: row.is_private_repo,
    // raw EN fields for admin
    title_en: row.title_en,
    short_description_en: row.short_description_en,
    problem_en: row.problem_en,
    solution_en: row.solution_en,
    results_en: row.results_en,
  };
}
