import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { services } from '@/data/services';
import { ArrowRight, CheckCircle2, Workflow } from 'lucide-react';

export default function Services() {
  return (
    <>
      <Head>
        <title>Services | Dolnick Prudhome ENZANZA</title>
        <meta name="description" content="Découvrez mes services en Développement IA, Ingénierie Big Data, et Applications Intelligentes." />
      </Head>

      <div className="container mx-auto px-6 lg:px-12 py-12 lg:py-20">
        
        {/* Page Header */}
        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold mb-4">Mes <span className="teal-gradient-text">Services</span></h1>
          <div className="w-20 h-1 bg-[var(--accent-teal)] rounded-full mb-6"></div>
          <p className="text-[var(--text-secondary)] text-lg max-w-2xl">
            J'accompagne les entreprises dans leur transformation numérique en concevant des architectures de données robustes et des modèles d'intelligence artificielle performants.
          </p>
        </div>

        {/* Services List */}
        <section className="mb-24 space-y-12">
          {services.map((service, idx) => (
            <motion.div 
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="glass-dark border border-[var(--border)] rounded-3xl p-8 lg:p-12 overflow-hidden relative group"
            >
              {/* Decorative Background Glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[var(--accent-teal)]/10 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 group-hover:scale-110 transition-transform duration-700" />
              
              {/* Giant SVG Watermark */}
              <div className="absolute -bottom-10 -right-10 text-[var(--text-muted)] opacity-[0.03] group-hover:opacity-[0.08] transition-all duration-700 group-hover:scale-110 transform z-0 pointer-events-none">
                <service.icon size={280} strokeWidth={1} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
                <div className="lg:col-span-8 space-y-4">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="p-3 bg-[var(--bg-deep)] border border-[var(--border)] rounded-xl text-[var(--accent-teal)]">
                      <service.icon size={28} />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-heading font-bold text-[var(--text-primary)]">{service.title}</h2>
                  </div>
                  <p className="text-[var(--text-secondary)] text-lg leading-relaxed">
                    {service.description}
                  </p>
                </div>
                
                <div className="lg:col-span-4 bg-[var(--bg-deep)]/50 rounded-2xl p-6 border border-[var(--border)]">
                  <h4 className="font-heading font-semibold text-[var(--text-primary)] mb-4">Bénéfices clés</h4>
                  <ul className="space-y-3">
                    {service.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="text-[var(--accent-teal)] shrink-0 mt-0.5" size={18} />
                        <span className="text-sm text-[var(--text-secondary)]">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </section>

        {/* Work Process */}
        <section className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 flex items-center justify-center gap-3">
              <Workflow className="text-[var(--accent-teal)]" size={32} />
              Processus de Collaboration
            </h2>
            <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
              Une méthodologie éprouvée pour garantir la réussite technique et fonctionnelle de vos projets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Découverte', desc: 'Analyse des besoins, définition des objectifs et étude de faisabilité.' },
              { step: '02', title: 'Conception', desc: 'Architecture technique, choix des outils et modélisation des données.' },
              { step: '03', title: 'Développement', desc: 'Implémentation agile, entraînement des modèles et itérations.' },
              { step: '04', title: 'Livraison', desc: 'Déploiement, tests de performance, documentation et transfert.' }
            ].map((process, idx) => (
              <motion.div 
                key={process.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="glass-dark border border-[var(--border)] p-6 rounded-2xl relative overflow-hidden"
              >
                <div className="text-5xl font-extrabold font-heading text-[var(--bg-deep)] stroke-text absolute top-2 right-4 opacity-30 select-none pointer-events-none" style={{ WebkitTextStroke: '1px var(--text-muted)' }}>
                  {process.step}
                </div>
                <h3 className="font-heading font-bold text-xl mb-3 text-[var(--text-primary)] relative z-10">{process.title}</h3>
                <p className="text-[var(--text-secondary)] text-sm relative z-10">{process.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center py-12">
          <Link href="/contact" className="btn-primary inline-flex text-lg px-8 py-4">
            Démarrer un projet avec moi <ArrowRight className="ml-2" size={20} />
          </Link>
        </section>

      </div>
    </>
  );
}
