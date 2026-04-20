import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { projects } from '@/data/projects';
import { ArrowLeft, ArrowUpRight, CheckCircle, Code2, Cpu, Github, LayoutGrid, Lightbulb } from 'lucide-react';

export default function ProjectDetail() {
  const router = useRouter();
  const { slug } = router.query;

  // Wait for router to be ready
  if (!router.isReady) return null;

  const project = projects.find(p => p.slug === slug);

  if (!project) {
    return (
      <div className="container mx-auto px-6 py-32 text-center">
        <h1 className="text-4xl font-bold mb-4">Projet introuvable</h1>
        <Link href="/portfolio" className="text-[var(--accent-teal)] hover:underline">Retour au portfolio</Link>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{project.title} | Portfolio Dolnick</title>
        <meta name="description" content={project.shortDescription} />
      </Head>

      <div className="container mx-auto px-6 lg:px-12 py-12">
        
        {/* Back Link */}
        <Link href="/portfolio" className="inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--accent-teal)] transition-colors text-sm font-medium mb-10">
          <ArrowLeft size={16} /> Retour au portfolio
        </Link>

        {/* Hero Area */}
        <div className="glass-dark border border-[var(--border)] rounded-3xl p-8 lg:p-12 mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-[var(--accent-teal)]/5 to-transparent pointer-events-none" />
          
          <div className="relative z-10 flex flex-col lg:flex-row gap-12">
            <div className="flex-1">
              <span className="inline-block text-xs font-code text-[var(--accent-teal)] px-3 py-1 bg-[var(--accent-teal)]/10 rounded-md mb-4 border border-[var(--accent-teal)]/20">
                {project.category}
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-extrabold mb-6 leading-tight">
                {project.title}
              </h1>
              <p className="text-xl text-[var(--text-secondary)] mb-8 leading-relaxed max-w-2xl">
                {project.shortDescription}
              </p>
              
              <div className="flex flex-wrap items-center gap-4">
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary text-sm flex items-center gap-2">
                    <Github size={18} /> Code Source
                  </a>
                )}
                {project.demoUrl && (
                  <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="btn-primary text-sm flex items-center gap-2">
                    <ArrowUpRight size={18} /> Demo Live
                  </a>
                )}
              </div>
            </div>

            {/* Tech Stack Box */}
            <div className="lg:w-1/3 bg-[var(--bg-deep)] rounded-2xl p-6 border border-[var(--border)] self-start">
              <h3 className="font-heading font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                <Code2 size={20} className="text-[var(--accent-teal)]" /> Technologies
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map(tech => (
                  <span key={tech} className="text-sm text-[var(--text-secondary)] px-3 py-1.5 border border-[var(--border)] rounded-lg bg-[var(--bg-surface)]">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Content Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-2 space-y-12">
            {/* Problem */}
            <section>
              <h2 className="text-2xl font-heading font-bold mb-4 flex items-center gap-3">
                <Lightbulb className="text-amber-500" size={24} /> La Problématique
              </h2>
              <div className="prose prose-invert max-w-none text-[var(--text-secondary)]">
                <p className="text-lg leading-relaxed bg-[var(--bg-surface)] p-6 rounded-2xl border-l-4 border-amber-500">
                  {project.problem}
                </p>
              </div>
            </section>

            {/* Solution */}
            <section>
              <h2 className="text-2xl font-heading font-bold mb-4 flex items-center gap-3">
                <Cpu className="text-[var(--accent-blue)]" size={24} /> La Solution
              </h2>
              <div className="prose prose-invert max-w-none text-[var(--text-secondary)]">
                <p className="text-lg leading-relaxed bg-[var(--bg-surface)] p-6 rounded-2xl border-l-4 border-[var(--accent-blue)]">
                  {project.solution}
                </p>
              </div>
            </section>
            
            {/* Results */}
            <section>
              <h2 className="text-2xl font-heading font-bold mb-4 flex items-center gap-3">
                <CheckCircle className="text-[var(--accent-teal)]" size={24} /> Résultats & Impact
              </h2>
              <div className="prose prose-invert max-w-none text-[var(--text-secondary)]">
                <p className="text-lg leading-relaxed bg-[var(--accent-teal)]/5 p-6 rounded-2xl border border-[var(--accent-teal)]/20 text-[var(--text-primary)]">
                  {project.results}
                </p>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8">
             {/* Visuals Placeholder */}
             <div className="glass-dark border border-[var(--border)] rounded-2xl p-6 text-center">
                <LayoutGrid className="mx-auto text-[var(--text-muted)] mb-4" size={48} />
                <h4 className="font-heading font-semibold mb-2">Architecture Visuelle</h4>
                <p className="text-sm text-[var(--text-muted)]">Les schémas d'architecture et les captures d'écran du projet seront bientôt ajoutés.</p>
             </div>
          </div>

        </div>

      </div>
    </>
  );
}
