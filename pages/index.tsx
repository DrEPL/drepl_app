import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { TypeAnimation } from 'react-type-animation';
import { motion } from 'framer-motion';
import { ArrowRight, BrainCircuit, Code, Database, Server } from 'lucide-react';
import ParticleCanvas from '@/components/ParticleCanvas';
import { projects } from '@/data/projects';
import { services } from '@/data/services';
import { allSkillsList } from '@/data/skills';

const techLogos = [
  { name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
  { name: 'TensorFlow', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg' },
  { name: 'PyTorch', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg' },
  { name: 'Docker', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
  { name: 'PostgreSQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg' },
  { name: 'React', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
  { name: 'FastAPI', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg' },
  { name: 'Tailwind', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg' },
  { name: 'Git', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
  { name: 'MongoDB', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' },
  { name: 'AWS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg' },
  { name: 'Flutter', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/flutter/flutter-original.svg' },
  { name: 'Node.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg' },
  { name: 'Redis', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/redis/redis-original.svg' },
  { name: 'Kafka', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/apachekafka/apachekafka-original.svg' },
  { name: 'Hadoop', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/hadoop/hadoop-original.svg' },
];

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      {/* ── HERO SECTION ── */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-20 pb-32">
        <ParticleCanvas />
        
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12">
            
            {/* Text Content */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="w-full lg:w-3/5 text-center lg:text-left"
            >
              <h2 className="text-[var(--accent-teal)] font-code text-sm sm:text-base font-semibold mb-4 tracking-wider">
                &lt;Hello World /&gt;
              </h2>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-heading font-extrabold mb-6 leading-tight">
                Ingénieur <br />
                <span className="teal-gradient-text">IA & Big Data</span>
              </h1>
              
              <div className="text-xl sm:text-2xl font-body font-medium text-[var(--text-secondary)] mb-8 h-16 sm:h-auto">
                <TypeAnimation
                  sequence={[
                    'Solutions Innovantes pour l\'Afrique', 2000,
                    'Machine Learning & Deep Learning', 2000,
                    'Pipelines ETL & Architectures Distribuées', 2000,
                    'Développement Web & Mobile Intelligent', 2000,
                  ]}
                  wrapper="span"
                  speed={50}
                  repeat={Infinity}
                />
              </div>
              
              <p className="text-[var(--text-secondary)] text-base sm:text-lg mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Transformer les données en intelligence, propulser l'innovation au service des réalités africaines. Découvrez comment l'IA peut transformer vos défis en opportunités.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link href="/portfolio" className="btn-primary w-full sm:w-auto text-center flex items-center justify-center gap-2">
                  Voir mes Projets <ArrowRight size={18} />
                </Link>
                <Link href="/contact" className="btn-secondary w-full sm:w-auto text-center">
                  Me Contacter
                </Link>
              </div>
            </motion.div>
            
            {/* Image / Avatar */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-full lg:w-2/5 flex justify-center lg:justify-end"
            >
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 xl:w-96 xl:h-96 group">
                <div className="absolute inset-0 rounded-full animate-border-glow border-2 border-transparent" />
                <div className="absolute -inset-4 rounded-full border border-dashed border-[var(--border-glass)] animate-spin-slow" />
                <div className="w-full h-full rounded-full overflow-hidden border-4 border-[var(--bg-surface)] relative z-10">
                  <Image
                    src="/drepl.jpg"
                    alt="Dr EPL"
                    fill
                    priority
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
              </div>
            </motion.div>
            
          </div>
        </div>
      </section>

      {/* ── ABOUT SNAPSHOT ── */}
      <section className="py-20 bg-[var(--bg-surface)]">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 glass-dark rounded-3xl p-8 lg:p-12"
          >
            <div className="md:col-span-2">
              <h3 className="font-heading text-2xl sm:text-3xl font-bold mb-4">Un ingénieur passionné au service du développement</h3>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-6">
                Dans un monde où la donnée est le nouveau pétrole, mon parcours est jalonné par la conviction que la technologie peut et doit être un levier de développement. Chaque ligne de code, chaque algorithme que je conçois, est une étape vers des solutions concrètes, éthiques et impactantes.
              </p>
              <Link href="/about" className="text-[var(--accent-teal)] font-medium flex items-center gap-2 hover:gap-3 transition-all">
                En savoir plus sur mon parcours <ArrowRight size={16} />
              </Link>
            </div>
            <div className="flex flex-col justify-center gap-6 border-t md:border-t-0 md:border-l border-[var(--border)] pt-6 md:pt-0 md:pl-8">
              <div>
                <span className="block text-4xl font-extrabold text-[var(--accent-teal)] mb-1">10+</span>
                <span className="text-sm text-[var(--text-secondary)] font-medium uppercase tracking-wider">Projets Réalisés</span>
              </div>
              <div>
                <span className="block text-4xl font-extrabold text-[var(--accent-teal)] mb-1">20+</span>
                <span className="text-sm text-[var(--text-secondary)] font-medium uppercase tracking-wider">Technologies Maîtrisées</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── SERVICES SNAPSHOT ── */}
      <section className="py-24">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">Mes Domaines d'Expertise</h2>
            <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
              Des solutions complètes pour transformer vos données en avantages concurrentiels.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.slice(0, 3).map((service, index) => (
              <motion.div 
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-dark rounded-2xl p-8 border border-[var(--border)] hover:border-[var(--accent-teal)] transition-colors group cursor-pointer relative overflow-hidden"
              >
                {/* Giant SVG Watermark */}
                <div className="absolute -bottom-6 -right-6 text-[var(--text-muted)] opacity-[0.03] group-hover:opacity-[0.08] transition-all duration-700 group-hover:scale-110 transform z-0 pointer-events-none">
                  <service.icon size={160} strokeWidth={1} />
                </div>
                
                <div className="w-14 h-14 rounded-xl bg-[var(--bg-deep)] border border-[var(--border)] flex items-center justify-center mb-6 group-hover:bg-[var(--accent-teal)]/10 transition-colors relative z-10">
                  <service.icon className="w-7 h-7 text-[var(--accent-teal)]" />
                </div>
                <h3 className="text-xl font-bold font-heading mb-3 relative z-10">{service.title}</h3>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-4">{service.description}</p>
                <Link href="/services" className="text-sm text-[var(--accent-teal)] font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  Découvrir <ArrowRight size={14} />
                </Link>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/services" className="btn-secondary inline-block">Voir tous les services</Link>
          </div>
        </div>
      </section>

      {/* ── PROJECTS SNAPSHOT ── */}
      <section className="py-24 bg-[var(--bg-surface)]">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">Projets Récents</h2>
              <p className="text-[var(--text-secondary)] max-w-xl">
                Une sélection de mes réalisations les plus impactantes en IA et ingénierie de données.
              </p>
            </div>
            <Link href="/portfolio" className="hidden md:flex items-center gap-2 text-[var(--accent-teal)] hover:underline mt-4 md:mt-0 font-medium">
              Voir tout le portfolio <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.slice(0, 3).map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group glass-dark rounded-2xl overflow-hidden border border-[var(--border)] hover:border-[var(--accent-teal)] transition-all flex flex-col h-full"
              >
                <div className="relative h-48 w-full bg-[var(--bg-elevated)] flex items-center justify-center p-6 border-b border-[var(--border)] overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-teal)]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />
                  {/* Decorative Icon based on category */}
                  {project.category === 'IA' ? <BrainCircuit size={64} className="text-[var(--text-secondary)] opacity-50 group-hover:scale-110 group-hover:text-[var(--accent-teal)] transition-all z-10" /> : 
                   project.category === 'Big Data' ? <Database size={64} className="text-[var(--text-secondary)] opacity-50 group-hover:scale-110 group-hover:text-[var(--accent-teal)] transition-all z-10" /> :
                   <Code size={64} className="text-[var(--text-secondary)] opacity-50 group-hover:scale-110 group-hover:text-[var(--accent-teal)] transition-all z-10" />}
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <span className="text-xs font-code text-[var(--accent-teal)] mb-2 px-2 py-1 bg-[var(--accent-teal)]/10 rounded-md self-start">{project.category}</span>
                  <h3 className="text-xl font-bold font-heading mb-2 group-hover:text-[var(--accent-teal)] transition-colors">{project.title}</h3>
                  <p className="text-[var(--text-secondary)] text-sm mb-6 flex-grow">{project.shortDescription}</p>
                  
                  <Link href={`/portfolio/${project.slug}`} className="text-sm font-medium flex items-center gap-2 group/link mt-auto">
                    Voir les détails <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-8 md:hidden">
            <Link href="/portfolio" className="btn-secondary inline-block">Voir tout le portfolio</Link>
          </div>
        </div>
      </section>

      {/* ── TECH STACK SCROLL ── */}
      <section className="py-20 overflow-hidden border-y border-[var(--border)] relative bg-[var(--bg-elevated)]/10">
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[var(--bg-deep)] to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[var(--bg-deep)] to-transparent z-10 pointer-events-none" />
        
        <div className="container mx-auto px-6 mb-10 text-center relative z-20">
          <h3 className="font-code text-sm text-[var(--text-secondary)] uppercase tracking-widest">Technologies & Outils</h3>
        </div>
        
        <div className="flex w-max animate-marquee hover:[animation-play-state:paused] relative z-0">
          {[...techLogos, ...techLogos, ...techLogos].map((tech, index) => (
            <div key={index} className="inline-flex items-center gap-4 px-8 py-4 mx-3 glass-dark rounded-2xl border border-[var(--border)] text-[var(--text-primary)] font-medium text-base hover:border-[var(--accent-teal)] hover:shadow-[0_0_15px_rgba(0,191,166,0.2)] transition-all cursor-default">
              <img src={tech.icon} alt={tech.name} className="w-8 h-8 object-contain" />
              {tech.name}
            </div>
          ))}
        </div>
      </section>



      {/* ── CTA SECTION ── */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--accent-teal)]/5 rounded-full blur-3xl -z-10" />
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-heading text-4xl md:text-5xl font-extrabold mb-6">Prêt à collaborer ?</h2>
            <p className="text-[var(--text-secondary)] text-lg mb-10 max-w-2xl mx-auto">
              Vous avez un projet en IA, Big Data ou développement intelligent ? Discutons de vos besoins et explorons comment mes compétences peuvent vous aider à atteindre vos objectifs.
            </p>
            <Link href="/contact" className="btn-primary inline-flex text-lg px-8 py-4 shadow-lg shadow-[var(--accent-teal)]/20">
              Démarrer un projet
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}