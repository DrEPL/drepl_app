import React, { useState } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, MapPin, Send } from 'lucide-react';
import WhatsAppIcon from '@/components/WhatsAppIcon';
import { useT } from '@/lib/useTranslation';

export default function Contact() {
  const t = useT();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '', website: '' });
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
        setFormData({ name: '', email: '', subject: '', message: '', website: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <>
      <Head>
        <title>{t.contact.page_title}</title>
        <meta name="description" content={t.meta.contact_description} />
      </Head>

      <div className="container mx-auto px-6 lg:px-12 py-12 lg:py-20">

        {/* Page Header */}
        <div className="mb-16 text-center lg:text-left">
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold mb-4">
            {t.contact.title} <span className="teal-gradient-text">{t.contact.title_highlight}</span>
          </h1>
          <div className="w-20 h-1 bg-[var(--accent-teal)] rounded-full mb-6 mx-auto lg:mx-0"></div>
          <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto lg:mx-0">
            {t.contact.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Contact Info Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <div className="glass-dark border border-[var(--border)] rounded-3xl p-8">
              <h3 className="font-heading text-2xl font-bold mb-6">{t.contact.info_section_title}</h3>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[var(--bg-deep)] border border-[var(--border)] rounded-full text-[var(--accent-teal)]">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-[var(--text-muted)] font-medium mb-1">{t.contact.info_email}</p>
                    <a href="mailto:dolnickenzanza@gmail.com" className="text-[var(--text-primary)] hover:text-[var(--accent-teal)] transition-colors">
                      dolnickenzanza@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[var(--bg-deep)] border border-[var(--border)] rounded-full text-[var(--accent-teal)]">
                    <WhatsAppIcon size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-[var(--text-muted)] font-medium mb-1">{t.contact.info_phone}</p>
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
                    <p className="text-sm text-[var(--text-muted)] font-medium mb-1">{t.contact.info_location}</p>
                    <p className="text-[var(--text-primary)]">
                      {t.contact.info_location_val} <br />
                      <span className="text-xs text-[var(--accent-teal)] bg-[var(--accent-teal)]/10 px-2 py-0.5 rounded-full mt-1 inline-block">{t.contact.info_location_sub}</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-[var(--border)]">
                <p className="text-sm text-[var(--text-muted)] font-medium mb-4">{t.contact.social_title}</p>
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
              <h2 className="font-heading text-2xl font-bold mb-8">{t.contact.form_section_title}</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Honeypot anti-bot */}
                <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}>
                  <label htmlFor="website">{t.contact.honeypot_label}</label>
                  <input
                    type="text"
                    id="website"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={formData.website}
                    onChange={handleChange}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-[var(--text-secondary)]">{t.contact.form_name}</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-[var(--bg-deep)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-teal)] focus:ring-1 focus:ring-[var(--accent-teal)] transition-colors"
                      placeholder={t.contact.name_placeholder}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-[var(--text-secondary)]">{t.contact.form_email}</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-[var(--bg-deep)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-teal)] focus:ring-1 focus:ring-[var(--accent-teal)] transition-colors"
                      placeholder={t.contact.email_placeholder}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium text-[var(--text-secondary)]">{t.contact.form_subject}</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full bg-[var(--bg-deep)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-teal)] focus:ring-1 focus:ring-[var(--accent-teal)] transition-colors"
                    placeholder={t.contact.subject_placeholder}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-[var(--text-secondary)]">{t.contact.form_message}</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full bg-[var(--bg-deep)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-teal)] focus:ring-1 focus:ring-[var(--accent-teal)] transition-colors resize-none"
                    placeholder={t.contact.message_placeholder}
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className={`btn-primary w-full flex items-center justify-center gap-2 text-lg py-4 ${status === 'loading' ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {status === 'loading' ? t.contact.form_sending : (
                    <>{t.contact.form_submit} <Send size={20} /></>
                  )}
                </button>

                {status === 'success' && (
                  <p className="text-green-500 text-center font-medium mt-4 bg-green-500/10 py-3 rounded-xl border border-green-500/20">
                    {t.contact.success_desc}
                  </p>
                )}
                {status === 'error' && (
                  <p className="text-red-500 text-center font-medium mt-4 bg-red-500/10 py-3 rounded-xl border border-red-500/20">
                    {t.contact.error_msg}
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
