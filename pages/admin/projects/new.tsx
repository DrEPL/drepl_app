import { GetServerSideProps } from 'next';
import { isAuthenticated } from '@/lib/auth';
import AdminLayout from '@/components/AdminLayout';
import ProjectForm from '@/components/ProjectForm';
import Head from 'next/head';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { ProjectRow } from '@/lib/supabase';

type ProjectFormData = Omit<ProjectRow, 'id' | 'created_at' | 'updated_at'>;

export const getServerSideProps: GetServerSideProps = async (context) => {
  
  if (!isAuthenticated(context.req)) return { redirect: { destination: '/admin/login', permanent: false } };
  return { props: {} };
};

export default function NewProject() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (data: ProjectFormData) => {
    setIsLoading(true);
    const res = await fetch('/api/admin/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Erreur lors de la création');
    }
    router.push('/admin/projects');
  };

  return (
    <AdminLayout>
      <Head><title>Nouveau projet | Admin Dr EPL</title></Head>
      <div className="p-8 max-w-4xl">
        <div className="mb-8">
          <Link href="/admin/projects" className="inline-flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--accent-teal)] transition-colors text-sm mb-4">
            <ArrowLeft size={16} /> Retour aux projets
          </Link>
          <h1 className="text-2xl font-heading font-bold text-[var(--text-primary)]">Nouveau projet</h1>
        </div>
        <ProjectForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </AdminLayout>
  );
}
