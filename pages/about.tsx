import React from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { skillCategories } from '@/data/skills';
import { Award, BookOpen, Briefcase, Code, Globe2, Target } from 'lucide-react';
import { useT } from '@/lib/useTranslation';

export default function About() {
  const t = useT();

  return (
    <>
      <Head>
        <title>{t.about.page_title}</title>
        <meta name="description" content="Découvrez mon parcours, ma philosophie et mon expertise technique en Intelligence Artificielle et Big Data." />
      </Head>

      <div className="container mx-auto px-6 lg:px-12 py-12 lg:py-20">

        {/* Page Header */}
        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold mb-4">{t.about.title} <span className="teal-gradient-text">{t.about.title_highlight}</span></h1>
          <div className="w-20 h-1 bg-(--accent-teal) rounded-full"></div>
        </div>

        {/* Presentation */}
        <section className="mb-16">
          <div className="glass-dark p-8 md:p-10 rounded-3xl border border-(--border)">
            <h2 className="text-2xl md:text-3xl font-heading font-bold mb-2 text-(--text-primary)">
              {t.common.i_am} <span className="teal-gradient-text">{t.about.intro_name}</span>
            </h2>
            <h3 className="text-sm font-code font-semibold text-(--text-muted) mb-6 uppercase tracking-wider">{t.about.intro_role}</h3>
            <p className="text-(--text-secondary) text-lg leading-relaxed">
              {t.about.intro_desc}
            </p>
          </div>
        </section>

        {/* Vision & Philosophy */}
        <section className="mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <h2 className="text-2xl md:text-3xl font-heading font-bold flex items-center gap-3">
                <Globe2 className="text-(--accent-teal)" size={28} />
                {t.about.philosophy_title}
              </h2>
              <p className="text-(--text-secondary) text-lg leading-relaxed">
                {t.about.philosophy_p1}
              </p>
              <p className="text-(--text-secondary) text-lg leading-relaxed">
                {t.about.philosophy_p2}
              </p>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="glass-dark p-4 rounded-xl border border-(--border)">
                  <Target className="text-(--accent-teal) mb-2" size={24} />
                  <h4 className="font-heading font-semibold mb-1">{t.about.impact_title}</h4>
                  <p className="text-sm text-(--text-secondary)">{t.about.impact_desc}</p>
                </div>
                <div className="glass-dark p-4 rounded-xl border border-(--border)">
                  <Award className="text-(--accent-teal) mb-2" size={24} />
                  <h4 className="font-heading font-semibold mb-1">{t.about.excellence_title}</h4>
                  <p className="text-sm text-(--text-secondary)">{t.about.excellence_desc}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative rounded-3xl overflow-hidden border border-(--border) glass-dark h-100 flex items-center justify-center p-8"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-[var(--bg-deep)] to-[var(--bg-elevated)] opacity-50"></div>
              <div className="relative z-10 text-center space-y-4">
                <div className="inline-block p-4 rounded-full bg-[var(--accent-teal)]/10 border border-[var(--accent-teal)]/30 mb-4">
                  <Globe2 size={64} className="text-[var(--accent-teal)]" />
                </div>
                <h3 className="font-brand text-3xl teal-gradient-text">{t.about.african_solutions}</h3>
                <p className="text-[var(--text-secondary)] max-w-sm">{t.about.african_tagline}</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Journey Timeline */}
        <section className="mb-24">
          <h2 className="text-2xl md:text-3xl font-heading font-bold mb-10 flex items-center gap-3">
            <Briefcase className="text-(--accent-teal)" size={28} />
            {t.about.journey_title}
          </h2>

          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-[var(--accent-teal)] before:via-[var(--accent-teal)]/50 before:to-transparent">

            {/* Master */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[var(--bg-deep)] bg-[var(--accent-teal)] shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                <BookOpen size={16} className="text-(--bg-deep)" />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] glass-dark p-6 rounded-2xl border border-[var(--border)] hover:border-[var(--accent-teal)]/50 transition-colors">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-2">
                  <h3 className="font-heading font-bold text-lg text-[var(--text-primary)]">{t.about.master_title}</h3>
                  <span className="text-xs font-code text-[var(--accent-teal)] bg-[var(--accent-teal)]/10 px-2 py-1 rounded">{t.about.master_tag}</span>
                </div>
                <h4 className="text-[var(--text-secondary)] text-sm mb-4 font-medium">{t.about.master_school}</h4>
                <p className="text-[var(--text-muted)] text-sm leading-relaxed">
                  {t.about.master_desc}
                </p>
              </div>
            </div>

            {/* Licence */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[var(--bg-deep)] bg-[var(--bg-elevated)] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                <BookOpen size={16} className="text-[var(--text-secondary)]" />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] glass-dark p-6 rounded-2xl border border-[var(--border)] hover:border-[var(--accent-teal)]/50 transition-colors">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-2">
                  <h3 className="font-heading font-bold text-lg text-[var(--text-primary)]">{t.about.licence_title}</h3>
                  <span className="text-xs font-code text-[var(--text-secondary)] bg-[var(--bg-elevated)] px-2 py-1 rounded">{t.about.licence_tag}</span>
                </div>
                <h4 className="text-[var(--text-secondary)] text-sm mb-4 font-medium">{t.about.licence_school}</h4>
                <p className="text-[var(--text-muted)] text-sm leading-relaxed">
                  {t.about.licence_desc}
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* Technical Stack */}
        <section>
          <h2 className="text-2xl md:text-3xl font-heading font-bold mb-10 flex items-center gap-3">
            <Code className="text-[var(--accent-teal)]" size={28} />
            {t.about.skills_title}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {skillCategories.map((category, idx) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="glass-dark p-6 lg:p-8 rounded-2xl border border-[var(--border)]"
              >
                <h3 className="font-heading font-semibold text-lg mb-6 text-[var(--text-primary)] border-b border-[var(--border)] pb-2">{category.title}</h3>
                <div className="space-y-5">
                  {category.skills.map(skill => (
                    <div key={skill.name}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-[var(--text-secondary)]">{skill.name}</span>
                        <span className="text-xs font-code text-[var(--accent-teal)]">{skill.level}%</span>
                      </div>
                      <div className="h-2 w-full bg-[var(--bg-deep)] rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.2 }}
                          className="h-full bg-gradient-to-r from-[var(--accent-teal-dark)] to-[var(--accent-teal)] rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

      </div>
    </>
  );
}
