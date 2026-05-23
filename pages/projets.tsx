import React, { useState, useMemo, useRef, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { GetStaticProps } from 'next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowUpRight, BrainCircuit, Code, Database, Cpu,
  Sparkles, LayoutGrid, ChevronDown,
} from 'lucide-react';
import { supabase, rowToProject } from '@/lib/supabase';
import type { Project } from '@/data/projects';
import { CategoryBackdrop } from '@/components/CategoryBackdrop';
import { useT } from '@/lib/useTranslation';

interface Props { projects: Project[] }

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const { data } = await supabase
    .from('projects')
    .select('*')
    .order('display_order', { ascending: true });

  return {
    props: { projects: (data || []).map(p => rowToProject(p, locale)) },
    revalidate: 60,
  };
};

// Per-category visual identity used across chips, glows, and accents.
const CATEGORY_THEME: Record<string, {
  text: string;
  glow: string;
  ring: string;
  chipBg: string;
  Icon: React.ComponentType<{ size?: number; className?: string }>;
}> = {
  'IA':         { text: 'text-[var(--accent-blue)]',glow: 'bg-[var(--accent-blue)]/25',ring: 'group-hover:border-[var(--accent-blue)]/50', chipBg: 'bg-black/70 text-[var(--accent-blue)] border-[var(--accent-blue)]/40', Icon: BrainCircuit },
  'Big Data':   { text: 'text-violet-300',          glow: 'bg-violet-400/25',         ring: 'group-hover:border-violet-300/50', chipBg: 'bg-black/70 text-violet-300 border-violet-300/40',           Icon: Database },
  'Web/Mobile': { text: 'text-[var(--accent-teal)]',glow: 'bg-[var(--accent-teal)]/25',ring: 'group-hover:border-[var(--accent-teal)]/50', chipBg: 'bg-black/70 text-[var(--accent-teal)] border-[var(--accent-teal)]/40', Icon: Code },
  'IoT':        { text: 'text-[var(--accent-blue)]',glow: 'bg-[var(--accent-blue)]/25',ring: 'group-hover:border-[var(--accent-blue)]/50', chipBg: 'bg-black/70 text-[var(--accent-blue)] border-[var(--accent-blue)]/40', Icon: Cpu },
};

const themeFor = (cat: string) => CATEGORY_THEME[cat] ?? CATEGORY_THEME['Web/Mobile'];

const PAGE_SIZE = 5;

