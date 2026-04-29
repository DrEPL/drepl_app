import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { projects } from '@/data/projects';
import { ArrowRight, BrainCircuit, Code, Database, Filter } from 'lucide-react';

const categories = ['Tous', 'IA', 'Big Data', 'Web/Mobile', 'IoT'];

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState('Tous');

  const filteredProjects = activeCategory === 'Tous' 
    ? projects 
    : projects.filter(p => p.category === activeCategory);

  return (
    <>
      <Head>
        <title>Portfolio | Dr EPL</title>
        <meta name="description" content="Découvrez mes projets en Intelligence Artificielle, Big Data et développement d'applications." />
      </Head>

      <div className="container mx-auto px-6 lg:px-12 py-12 lg:py-20">
        
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold mb-4">Mon <span className="teal-gradient-text">Portfolio</span></h1>
          <div className="w-20 h-1 bg-[var(--accent-teal)] rounded-full mb-6"></div>
          <p className="text-[var(--text-secondary)] text-lg max-w-2xl">
            Exploration de cas d'usage réels : de la modélisation de données complexes au déploiement d'API intelligentes.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-12">
          <div className="flex items-center gap-2 text-[var(--text-muted)] mr-2">
            <Filter size={18} />
            <span className="text-sm font-medium">Filtrer :</span>
          </div>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === category 
                  ? 'bg-[var(--accent-teal)] text-[var(--bg-deep)] shadow-lg shadow-[var(--accent-teal)]/20' 
                  : 'glass-dark text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border)] hover:border-[var(--accent-teal)]/50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="group glass-dark rounded-2xl overflow-hidden border border-[var(--border)] hover:border-[var(--accent-teal)] transition-all flex flex-col h-full"
              >
                {/* Image / Icon Area */}
                <div className="relative h-56 w-full bg-[var(--bg-elevated)] flex items-center justify-center border-b border-[var(--border)] overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-teal)]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none" />
                  
                  {project.imageUrl && project.imageUrl !== '/file.svg' ? (
                    <Image 
                      src={project.imageUrl}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 z-0"
                    />
                  ) : (
                    <div className="p-6 flex items-center justify-center">
                      {project.category === 'IA' ? <BrainCircuit size={72} className="text-[var(--text-secondary)] opacity-50 group-hover:scale-110 group-hover:text-[var(--accent-teal)] transition-all z-10" /> : 
                       project.category === 'Big Data' ? <Database size={72} className="text-[var(--text-secondary)] opacity-50 group-hover:scale-110 group-hover:text-[var(--accent-teal)] transition-all z-10" /> :
                       <Code size={72} className="text-[var(--text-secondary)] opacity-50 group-hover:scale-110 group-hover:text-[var(--accent-teal)] transition-all z-10" />}
                    </div>
                  )}
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-xs font-code text-[var(--accent-teal)] px-2 py-1 bg-[var(--accent-teal)]/10 rounded-md">
                      {project.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold font-heading mb-3 group-hover:text-[var(--accent-teal)] transition-colors">{project.title}</h3>
                  <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-6 flex-grow">{project.shortDescription}</p>
                  
                  {/* Tech Stack Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.technologies.slice(0, 3).map(tech => (
                      <span key={tech} className="text-xs text-[var(--text-muted)] px-2 py-1 border border-[var(--border)] rounded bg-[var(--bg-deep)]">
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="text-xs text-[var(--text-muted)] px-2 py-1 border border-[var(--border)] rounded bg-[var(--bg-deep)]">
                        +{project.technologies.length - 3}
                      </span>
                    )}
                  </div>
                  
                  <Link href={`/portfolio/${project.slug}`} className="text-sm font-medium flex items-center justify-between w-full pt-4 border-t border-[var(--border)] group/link">
                    <span className="text-[var(--text-primary)] group-hover/link:text-[var(--accent-teal)] transition-colors">Découvrir le projet</span>
                    <ArrowRight size={16} className="text-[var(--accent-teal)] group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-20 text-[var(--text-muted)]">
            <p>Aucun projet trouvé pour cette catégorie.</p>
          </div>
        )}

      </div>
    </>
  );
}
