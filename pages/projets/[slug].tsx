import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import type { GetStaticPaths, GetStaticProps } from 'next';
import { supabase, rowToProjectBilingual, pickLocale } from '@/lib/supabase';
import type { Project } from '@/data/projects';
import {
  ArrowLeft, ArrowUpRight, Code2, Github, LayoutGrid, Lock, X,
  Users, TrendingUp, ExternalLink,
  ChevronLeft, ChevronRight, Maximize2,
} from 'lucide-react';
import {
  ContextIcon, ProblemIcon, SolutionIcon, ResultsIcon,
  PipelineIcon, TeamIcon, AdaptationsIcon,
} from '@/components/SectionIcons';
import { Prose } from '@/components/Prose';
import { TechChip } from '@/components/TechChip';
import { CategoryBackdrop } from '@/components/CategoryBackdrop';
import { useT } from '@/lib/useTranslation';
import { useRouter } from 'next/router';

interface ProjectDetailProps {
  // Both locales are shipped together so the client can switch language without
  // re-fetching the page's static props (no perceived refresh on locale toggle).
  bilingual: { fr: Project; en: Project };
}

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await supabase.from('projects').select('slug');
  return {
    paths: (data || []).map(p => ({ params: { slug: p.slug } })),
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<ProjectDetailProps> = async ({ params }) => {
  const slug = params?.slug as string;
  const { data } = await supabase.from('projects').select('*').eq('slug', slug).single();
  if (!data) return { notFound: true };
  return { props: { bilingual: rowToProjectBilingual(data) }, revalidate: 60 };
};

// Shared scroll-triggered entrance animation
const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
};

const stagger = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
};

const KPI_ACCENTS = [
  {
    text: 'text-[var(--accent-teal)]',
    border: 'border-[var(--accent-teal)]/20',
    bg: 'bg-gradient-to-br from-[var(--accent-teal)]/[0.08] to-transparent',
    glow: 'bg-[var(--accent-teal)]/20',
  },
  {
    text: 'text-[var(--accent-blue)]',
    border: 'border-[var(--accent-blue)]/20',
    bg: 'bg-gradient-to-br from-[var(--accent-blue)]/[0.08] to-transparent',
    glow: 'bg-[var(--accent-blue)]/20',
  },
  {
    text: 'text-violet-400',
    border: 'border-violet-400/20',
    bg: 'bg-gradient-to-br from-violet-400/[0.08] to-transparent',
    glow: 'bg-violet-400/20',
  },
  {
    text: 'text-amber-400',
    border: 'border-amber-400/20',
    bg: 'bg-gradient-to-br from-amber-400/[0.08] to-transparent',
    glow: 'bg-amber-400/20',
  },
];

