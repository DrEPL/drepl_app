import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';
import { useT } from '@/lib/useTranslation';

export default function NotFound() {
  const t = useT();

  return (
    <>
      <Head>
        <title>404 | Dr EPL</title>
        <meta name="robots" content="noindex" />
      </Head>

      <div className="container mx-auto px-6 lg:px-12 py-32 text-center">
        <div className="glass-dark border border-[var(--border)] rounded-3xl p-10 lg:p-16 max-w-2xl mx-auto">
          <h1 className="font-heading text-7xl md:text-8xl font-extrabold mb-4 teal-gradient-text">
            {t.not_found.title}
          </h1>
          <h2 className="font-heading text-2xl md:text-3xl font-bold mb-4">
            {t.not_found.subtitle}
          </h2>
          <p className="text-[var(--text-secondary)] mb-10 leading-relaxed">
            {t.not_found.desc}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/" className="btn-primary flex items-center justify-center gap-2">
              <Home size={18} /> {t.not_found.btn_home}
            </Link>
            <Link href="/projets" className="btn-secondary flex items-center justify-center gap-2">
              <ArrowLeft size={18} /> {t.not_found.btn_projects}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
