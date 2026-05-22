import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <>
      <Head>
        <title>Page introuvable | Dr EPL</title>
        <meta name="robots" content="noindex" />
      </Head>

      <div className="container mx-auto px-6 lg:px-12 py-32 text-center">
        <div className="glass-dark border border-[var(--border)] rounded-3xl p-10 lg:p-16 max-w-2xl mx-auto">
          <h1 className="font-heading text-7xl md:text-8xl font-extrabold mb-4 teal-gradient-text">
            404
          </h1>
          <h2 className="font-heading text-2xl md:text-3xl font-bold mb-4">
            Page introuvable
          </h2>
          <p className="text-[var(--text-secondary)] mb-10 leading-relaxed">
            Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/" className="btn-primary flex items-center justify-center gap-2">
              <Home size={18} /> Accueil
            </Link>
            <Link href="/projets" className="btn-secondary flex items-center justify-center gap-2">
              <ArrowLeft size={18} /> Voir les projets
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