export default function Portfolio({ projects }: Props) {
  const t = useT();
  const [activeCategory, setActiveCategory] = useState<string>(t.projects.filter_all);
  const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE);

  // Reset pagination when the active filter changes
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [activeCategory]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { [t.projects.filter_all]: projects.length };
    for (const p of projects) c[p.category] = (c[p.category] ?? 0) + 1;
    return c;
  }, [projects, t.projects.filter_all]);

  const baseCategories = ['IA', 'Big Data', 'Web/Mobile', 'IoT'];
  const categories = [t.projects.filter_all, ...baseCategories];

  const filteredProjects = activeCategory === t.projects.filter_all
    ? projects
    : projects.filter(p => p.category === activeCategory);

  const visibleProjects = filteredProjects.slice(0, visibleCount);
  const remaining = Math.max(0, filteredProjects.length - visibleProjects.length);
  const hasMore = remaining > 0;

  const categoriesPresent = useMemo(
    () => new Set(projects.map(p => p.category)).size,
    [projects]
  );

  return (
    <>
      <Head>
        <title>{t.projects.page_title}</title>
        <meta name="description" content={t.meta.projects_description} />
      </Head>

      {/* Ambient background orbs */}
      <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-[42rem] h-[42rem] rounded-full bg-[var(--accent-teal)]/[0.06] blur-[120px]" />
        <div className="absolute top-1/3 -right-40 w-[36rem] h-[36rem] rounded-full bg-[var(--accent-blue)]/[0.06] blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 w-[30rem] h-[30rem] rounded-full bg-[var(--accent-teal-dark)]/[0.06] blur-[120px]" />
      </div>

      <div className="container mx-auto px-6 lg:px-12 py-12 lg:py-16">
        {/* Page Header — aligned with /services and /about */}
        <div className="mb-12 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-end">
          <div>
            <h1 className="text-4xl md:text-5xl font-heading font-extrabold mb-4">
              {t.projects.title}{' '}
              <span className="teal-gradient-text">{t.projects.title_highlight}</span>
            </h1>
            <div className="w-20 h-1 bg-[var(--accent-teal)] rounded-full mb-6"></div>
            <p className="text-[var(--text-secondary)] text-lg max-w-2xl">
              {t.projects.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-6 lg:gap-8">
            <Stat value={projects.length} label={t.projects.stat_projects} />
            <Divider />
            <Stat value={categoriesPresent} label={t.projects.stat_domains} />
          </div>
        </div>

        {/* STICKY FILTER BAR */}
        <div className="sticky top-4 z-30 mb-10">
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="glass-dark border border-[var(--border)] rounded-2xl p-2 flex items-center gap-1.5 overflow-x-auto"
          >
            {categories.map(category => {
              const isActive = activeCategory === category;
              const isAll = category === t.projects.filter_all;
              const theme = !isAll ? themeFor(category) : null;
              const Icon = theme?.Icon ?? LayoutGrid;
              const count = counts[category] ?? 0;
              return (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`group relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-[var(--accent-teal)] text-[var(--bg-deep)] shadow-lg shadow-[var(--accent-teal)]/20'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5'
                  }`}
                >
                  <Icon size={15} className={isActive ? '' : (theme?.text ?? '')} />
                  <span>{category}</span>
                  <span className={`text-[10px] font-code px-1.5 py-0.5 rounded-md ${
                    isActive
                      ? 'bg-[var(--bg-deep)]/20 text-[var(--bg-deep)]'
                      : 'bg-[var(--bg-deep)]/60 text-[var(--text-muted)] border border-[var(--border)]'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </motion.div>
        </div>

        {/* BENTO GRID */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 auto-rows-[280px] gap-5"
        >
          <AnimatePresence mode="popLayout">
            {visibleProjects.map((project, idx) => {
              const isFeatured = idx === 0 && filteredProjects.length > 1;
              return (
                <ProjectCard
                  key={project.id}
                  project={project}
                  isFeatured={isFeatured}
                  discoverLabel={t.projects.discover}
                  featuredLabel={t.projects.featured_badge}
                  index={idx}
                />
              );
            })}
          </AnimatePresence>
        </motion.div>

        {hasMore && (
          <div className="flex justify-center mt-10">
            <button
              type="button"
              onClick={() => setVisibleCount(c => c + PAGE_SIZE)}
              className="group inline-flex items-center gap-2.5 px-6 py-3 rounded-full glass-dark border border-[var(--border)] text-sm font-medium text-[var(--text-primary)] hover:border-[var(--accent-teal)]/50 hover:text-[var(--accent-teal)] transition-all"
            >
              <span>{t.projects.load_more}</span>
              <span className="text-[10px] font-code px-2 py-0.5 rounded-md bg-[var(--bg-deep)]/60 border border-[var(--border)] text-[var(--text-muted)]">
                +{Math.min(PAGE_SIZE, remaining)}
              </span>
              <ChevronDown size={16} className="group-hover:translate-y-0.5 transition-transform" />
            </button>
          </div>
        )}

        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24"
          >
            <LayoutGrid className="mx-auto mb-4 text-[var(--text-muted)]" size={48} />
            <p className="text-[var(--text-secondary)] text-lg">{t.projects.empty}</p>
          </motion.div>
        )}
      </div>
    </>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center">
      <div className="text-3xl md:text-4xl font-heading font-extrabold teal-gradient-text leading-none">
        {value}
      </div>
      <div className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)] mt-1.5 font-medium">
        {label}
      </div>
    </div>
  );
}

function Divider() {
  return <span className="w-px h-10 bg-[var(--border)]" aria-hidden />;
}

interface CardProps {
  project: Project;
  isFeatured: boolean;
  discoverLabel: string;
  featuredLabel: string;
  index: number;
}

function ProjectCard({ project, isFeatured, discoverLabel, featuredLabel, index }: CardProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const theme = themeFor(project.category);
  const Icon = theme.Icon;

  // Mouse-tracked spotlight for premium hover feel
  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    el.style.setProperty('--my', `${e.clientY - rect.top}px`);
  };

  const hasImage = !!project.imageUrl && project.imageUrl !== '/file.svg';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{
        duration: 0.5,
        delay: Math.min(index * 0.05, 0.4),
        ease: [0.22, 1, 0.36, 1],
      }}
      className={
        isFeatured
          ? 'md:col-span-2 lg:col-span-4 lg:row-span-2'
          : 'md:col-span-1 lg:col-span-2'
      }
    >
      <Link
        ref={ref}
        href={`/projets/${project.slug}`}
        onMouseMove={handleMouseMove}
        className={`group relative block h-full w-full rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--bg-surface)]/60 backdrop-blur-md transition-all duration-300 ${theme.ring} hover:shadow-2xl hover:-translate-y-1`}
        style={{
          // Spotlight effect — radial gradient that follows cursor
          backgroundImage:
            'radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,0.06), transparent 40%)',
        }}
      >
        {/* Image / illustration layer */}
        <div className="absolute inset-0">
          {hasImage ? (
            <>
              <Image
                src={project.imageUrl!}
                alt={project.title}
                fill
                sizes={isFeatured ? '(max-width: 1024px) 100vw, 66vw' : '(max-width: 1024px) 100vw, 33vw'}
                className="object-cover opacity-40 group-hover:opacity-55 group-hover:scale-105 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-deep)] via-[var(--bg-deep)]/70 to-[var(--bg-deep)]/30" />
            </>
          ) : (
            <>
              <div className="absolute inset-0 opacity-60">
                <CategoryBackdrop category={project.category} />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-deep)] via-[var(--bg-deep)]/60 to-transparent" />
            </>
          )}
          {/* Corner glow */}
          <span
            aria-hidden
            className={`absolute -top-16 -right-16 w-44 h-44 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${theme.glow}`}
          />
        </div>

        {/* Content */}
        <div className={`relative h-full flex flex-col ${isFeatured ? 'p-7 lg:p-9' : 'p-6'}`}>
          {/* Top row: category chip + featured badge */}
          <div className="flex items-start justify-between mb-auto">
            <span className={`inline-flex items-center gap-1.5 text-[11px] font-code px-2.5 py-1 rounded-md border ${theme.chipBg}`}>
              <Icon size={12} />
              {project.category}
            </span>
            {isFeatured && (
              <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.18em] font-semibold text-[var(--accent-teal)] px-2.5 py-1 rounded-md bg-[var(--accent-teal)]/10 border border-[var(--accent-teal)]/30">
                <Sparkles size={11} />
                {featuredLabel}
              </span>
            )}
          </div>

          {/* Bottom: title + description + techs + cta */}
          <div className={isFeatured ? 'mt-6 max-w-2xl' : 'mt-4'}>
            <h3 className={`font-heading font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-teal)] transition-colors leading-tight ${
              isFeatured ? 'text-2xl lg:text-3xl mb-3' : 'text-lg mb-2'
            }`}>
              {project.title}
            </h3>

            <p className={`text-[var(--text-secondary)] leading-relaxed ${
              isFeatured ? 'text-base lg:text-lg mb-5 line-clamp-3' : 'text-sm mb-4 line-clamp-2'
            }`}>
              {project.shortDescription}
            </p>

            {/* Tech chips */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {project.technologies.slice(0, isFeatured ? 6 : 3).map(tech => (
                <span
                  key={tech}
                  className="text-[10px] font-code text-[var(--text-muted)] px-2 py-0.5 rounded border border-[var(--border)] bg-[var(--bg-deep)]/60"
                >
                  {tech}
                </span>
              ))}
              {project.technologies.length > (isFeatured ? 6 : 3) && (
                <span className="text-[10px] font-code text-[var(--text-muted)] px-2 py-0.5 rounded border border-[var(--border)] bg-[var(--bg-deep)]/60">
                  +{project.technologies.length - (isFeatured ? 6 : 3)}
                </span>
              )}
            </div>

            {/* CTA */}
            <div className="flex items-center gap-2 text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--accent-teal)] transition-colors">
              <span>{discoverLabel}</span>
              <span className="relative inline-flex items-center justify-center w-7 h-7 rounded-full bg-[var(--accent-teal)]/10 border border-[var(--accent-teal)]/30 group-hover:bg-[var(--accent-teal)] group-hover:border-[var(--accent-teal)] transition-all">
                <ArrowUpRight
                  size={14}
                  className="text-[var(--accent-teal)] group-hover:text-[var(--bg-deep)] group-hover:rotate-45 transition-transform duration-300"
                />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
