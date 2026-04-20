import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';

const navLinks = [
  { name: 'Accueil', path: '/' },
  { name: 'À Propos', path: '/about' },
  { name: 'Services', path: '/services' },
  { name: 'Portfolio', path: '/portfolio' },
];

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [router.pathname]);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'glass-dark py-3' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto px-6 lg:px-12 flex justify-between items-center">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-transparent group-hover:border-[var(--accent-teal)] transition-all duration-300 bg-[var(--bg-elevated)] flex items-center justify-center">
            <span className="font-brand text-xl teal-gradient-text font-bold">DE</span>
          </div>
          <span className="font-heading font-bold text-lg hidden sm:block tracking-wide">
            Dr<span className="text-[var(--accent-teal)]">.</span> EPL
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link 
                  href={link.path}
                  className={`text-sm font-medium transition-colors hover:text-[var(--accent-teal)] relative
                    ${router.pathname === link.path ? 'text-[var(--accent-teal)]' : 'text-[var(--text-secondary)]'}
                  `}
                >
                  {link.name}
                  {router.pathname === link.path && (
                    <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-[var(--accent-teal)] rounded-full" />
                  )}
                </Link>
              </li>
            ))}
          </ul>
          
          <Link href="/contact" className="btn-primary text-sm">
            Me Contacter
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-[var(--text-primary)] p-2"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      <div className={`md:hidden absolute top-full left-0 w-full glass-dark border-t border-[var(--border)] overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <ul className="flex flex-col py-4 px-6 gap-4">
          {navLinks.map((link) => (
            <li key={link.path}>
              <Link 
                href={link.path}
                className={`block text-base font-medium py-2 transition-colors
                  ${router.pathname === link.path ? 'text-[var(--accent-teal)]' : 'text-[var(--text-secondary)]'}
                `}
              >
                {link.name}
              </Link>
            </li>
          ))}
          <li className="pt-2 mt-2 border-t border-[var(--border)]">
            <Link href="/contact" className="block text-[var(--accent-teal)] font-medium py-2">
              Me Contacter &rarr;
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
