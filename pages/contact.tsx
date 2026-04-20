import React, { useState } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, MapPin, Send, Phone } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <>
      <Head>
        <title>Contact | Dolnick Prudhome ENZANZA</title>
        <meta name="description" content="Contactez-moi pour discuter de vos projets en Intelligence Artificielle et Big Data." />
      </Head>

      <div className="container mx-auto px-6 lg:px-12 py-12 lg:py-20">
        
        {/* Page Header */}
        <div className="mb-16 text-center lg:text-left">
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold mb-4">Collaborons sur votre <br/><span className="teal-gradient-text">Prochain Projet</span></h1>
          <div className="w-20 h-1 bg-[var(--accent-teal)] rounded-full mb-6 mx-auto lg:mx-0"></div>
          <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto lg:mx-0">
            Vous avez un projet innovant ou un défi technique à relever ? N'hésitez pas à me contacter pour explorer comment mes compétences peuvent vous aider.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Contact Info Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <div className="glass-dark border border-[var(--border)] rounded-3xl p-8">
              <h3 className="font-heading text-2xl font-bold mb-6">Informations</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[var(--bg-deep)] border border-[var(--border)] rounded-full text-[var(--accent-teal)]">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-[var(--text-muted)] font-medium mb-1">Email Professionnel</p>
                    <a href="mailto:dolnickenzanza@gmail.com" className="text-[var(--text-primary)] hover:text-[var(--accent-teal)] transition-colors">
                      dolnickenzanza@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[var(--bg-deep)] border border-[var(--border)] rounded-full text-[var(--accent-teal)]">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-[var(--text-muted)] font-medium mb-1">WhatsApp</p>
                    <div className="flex flex-col gap-1">
                      <a href="https://wa.me/221784518582" target="_blank" rel="noopener noreferrer" className="text-[var(--text-primary)] hover:text-[var(--accent-teal)] transition-colors">
                        +221 78 451 85 82
                      </a>
                      <a href="https://wa.me/242069462886" target="_blank" rel="noopener noreferrer" className="text-[var(--text-primary)] hover:text-[var(--accent-teal)] transition-colors">
                        +242 06 946 28 86
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[var(--bg-deep)] border border-[var(--border)] rounded-full text-[var(--accent-teal)]">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-[var(--text-muted)] font-medium mb-1">Localisation</p>
                    <p className="text-[var(--text-primary)]">
                      Dakar, Sénégal <br/>
                      <span className="text-xs text-[var(--accent-teal)] bg-[var(--accent-teal)]/10 px-2 py-0.5 rounded-full mt-1 inline-block">Disponible en Remote</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-[var(--border)]">
                <p className="text-sm text-[var(--text-muted)] font-medium mb-4">Réseaux Sociaux</p>
                <div className="flex items-center gap-4">
                  <a href="https://www.linkedin.com/in/dolnick-prudhome-enzanza-024159246" target="_blank" rel="noopener noreferrer" className="btn-secondary px-4 py-2 flex items-center gap-2 text-sm">
                    <Linkedin size={18} /> LinkedIn
                  </a>
                  <a href="https://github.com/DrEPL" target="_blank" rel="noopener noreferrer" className="btn-secondary px-4 py-2 flex items-center gap-2 text-sm">
                    <Github size={18} /> GitHub
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="glass-dark border border-[var(--border)] rounded-3xl p-8 lg:p-12"
            >
              <h2 className="font-heading text-2xl font-bold mb-8">Envoyez-moi un message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-[var(--text-secondary)]">Nom complet</label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name" 
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-[var(--bg-deep)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-teal)] focus:ring-1 focus:ring-[var(--accent-teal)] transition-colors"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-[var(--text-secondary)]">Email professionnel</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-[var(--bg-deep)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-teal)] focus:ring-1 focus:ring-[var(--accent-teal)] transition-colors"
                      placeholder="john@entreprise.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium text-[var(--text-secondary)]">Sujet</label>
                  <input 
                    type="text" 
                    id="subject" 
                    name="subject" 
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full bg-[var(--bg-deep)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-teal)] focus:ring-1 focus:ring-[var(--accent-teal)] transition-colors"
                    placeholder="Proposition de mission / Demande de devis"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-[var(--text-secondary)]">Message</label>
                  <textarea 
                    id="message" 
                    name="message" 
                    rows={5}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full bg-[var(--bg-deep)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-teal)] focus:ring-1 focus:ring-[var(--accent-teal)] transition-colors resize-none"
                    placeholder="Détaillez votre projet ou vos besoins..."
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={status === 'loading'}
                  className={`btn-primary w-full flex items-center justify-center gap-2 text-lg py-4 ${status === 'loading' ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {status === 'loading' ? 'Envoi en cours...' : (
                    <>Envoyer le message <Send size={20} /></>
                  )}
                </button>

                {status === 'success' && (
                  <p className="text-green-500 text-center font-medium mt-4 bg-green-500/10 py-3 rounded-xl border border-green-500/20">
                    Votre message a été envoyé avec succès. Je vous répondrai dans les plus brefs délais.
                  </p>
                )}
                {status === 'error' && (
                  <p className="text-red-500 text-center font-medium mt-4 bg-red-500/10 py-3 rounded-xl border border-red-500/20">
                    Une erreur est survenue lors de l'envoi du message. Veuillez réessayer ou m'envoyer un email directement.
                  </p>
                )}
              </form>
            </motion.div>
          </div>

        </div>
      </div>
    </>
  );
}
