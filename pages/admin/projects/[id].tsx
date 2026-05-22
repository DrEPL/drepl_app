import { GetServerSideProps } from 'next';
import { isAuthenticated } from '@/lib/auth';
import { supabaseAdmin, ProjectRow } from '@/lib/supabase';
import AdminLayout from '@/components/AdminLayout';
import ProjectForm from '@/components/ProjectForm';
import Head from 'next/head';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, Languages, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

type ProjectFormData = Omit<ProjectRow, 'id' | 'created_at' | 'updated_at'>;

interface Props { project: ProjectRow }

export const getServerSideProps: GetServerSideProps = async (context) => {

  if (!isAuthenticated(context.req)) return { redirect: { destination: '/admin/login', permanent: false } };

  const { data } = await supabaseAdmin
    .from('projects')
    .select('*')
    .eq('id', context.params?.id as string)
    .single();

  if (!data) return { notFound: true };
  return { props: { project: data } };
};

type TranslateStatus = 'idle' | 'loading' | 'success' | 'error';

export default function EditProject({ project }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [translateStatus, setTranslateStatus] = useState<TranslateStatus>('idle');
  const [translateMessage, setTranslateMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (data: ProjectFormData) => {
    setIsLoading(true);
    const res = await fetch(`/api/admin/projects/${project.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Erreur lors de la mise à jour');
    }
    router.push('/admin/projects');
  };

  const handleTranslate = async () => {
    setTranslateStatus('loading');
    setTranslateMessage('');
    try {
      const res = await fetch('/api/admin/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: project.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur de traduction');
      setTranslateStatus('success');
      setTranslateMessage('Traduction enregistrée en base. Rechargez la page pour voir les valeurs EN dans le formulaire.');
      router.replace(router.asPath, undefined, { scroll: false });
    } catch (err: unknown) {
      setTranslateStatus('error');
      setTranslateMessage(err instanceof Error ? err.message : 'Erreur inconnue');
    }
  };

  return (
    <AdminLayout>
      <Head><title>Modifier | Admin Dr EPL</title></Head>
      <div className="p-8 max-w-4xl">
        <div className="mb-8">
          <Link href="/admin/projects" className="inline-flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--accent-teal)] transition-colors text-sm mb-4">
            <ArrowLeft size={16} /> Retour aux projets
          </Link>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <h1 className="text-2xl font-heading font-bold text-[var(--text-primary)]">Modifier : {project.title}</h1>
            <button
              type="button"
              onClick={handleTranslate}
              disabled={translateStatus === 'loading'}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--accent-blue)]/10 border border-[var(--accent-blue)]/30 text-[var(--accent-blue)] hover:bg-[var(--accent-blue)]/20 transition-colors text-sm font-medium disabled:opacity-50"
            >
              {translateStatus === 'loading'
                ? <div className="w-4 h-4 border-2 border-[var(--accent-blue)]/30 border-t-[var(--accent-blue)] rounded-full animate-spin" />
                : <Languages size={16} />}
              {translateStatus === 'loading' ? 'Traduction en cours...' : 'Traduire en anglais'}
            </button>
          </div>
          {translateStatus === 'success' && (
            <div className="mt-4 flex items-start gap-2 text-sm text-green-400 bg-green-500/10 border border-green-500/20 rounded-xl p-3">
              <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
              <span>{translateMessage}</span>
            </div>
          )}
          {translateStatus === 'error' && (
            <div className="mt-4 flex items-start gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{translateMessage}</span>
            </div>
          )}
        </div>
        <ProjectForm initialData={project} onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </AdminLayout>
  );
}
