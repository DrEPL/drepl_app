import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Lazy admin client: initialized only on first access so that client-side bundles
// importing this module (e.g. for type/helper exports like `pickLocale`) don't crash
// when SUPABASE_SERVICE_ROLE_KEY is absent in the browser.
let _supabaseAdmin: SupabaseClient | null = null;
export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_target, prop, receiver) {
    if (!_supabaseAdmin) {
      const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
      if (!serviceKey) {
        throw new Error('SUPABASE_SERVICE_ROLE_KEY is required to use supabaseAdmin');
      }
      _supabaseAdmin = createClient(supabaseUrl, serviceKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      });
    }
    return Reflect.get(_supabaseAdmin, prop, receiver);
  },
});

// i18n helper type for JSONB leaves
export type Translatable<T = string> = { fr: T; en?: T | null };

// Structured JSONB shapes
export interface KpiStat {
  value: string;
  label: Translatable;
  icon?: string | null;
}
export interface TeamMember {
  name: string;
  role: Translatable;
  avatar_url?: string | null;
  is_lead?: boolean;
}
export interface PipelineStep {
  order: number;
  title: Translatable;
  description: Translatable;
}

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
  // i18n EN
  title_en: string | null;
  short_description_en: string | null;
  problem_en: string | null;
  solution_en: string | null;
  results_en: string | null;
  // Nouveaux champs prose
  context: string | null;
  context_en: string | null;
  closing_note: string | null;
  closing_note_en: string | null;
  // Structure d'accueil enrichie
  developed_at_url: string | null;
  developed_at_logo: string | null;
  developed_at_role: string | null;
  developed_at_role_en: string | null;
  developed_at_description: string | null;
  developed_at_description_en: string | null;
  // Metadonnees structurees
  kpi_stats: KpiStat[];
  team_members: TeamMember[];
  pipeline_steps: PipelineStep[];
}

// Picks the locale from a Translatable, falling back to FR.
export function pickLocale<T>(node: Translatable<T> | null | undefined, locale: string = 'fr'): T | '' {
  if (!node) return '' as T | '';
  const isEn = locale === 'en';
  if (isEn && node.en != null && node.en !== ('' as unknown as T)) return node.en as T;
  return node.fr as T;
}

// Whitelist of project columns (excluding id, created_at, updated_at) used by admin POST/PUT.
export const PROJECT_FIELDS = [
  'slug',
  'title',
  'short_description',
  'problem',
  'solution',
  'results',
  'category',
  'technologies',
  'categorized_technologies',
  'image_url',
  'logo_url',
  'github_url',
  'demo_url',
  'developed_at',
  'screenshots',
  'is_private_repo',
  'display_order',
  'title_en',
  'short_description_en',
  'problem_en',
  'solution_en',
  'results_en',
  'context',
  'context_en',
  'closing_note',
  'closing_note_en',
  'developed_at_url',
  'developed_at_logo',
  'developed_at_role',
  'developed_at_role_en',
  'developed_at_description',
  'developed_at_description_en',
  'kpi_stats',
  'team_members',
  'pipeline_steps',
] as const;

export type ProjectFieldKey = (typeof PROJECT_FIELDS)[number];

// Scalar TEXT fields the translate endpoint walks for FR->EN translation.
export const TRANSLATABLE_SCALAR_FIELDS = [
  'title',
  'short_description',
  'problem',
  'solution',
  'results',
  'context',
  'closing_note',
  'developed_at_role',
  'developed_at_description',
] as const;

// JSONB columns whose leaf `{fr, en}` objects the translate endpoint walks.
export const TRANSLATABLE_JSONB_FIELDS = [
  'kpi_stats',
  'team_members',
  'pipeline_steps',
] as const;

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
    // Nouveaux champs prose (localises)
    context: (isEn && row.context_en) ? row.context_en : (row.context ?? null),
    closingNote: (isEn && row.closing_note_en) ? row.closing_note_en : (row.closing_note ?? null),
    // Structure d'accueil enrichie
    developedAtUrl: row.developed_at_url ?? null,
    developedAtLogo: row.developed_at_logo ?? null,
    developedAtRole: (isEn && row.developed_at_role_en) ? row.developed_at_role_en : (row.developed_at_role ?? null),
    developedAtDescription: (isEn && row.developed_at_description_en) ? row.developed_at_description_en : (row.developed_at_description ?? null),
    // Metadonnees structurees (raw — la page detail utilise pickLocale)
    kpiStats: row.kpi_stats ?? [],
    teamMembers: row.team_members ?? [],
    pipelineSteps: row.pipeline_steps ?? [],
    // raw EN fields for admin
    title_en: row.title_en,
    short_description_en: row.short_description_en,
    problem_en: row.problem_en,
    solution_en: row.solution_en,
    results_en: row.results_en,
  };
}
