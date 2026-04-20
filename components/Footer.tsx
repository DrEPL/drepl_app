import React from 'react';
import Link from 'next/link';
import { Github, Linkedin, Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[var(--bg-elevated)]/30 mt-20 overflow-hidden">
      {/* ── Glowing Top Border ── */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--accent-teal)] to-transparent opacity-40" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 max-w-2xl h-[2px] bg-gradient-to-r from-transparent via-[var(--accent-teal)] to-transparent blur-[2px] opacity-80" />

      {/* Decorative Background Flares */}
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[var(--accent-teal)]/5 to-transparent rounded-full blur-3xl -translate-x-1/2 translate-y-1/2 pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[var(--accent-teal)]/5 to-transparent rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-12 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          
          {/* Brand & Bio */}
          <div className="md:col-span-5 space-y-6">
            <Link href="/" className="inline-block group">
              <span className="font-heading font-bold text-3xl tracking-wide group-hover:drop-shadow-[0_0_10px_rgba(45,212,191,0.5)] transition-all">
                Dr<span className="text-[var(--accent-teal)]">.</span> EPL
              </span>
            </Link>
            <p className="text-[var(--text-secondary)] text-sm max-w-sm leading-relaxed">
              Ingénieur IA & Big Data passionné par le développement de solutions intelligentes et innovantes, adaptées aux réalités africaines. Transformons vos idées en réalité.
            </p>
            <div className="flex items-center gap-4 pt-4">
              <a href="https://github.com/DrEPL" target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 rounded-xl text-[var(--text-secondary)] hover:text-white hover:bg-[var(--accent-teal)] transition-all duration-300 shadow-sm hover:shadow-[0_0_15px_rgba(45,212,191,0.4)] border border-[var(--border)] hover:border-transparent group">
                <Github size={18} className="group-hover:scale-110 transition-transform" />
              </a>
              <a href="https://www.linkedin.com/in/dolnick-prudhome-enzanza-024159246" target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 rounded-xl text-[var(--text-secondary)] hover:text-white hover:bg-[#0077B5] transition-all duration-300 shadow-sm hover:shadow-[0_0_15px_rgba(0,119,181,0.4)] border border-[var(--border)] hover:border-transparent group">
                <Linkedin size={18} className="group-hover:scale-110 transition-transform" />
              </a>
              <a href="mailto:dolnickenzanza@gmail.com" className="p-3 bg-white/5 rounded-xl text-[var(--text-secondary)] hover:text-white hover:bg-[#EA4335] transition-all duration-300 shadow-sm hover:shadow-[0_0_15px_rgba(234,67,53,0.4)] border border-[var(--border)] hover:border-transparent group">
                <Mail size={18} className="group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3">
            <h3 className="font-heading font-semibold text-lg mb-6 text-[var(--text-primary)] border-b border-[var(--border)] pb-2 inline-block">Navigation</h3>
            <ul className="space-y-3">
              {[
                { label: 'Accueil', path: '/' },
                { label: 'À Propos', path: '/about' },
                { label: 'Services', path: '/services' },
                { label: 'Portfolio', path: '/portfolio' },
                { label: 'Contact', path: '/contact' }
              ].map((link) => (
                <li key={link.path}>
                  <Link href={link.path} className="text-[var(--text-secondary)] hover:text-[var(--accent-teal)] transition-colors text-sm flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-teal)] opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    <span className="group-hover:translate-x-1 transition-transform">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="md:col-span-4">
            <h3 className="font-heading font-semibold text-lg mb-6 text-[var(--text-primary)] border-b border-[var(--border)] pb-2 inline-block">Me Contacter</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-4 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-[var(--accent-teal)]/30 hover:bg-white/10 transition-colors group">
                <Mail className="w-5 h-5 text-[var(--accent-teal)] flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <a href="mailto:dolnickenzanza@gmail.com" className="text-sm text-[var(--text-secondary)] group-hover:text-white transition-colors">
                  dolnickenzanza@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-4 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-[var(--accent-teal)]/30 hover:bg-white/10 transition-colors group">
                <Phone className="w-5 h-5 text-[var(--accent-teal)] flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <div className="flex flex-col gap-1 text-sm text-[var(--text-secondary)]">
                  <a href="https://wa.me/221784518582" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                    +221 78 451 85 82 (WA)
                  </a>
                  <a href="https://wa.me/242069462886" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                    +242 06 946 28 86 (WA)
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-4 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-[var(--accent-teal)]/30 hover:bg-white/10 transition-colors group">
                <MapPin className="w-5 h-5 text-[var(--accent-teal)] flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <span className="text-sm text-[var(--text-secondary)] group-hover:text-white transition-colors">
                  Dakar, Sénégal<br/>(Disponible en remote)
                </span>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-[var(--border)] mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 relative">
          <p className="text-[var(--text-muted)] text-sm">
            &copy; {currentYear} Dr EPL. Tous droits réservés.
          </p>
          <div className="flex items-center gap-2 text-[var(--text-muted)] text-xs">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Disponible pour de nouvelles missions
          </div>
        </div>
      </div>
    </footer>
  );
}