export default function ProjectDetail({ bilingual }: ProjectDetailProps) {
  const t = useT();
  const router = useRouter();
  const locale = (router.locale ?? 'fr') as 'fr' | 'en';
  const project = bilingual[locale] ?? bilingual.fr;

  // Prefetch the alternate locale's variant once, so the first toggle is instant.
  useEffect(() => {
    const alt = locale === 'fr' ? 'en' : 'fr';
    router.prefetch(router.pathname, router.asPath, { locale: alt });
  }, [locale, router]);

  const screenshots = project.screenshots ?? [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const hasScreenshots = screenshots.length > 0;
  const hasMultiple = screenshots.length > 1;

  const goPrev = useCallback(() => {
    setCurrentIndex(i => (i === 0 ? screenshots.length - 1 : i - 1));
  }, [screenshots.length]);

  const goNext = useCallback(() => {
    setCurrentIndex(i => (i === screenshots.length - 1 ? 0 : i + 1));
  }, [screenshots.length]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false);
      else if (e.key === 'ArrowLeft' && hasMultiple) goPrev();
      else if (e.key === 'ArrowRight' && hasMultiple) goNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxOpen, hasMultiple, goPrev, goNext]);

  const hasKpis = (project.kpiStats?.length ?? 0) > 0;
  const hasPipeline = (project.pipelineSteps?.length ?? 0) > 0;
  const hasTeam = (project.teamMembers?.length ?? 0) > 0;

  const sortedPipeline = (project.pipelineSteps ?? []).slice().sort((a, b) => a.order - b.order);

  return (
    <>
      <Head>
        <title>{project.title} | Portfolio Dolnick</title>
        <meta name="description" content={project.shortDescription} />
      </Head>

      <div className="container mx-auto px-6 lg:px-12 py-12">
        <Link href="/projets" className="inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--accent-teal)] transition-colors text-sm font-medium mb-10">
          <ArrowLeft size={16} /> {t.project_detail.back}
        </Link>

        {/* HERO */}
        <div className="glass-dark border border-[var(--border)] rounded-3xl p-8 lg:p-12 mb-12 relative overflow-hidden">
          <CategoryBackdrop category={project.category} />
          <div className="relative z-10 flex flex-col lg:flex-row gap-12">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="inline-block text-xs font-code text-[var(--accent-teal)] px-3 py-1 bg-[var(--accent-teal)]/10 rounded-md border border-[var(--accent-teal)]/20">
                  {project.category}
                </span>
                {project.developedAt && (
                  <HostBadge
                    name={project.developedAt}
                    url={project.developedAtUrl}
                    logo={project.developedAtLogo}
                    role={project.developedAtRole}
                    label={t.project_detail.developed_at}
                  />
                )}
              </div>
              <div className="relative isolate mb-6">
                <div
                  aria-hidden
                  className="absolute inset-0 -mx-10 -my-4 -z-10 pointer-events-none"
                  style={{
                    background:
                      'radial-gradient(ellipse 75% 110% at 25% 50%, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 45%, transparent 75%)',
                    filter: 'blur(18px)',
                  }}
                />
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-extrabold leading-tight">{project.title}</h1>
              </div>
              <p className="text-xl text-[var(--text-secondary)] mb-8 leading-relaxed max-w-2xl">{project.shortDescription}</p>
              <div className="flex flex-wrap items-center gap-4">
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary text-sm flex items-center gap-2">
                    <Github size={18} /> {t.project_detail.source_code}
                  </a>
                )}
                {project.isPrivateRepo && (
                  <div className="btn-secondary text-sm flex items-center gap-2 opacity-80 cursor-default">
                    <Lock size={18} /> {t.project_detail.private_repo}
                  </div>
                )}
                {project.demoUrl && (
                  <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="btn-primary text-sm flex items-center gap-2">
                    <ArrowUpRight size={18} /> {t.project_detail.live_demo}
                  </a>
                )}
              </div>
            </div>
            <div className="lg:w-1/3 relative rounded-2xl border border-[var(--border)] self-start lg:h-[440px] flex flex-col overflow-hidden bg-[var(--bg-deep)]">
              <div className="flex-shrink-0 px-6 pt-5 pb-4 border-b border-[var(--border)]">
                <h3 className="font-heading font-semibold text-[var(--text-primary)] flex items-center gap-2 text-sm">
                  <Code2 size={16} className="text-[var(--accent-teal)]" />
                  {t.project_detail.tech_stack}
                </h3>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-5">
                {project.categorizedTechnologies && project.categorizedTechnologies.length > 0 ? (
                  <div className="space-y-5">
                    {project.categorizedTechnologies.map((cat, catIdx) => (
                      <motion.div
                        key={catIdx}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: 0.1 + catIdx * 0.06 }}
                      >
                        <h4 className="text-[10px] uppercase tracking-[0.18em] font-semibold text-[var(--text-muted)] mb-2.5">
                          {cat.category}
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {cat.skills.map((tech, sIdx) => (
                            <TechChip key={tech} name={tech} delay={0.15 + catIdx * 0.06 + sIdx * 0.025} />
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies.map((tech, idx) => (
                      <TechChip key={tech} name={tech} delay={0.1 + idx * 0.025} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* KPI BANNER */}
        {hasKpis && (
          <motion.section {...fadeUp} className="mb-12">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {project.kpiStats!.map((stat, idx) => {
                const accent = KPI_ACCENTS[idx % KPI_ACCENTS.length];
                return (
                  <motion.div
                    key={idx}
                    {...stagger}
                    transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    className={`relative overflow-hidden rounded-2xl p-6 text-center border ${accent.border} ${accent.bg}`}
                  >
                    <div className={`absolute -top-8 -right-8 w-24 h-24 rounded-full blur-2xl ${accent.glow}`} />
                    <div className={`relative flex justify-center mb-3 ${accent.text}`}>
                      <TrendingUp size={24} />
                    </div>
                    <div className={`relative text-4xl md:text-5xl font-heading font-extrabold mb-2 ${accent.text}`}>
                      {stat.value}
                    </div>
                    <p className="relative text-sm text-[var(--text-secondary)] leading-snug">
                      {pickLocale(stat.label, locale)}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.section>
        )}

        {/* CONTEXT */}
        {project.context && (
          <motion.section {...fadeUp} className="mb-12">
            <h2 className="text-2xl font-heading font-bold mb-4 flex items-center gap-3">
              <ContextIcon className="text-[var(--accent-teal)]" size={24} /> {t.project_detail.context_title}
            </h2>
            <div className="relative overflow-hidden rounded-2xl border border-[var(--accent-teal)]/15 bg-gradient-to-br from-[var(--accent-teal)]/[0.05] via-transparent to-transparent p-6 md:p-8">
              <span aria-hidden className="absolute -top-16 -right-16 w-44 h-44 rounded-full bg-[var(--accent-teal)]/10 blur-3xl pointer-events-none" />
              <Prose className="relative text-base md:text-lg leading-relaxed text-[var(--text-secondary)]">
                {project.context}
              </Prose>
            </div>
          </motion.section>
        )}

        {/* MAIN GRID: prose blocks + screenshots sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12">
          <div className="lg:col-span-2 space-y-12">
            <motion.section {...fadeUp}>
              <h2 className="text-2xl font-heading font-bold mb-4 flex items-center gap-3">
                <ProblemIcon className="text-amber-400" size={24} /> {t.project_detail.problem_title}
              </h2>
              <div className="relative overflow-hidden rounded-2xl border border-amber-400/20 bg-gradient-to-br from-amber-400/[0.05] via-transparent to-transparent p-6 md:p-8">
                <span aria-hidden className="absolute -top-16 -right-16 w-44 h-44 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />
                <Prose className="relative text-base md:text-lg leading-relaxed text-[var(--text-secondary)]">
                  {project.problem}
                </Prose>
              </div>
            </motion.section>
            <motion.section {...fadeUp}>
              <h2 className="text-2xl font-heading font-bold mb-4 flex items-center gap-3">
                <SolutionIcon className="text-[var(--accent-blue)]" size={24} /> {t.project_detail.solution_title}
              </h2>
              <div className="relative overflow-hidden rounded-2xl border border-[var(--accent-blue)]/20 bg-gradient-to-br from-[var(--accent-blue)]/[0.05] via-transparent to-transparent p-6 md:p-8">
                <span aria-hidden className="absolute -top-16 -right-16 w-44 h-44 rounded-full bg-[var(--accent-blue)]/10 blur-3xl pointer-events-none" />
                <Prose className="relative text-base md:text-lg leading-relaxed text-[var(--text-secondary)]">
                  {project.solution}
                </Prose>
              </div>
            </motion.section>
            <motion.section {...fadeUp}>
              <h2 className="text-2xl font-heading font-bold mb-4 flex items-center gap-3">
                <ResultsIcon className="text-[var(--accent-teal)]" size={24} /> {t.project_detail.results_title}
              </h2>
              <div className="relative overflow-hidden rounded-2xl border border-[var(--accent-teal)]/25 bg-gradient-to-br from-[var(--accent-teal)]/[0.06] via-transparent to-transparent p-6 md:p-8">
                <span aria-hidden className="absolute -top-16 -right-16 w-44 h-44 rounded-full bg-[var(--accent-teal)]/15 blur-3xl pointer-events-none" />
                <Prose className="relative text-base md:text-lg leading-relaxed text-[var(--text-primary)]">
                  {project.results}
                </Prose>
              </div>
            </motion.section>
          </div>
          <div className="lg:col-span-1">
            {hasScreenshots ? (
              <div className="lg:sticky lg:top-24 glass-dark border border-[var(--border)] rounded-2xl overflow-hidden">
                {/* Featured image */}
                <div
                  className="group relative aspect-video w-full overflow-hidden bg-[var(--bg-deep)] cursor-zoom-in"
                  onClick={() => setLightboxOpen(true)}
                >
                  {screenshots.map((s, idx) => (
                    <Image
                      key={idx}
                      src={s.url}
                      alt={s.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      priority={idx === 0}
                      className={`object-cover transition-opacity duration-300 ${idx === currentIndex ? 'opacity-100' : 'opacity-0'}`}
                    />
                  ))}
                  {/* Counter */}
                  {hasMultiple && (
                    <div className="absolute top-3 right-3 text-xs font-code text-white bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-full pointer-events-none">
                      {currentIndex + 1} / {screenshots.length}
                    </div>
                  )}
                  {/* Zoom hint */}
                  <div className="absolute bottom-3 right-3 p-2 rounded-full bg-black/60 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <Maximize2 size={16} />
                  </div>
                  {/* Prev / Next arrows */}
                  {hasMultiple && (
                    <>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); goPrev(); }}
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-[var(--accent-teal)] transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                        aria-label={t.project_detail.screenshot_prev}
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); goNext(); }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-[var(--accent-teal)] transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                        aria-label={t.project_detail.screenshot_next}
                      >
                        <ChevronRight size={20} />
                      </button>
                    </>
                  )}
                </div>

                {/* Caption */}
                <div className="px-4 py-3 border-t border-[var(--border)] min-h-[72px]">
                  <h4 className="font-heading font-semibold text-sm mb-1 text-[var(--text-primary)] line-clamp-1">
                    {screenshots[currentIndex].title}
                  </h4>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed line-clamp-2">
                    {screenshots[currentIndex].description}
                  </p>
                </div>

                {/* Thumbnail strip */}
                {hasMultiple && (
                  <div className="px-3 pb-3 pt-2 border-t border-[var(--border)] bg-[var(--bg-deep)]/40">
                    <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 snap-x snap-mandatory">
                      {screenshots.map((s, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setCurrentIndex(idx)}
                          className={`relative flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 snap-start transition-all ${
                            idx === currentIndex
                              ? 'border-[var(--accent-teal)] opacity-100 ring-2 ring-[var(--accent-teal)]/30'
                              : 'border-transparent opacity-50 hover:opacity-100'
                          }`}
                          aria-label={`${t.project_detail.screenshot_view} ${idx + 1}`}
                          aria-current={idx === currentIndex}
                        >
                          <Image src={s.url} alt={s.title} fill sizes="64px" className="object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="glass-dark border border-[var(--border)] rounded-2xl p-6 text-center lg:sticky lg:top-24">
                <LayoutGrid className="mx-auto text-[var(--text-muted)] mb-4" size={48} />
                <h4 className="font-heading font-semibold mb-2">{t.project_detail.no_screenshot_title}</h4>
                <p className="text-sm text-[var(--text-muted)]">{t.project_detail.no_screenshot_desc}</p>
              </div>
            )}
          </div>
        </div>

        {/* PIPELINE */}
        {hasPipeline && (
          <motion.section {...fadeUp} className="mb-12">
            <h2 className="text-2xl font-heading font-bold mb-6 flex items-center gap-3">
              <PipelineIcon className="text-violet-400" size={24} /> {t.project_detail.pipeline_title}
            </h2>
            <ol className="relative ml-4 space-y-6">
              <span
                aria-hidden
                className="absolute left-0 top-2 bottom-2 w-px bg-gradient-to-b from-[var(--accent-teal)] via-violet-400 to-[var(--accent-blue)] opacity-50"
              />
              {sortedPipeline.map((step, idx) => (
                <motion.li
                  key={step.order}
                  {...stagger}
                  transition={{ duration: 0.45, delay: idx * 0.07, ease: [0.22, 1, 0.36, 1] }}
                  className="ml-8 relative"
                >
                  <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-[var(--accent-teal)] text-[var(--bg-deep)] font-heading font-bold rounded-full text-sm shadow-lg shadow-[var(--accent-teal)]/20 ring-4 ring-[var(--bg-deep)]">
                    {step.order}
                  </span>
                  <div className="glass-dark border border-[var(--border)] rounded-xl p-5 hover:border-[var(--accent-teal)]/30 transition-colors">
                    <h3 className="font-heading font-semibold text-[var(--text-primary)] mb-2">{pickLocale(step.title, locale)}</h3>
                    <Prose className="text-sm text-[var(--text-secondary)] leading-relaxed">{pickLocale(step.description, locale) as string}</Prose>
                  </div>
                </motion.li>
              ))}
            </ol>
          </motion.section>
        )}

        {/* TEAM */}
        {hasTeam && (
          <motion.section {...fadeUp} className="mb-12">
            <h2 className="text-2xl font-heading font-bold mb-6 flex items-center gap-3">
              <TeamIcon className="text-amber-400" size={24} /> {t.project_detail.team_title}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {project.teamMembers!.map((member, idx) => (
                <motion.div
                  key={idx}
                  {...stagger}
                  transition={{ duration: 0.4, delay: idx * 0.06, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -3, transition: { duration: 0.2 } }}
                  className="glass-dark border border-[var(--border)] rounded-2xl p-5 text-center"
                >
                  <div className="relative w-16 h-16 mx-auto mb-3 rounded-full overflow-hidden bg-[var(--bg-deep)] border border-[var(--border)]">
                    {member.avatar_url ? (
                      <Image src={member.avatar_url} alt={member.name} fill sizes="64px" className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[var(--text-muted)]">
                        <Users size={24} />
                      </div>
                    )}
                  </div>
                  <h3 className="font-heading font-semibold text-sm text-[var(--text-primary)] mb-1">{member.name}</h3>
                  <p className="text-xs text-[var(--text-muted)]">{pickLocale(member.role, locale)}</p>
                  {member.is_lead && (
                    <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full bg-[var(--accent-teal)]/10 text-[var(--accent-teal)] border border-[var(--accent-teal)]/20">
                      {t.project_detail.team_lead_badge}
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* ADAPTATIONS / TRANSPOSABILITÉ */}
        {project.closingNote && (
          <motion.section {...fadeUp} className="mb-12">
            <h2 className="text-2xl font-heading font-bold mb-4 flex items-center gap-3">
              <AdaptationsIcon className="text-[var(--accent-blue)]" size={24} /> {t.project_detail.adaptations_title}
            </h2>
            <div className="relative rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)]/40 p-6 md:p-8 pl-7 md:pl-10">
              <span
                aria-hidden
                className="absolute left-0 top-6 bottom-6 w-[3px] rounded-r bg-gradient-to-b from-[var(--accent-blue)]/60 via-[var(--accent-teal)]/50 to-transparent"
              />
              <Prose className="
                [&>p:first-of-type]:italic
                [&>p:first-of-type]:text-[var(--text-primary)]
                [&>p:first-of-type]:leading-relaxed
                [&>p:first-of-type]:mb-0
                [&>p:nth-of-type(2)]:text-center
                [&>p:nth-of-type(2)]:text-xs
                [&>p:nth-of-type(2)]:tracking-[0.18em]
                [&>p:nth-of-type(2)]:uppercase
                [&>p:nth-of-type(2)]:text-[var(--text-muted)]
                [&>p:nth-of-type(2)]:my-6
                [&>p:nth-of-type(2)]:not-italic
                [&>ul]:list-none
                [&>ul]:p-0
                [&>ul]:m-0
                [&>ul]:grid
                [&>ul]:grid-cols-1
                md:[&>ul]:grid-cols-2
                [&>ul]:gap-x-7
                [&>ul]:gap-y-3
                [&>ul>li]:relative
                [&>ul>li]:pl-6
                [&>ul>li]:text-sm
                [&>ul>li]:leading-relaxed
                [&>ul>li]:text-[var(--text-secondary)]
                [&>ul>li]:before:content-['→']
                [&>ul>li]:before:absolute
                [&>ul>li]:before:left-0
                [&>ul>li]:before:top-0
                [&>ul>li]:before:text-[var(--accent-teal)]
                [&>ul>li]:before:font-semibold
              ">
                {project.closingNote}
              </Prose>
            </div>
          </motion.section>
        )}
      </div>

      {lightboxOpen && hasScreenshots && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm p-4 sm:p-8"
          onClick={() => setLightboxOpen(false)}
        >
          {/* Close */}
          <button
            type="button"
            className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white hover:text-[var(--accent-teal)] transition-colors p-2 rounded-full bg-white/10 hover:bg-white/20 z-10"
            onClick={e => { e.stopPropagation(); setLightboxOpen(false); }}
            aria-label="Close"
          >
            <X size={24} />
          </button>

          {/* Counter */}
          {hasMultiple && (
            <div className="absolute top-4 left-4 sm:top-6 sm:left-6 text-sm font-code text-white bg-white/10 px-3 py-1.5 rounded-full">
              {currentIndex + 1} / {screenshots.length}
            </div>
          )}

          {/* Prev / Next */}
          {hasMultiple && (
            <>
              <button
                type="button"
                onClick={e => { e.stopPropagation(); goPrev(); }}
                className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-[var(--accent-teal)] transition-colors z-10"
                aria-label={t.project_detail.screenshot_prev}
              >
                <ChevronLeft size={28} />
              </button>
              <button
                type="button"
                onClick={e => { e.stopPropagation(); goNext(); }}
                className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-[var(--accent-teal)] transition-colors z-10"
                aria-label={t.project_detail.screenshot_next}
              >
                <ChevronRight size={28} />
              </button>
            </>
          )}

          {/* Main image */}
          <div className="relative w-full max-w-6xl aspect-video rounded-xl overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <Image
              src={screenshots[currentIndex].url}
              alt={screenshots[currentIndex].title}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>

          {/* Caption */}
          <div className="mt-4 max-w-3xl text-center px-4" onClick={e => e.stopPropagation()}>
            <h4 className="font-heading font-semibold text-white mb-1">{screenshots[currentIndex].title}</h4>
            <p className="text-sm text-white/70 leading-relaxed">{screenshots[currentIndex].description}</p>
          </div>
        </div>
      )}
    </>
  );
}

// Compact badge displaying the host organization in the hero, optionally clickable and with a logo.
function HostBadge({
  name, url, logo, role, label,
}: {
  name: string;
  url?: string | null;
  logo?: string | null;
  role?: string | null;
  label: string;
}) {
  const inner = (
    <span className="inline-flex items-center gap-2 text-xs font-medium text-[var(--accent-blue)] px-3 py-1 bg-[var(--accent-blue)]/10 rounded-md border border-[var(--accent-blue)]/20">
      {logo && (
        <span className="relative w-4 h-4 rounded overflow-hidden">
          <Image src={logo} alt={name} fill sizes="16px" className="object-contain" />
        </span>
      )}
      <span>{label} {name}{role ? ` — ${role}` : ''}</span>
      {url && <ExternalLink size={12} className="opacity-60" />}
    </span>
  );
  if (url) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
        {inner}
      </a>
    );
  }
  return inner;
}
