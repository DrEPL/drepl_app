import { useState } from 'react';
import type { GetServerSideProps } from 'next';
import { isAuthenticated } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';
import Head from 'next/head';
import { Lock, LogIn, AlertCircle, ShieldCheck } from 'lucide-react';

interface Props { isFirstTime: boolean }

export const getServerSideProps: GetServerSideProps = async (context) => {
  if (isAuthenticated(context.req)) {
    return { redirect: { destination: '/admin', permanent: false } };
  }
  const { data } = await supabaseAdmin.from('admin_settings').select('id').single();
  return { props: { isFirstTime: !data } };
};

export default function AdminLogin({ isFirstTime }: Props) {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'setup' | 'login'>(isFirstTime ? 'setup' : 'login');

  const inputClass = "w-full bg-[var(--bg-deep)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-teal)] transition-colors placeholder:text-[var(--text-muted)]";

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 8) { setError('Minimum 8 caractères.'); return; }
    if (password !== confirm) { setError('Les mots de passe ne correspondent pas.'); return; }
    setLoading(true);
    const res = await fetch('/api/admin/setup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) {
      const d = await res.json();
      setError(d.error || 'Erreur lors de la configuration.');
      setLoading(false);
      return;
    }
    setMode('login');
    setPassword('');
    setConfirm('');
    setLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) {
      const d = await res.json();
      setError(d.error || 'Mot de passe incorrect.');
      setLoading(false);
      return;
    }
    window.location.href = '/admin';
  };

  return (
    <>
      <Head><title>Admin | Dr EPL</title></Head>
      <div className="min-h-screen bg-[var(--bg-deep)] flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--accent-teal)]/10 border border-[var(--accent-teal)]/20 mb-4">
              {mode === 'setup'
                ? <ShieldCheck size={28} className="text-[var(--accent-teal)]" />
                : <Lock size={28} className="text-[var(--accent-teal)]" />}
            </div>
            <h1 className="text-2xl font-heading font-bold text-[var(--text-primary)]">
              {mode === 'setup' ? 'Première connexion' : 'Accès Admin'}
            </h1>
            <p className="text-[var(--text-muted)] text-sm mt-1">
              {mode === 'setup' ? 'Créez votre mot de passe administrateur' : 'Panneau de gestion Dr EPL'}
            </p>
          </div>

          <div className="glass-dark border border-[var(--border)] rounded-2xl p-8">
            {mode === 'setup' ? (
              <form onSubmit={handleSetup} className="space-y-4">
                {error && (
                  <div className="flex items-center gap-2 text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-sm">
                    <AlertCircle size={16} /> {error}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Mot de passe</label>
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                    className={inputClass} placeholder="••••••••" required minLength={8} autoFocus />
                  <p className="text-xs text-[var(--text-muted)] mt-1">Minimum 8 caractères</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Confirmer</label>
                  <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
                    className={inputClass} placeholder="••••••••" required />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full bg-[var(--accent-teal)] text-[var(--bg-deep)] font-bold py-3 px-4 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50 mt-2">
                  {loading
                    ? <div className="w-5 h-5 border-2 border-[var(--bg-deep)]/30 border-t-[var(--bg-deep)] rounded-full animate-spin" />
                    : <><ShieldCheck size={18} /> Créer le mot de passe</>}
                </button>
              </form>
            ) : (
              <form onSubmit={handleLogin} className="space-y-4">
                {error && (
                  <div className="flex items-center gap-2 text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-sm">
                    <AlertCircle size={16} /> {error}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Mot de passe</label>
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                    className={inputClass} placeholder="••••••••" required autoFocus />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full bg-[var(--accent-teal)] text-[var(--bg-deep)] font-bold py-3 px-4 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50">
                  {loading
                    ? <div className="w-5 h-5 border-2 border-[var(--bg-deep)]/30 border-t-[var(--bg-deep)] rounded-full animate-spin" />
                    : <><LogIn size={18} /> Se connecter</>}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
