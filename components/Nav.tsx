import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Menu, X, Globe } from 'lucide-react';
import { useT } from '@/lib/useTranslation';
import Flag from './Flag';

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const t = useT();

  const navLinks = [
    { name: t.nav.home, path: '/' },
    { name: t.nav.about, path: '/about' },
    { name: t.nav.services, path: '/services' },
    { name: t.nav.projects, path: '/projets' },
    { name: t.nav.contact, path: '/contact' },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => {
    if (path === '/') return router.pathname === '/';
    return router.pathname.startsWith(path);
  };

  const switchLocale = (locale: string) => {
    router.push(router.asPath, router.asPath, { locale });
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass-dark border-b border-[var(--border)] shadow-lg' : 'bg-transparent'}`}>
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-[var(--accent-teal)]/10 border border-[var(--accent-teal)]/30 flex items-center justify-center group-hover:bg-[var(--accent-teal)]/20 transition-colors">
              <span className="text-[var(--accent-teal)] font-bold font-code text-sm">&lt;/&gt;</span>
            </div>
            <span className="font-brand font-bold text-xl text-[var(--text-primary)] group-hover:text-[var(--accent-teal)] transition-colors">Dr. EPL</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.path}
                href={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all relative ${
                  isActive(link.path)
                    ? 'text-[var(--accent-teal)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {link.name}
                {isActive(link.path) && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-[var(--accent-teal)] rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* Right side: locale switcher + contact */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Locale Switcher */}
            <div className="flex items-center gap-1 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg p-1">
              <Globe size={14} className="text-[var(--text-muted)] ml-1" />
              <button
                onClick={() => switchLocale('fr')}
                className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs font-bold transition-all ${router.locale === 'fr' ? 'bg-[var(--accent-teal)] text-[var(--bg-deep)]' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
              >
                <Flag country="fr" className="w-4 h-3" /> FR
              </button>
              <button
                onClick={() => switchLocale('en')}
                className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs font-bold transition-all ${router.locale === 'en' ? 'bg-[var(--accent-teal)] text-[var(--bg-deep)]' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
              >
                <Flag country="gb" className="w-4 h-3" /> EN
              </button>
            </div>
            <Link href="/contact" className="btn-primary text-sm py-2 px-5">
              {t.nav.contact}
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center gap-2">
            <div className="flex items-center gap-1 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg p-1">
              <button onClick={() => switchLocale('fr')}
                className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-bold ${router.locale === 'fr' ? 'bg-[var(--accent-teal)] text-[var(--bg-deep)]' : 'text-[var(--text-muted)]'}`}>
                <Flag country="fr" className="w-4 h-3" /> FR
              </button>
              <button onClick={() => switchLocale('en')}
                className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-bold ${router.locale === 'en' ? 'bg-[var(--accent-teal)] text-[var(--bg-deep)]' : 'text-[var(--text-muted)]'}`}>
                <Flag country="gb" className="w-4 h-3" /> EN
              </button>
            </div>
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors">
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-[var(--border)] glass-dark rounded-b-2xl">
            <nav className="flex flex-col gap-1 px-2">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive(link.path)
                      ? 'text-[var(--accent-teal)] bg-[var(--accent-teal)]/10'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link href="/contact" onClick={() => setIsOpen(false)}
                className="btn-primary text-sm py-2.5 px-4 mt-2 text-center">
                {t.nav.contact}
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
