import { GetServerSideProps } from 'next';
import { isAuthenticated } from '@/lib/auth';
import { supabaseAdmin, ProjectRow } from '@/lib/supabase';
import AdminLayout from '@/components/AdminLayout';
import ProjectForm from '@/components/ProjectForm';
import Head from 'next/head';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft } from 'lucide-react';
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

export default function EditProject({ project }: Props) {
  const [isLoading, setIsLoading] = useState(false);
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

  return (
    <AdminLayout>
      <Head><title>Modifier | Admin Dr EPL</title></Head>
      <div className="p-8 max-w-4xl">
        <div className="mb-8">
          <Link href="/admin/projects" className="inline-flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--accent-teal)] transition-colors text-sm mb-4">
            <ArrowLeft size={16} /> Retour aux projets
          </Link>
          <h1 className="text-2xl font-heading font-bold text-[var(--text-primary)]">Modifier : {project.title}</h1>
        </div>
        <ProjectForm initialData={project} onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </AdminLayout>
  );
}
