import { useState } from 'react';
import { GetServerSideProps } from 'next';
import { isAuthenticated } from '@/lib/auth';
import { supabaseAdmin, ProjectRow } from '@/lib/supabase';
import AdminLayout from '@/components/AdminLayout';
import Head from 'next/head';
import Link from 'next/link';
import { Edit, Plus, Trash2, Eye, AlertTriangle } from 'lucide-react';

interface Props { projects: ProjectRow[] }

export const getServerSideProps: GetServerSideProps = async (context) => {
  
  if (!isAuthenticated(context.req)) return { redirect: { destination: '/admin/login', permanent: false } };

  const { data } = await supabaseAdmin
    .from('projects')
    .select('*')
    .order('display_order', { ascending: true });

  return { props: { projects: data || [] } };
};

export default function ProjectsList({ projects: initialProjects }: Props) {
  const [projects, setProjects] = useState(initialProjects);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const categoryColors: Record<string, string> = {
    'IA': 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    'Big Data': 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    'Web/Mobile': 'text-green-400 bg-green-500/10 border-green-500/20',
    'IoT': 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProjects(prev => prev.filter(p => p.id !== id));
      }
    } finally {
      setDeletingId(null);
      setConfirmDelete(null);
    }
  };

  return (
    <AdminLayout>
      <Head><title>Projets | Admin Dr EPL</title></Head>
      <div className="p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-heading font-bold text-[var(--text-primary)]">Projets</h1>
            <p className="text-[var(--text-muted)] text-sm mt-1">{projects.length} projet{projects.length > 1 ? 's' : ''}</p>
          </div>
          <Link href="/admin/projects/new" className="flex items-center gap-2 bg-[var(--accent-teal)] text-[var(--bg-deep)] font-bold px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity text-sm">
            <Plus size={18} /> Nouveau projet
          </Link>
        </div>

        <div className="glass-dark border border-[var(--border)] rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)] text-left">
                <th className="px-6 py-4 text-xs uppercase tracking-wider text-[var(--text-muted)] font-semibold">Projet</th>
                <th className="px-6 py-4 text-xs uppercase tracking-wider text-[var(--text-muted)] font-semibold">Catégorie</th>
                <th className="px-6 py-4 text-xs uppercase tracking-wider text-[var(--text-muted)] font-semibold">Technologies</th>
                <th className="px-6 py-4 text-xs uppercase tracking-wider text-[var(--text-muted)] font-semibold">Ordre</th>
                <th className="px-6 py-4 text-xs uppercase tracking-wider text-[var(--text-muted)] font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {projects.map(project => (
                <tr key={project.id} className="hover:bg-[var(--bg-elevated)] transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-[var(--text-primary)] text-sm">{project.title}</p>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">/{project.slug}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-md border ${categoryColors[project.category] || ''}`}>
                      {project.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {project.technologies.slice(0, 3).map(t => (
                        <span key={t} className="text-xs text-[var(--text-muted)] px-1.5 py-0.5 border border-[var(--border)] rounded bg-[var(--bg-deep)]">{t}</span>
                      ))}
                      {project.technologies.length > 3 && (
                        <span className="text-xs text-[var(--text-muted)]">+{project.technologies.length - 3}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">{project.display_order}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/portfolio/${project.slug}`}
                        target="_blank"
                        className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--accent-teal)] hover:bg-[var(--accent-teal)]/10 transition-colors"
                        title="Voir"
                      >
                        <Eye size={16} />
                      </Link>
                      <Link
                        href={`/admin/projects/${project.id}`}
                        className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--accent-teal)] hover:bg-[var(--accent-teal)]/10 transition-colors"
                        title="Modifier"
                      >
                        <Edit size={16} />
                      </Link>
                      <button
                        onClick={() => setConfirmDelete(project.id)}
                        className="p-2 rounded-lg text-[var(--text-muted)] hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirm Delete Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass-dark border border-[var(--border)] rounded-2xl p-8 max-w-md w-full text-center">
            <AlertTriangle size={48} className="text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-heading font-bold text-[var(--text-primary)] mb-2">Supprimer ce projet ?</h3>
            <p className="text-[var(--text-muted)] text-sm mb-8">Cette action est irréversible.</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-6 py-2.5 rounded-xl border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors text-sm font-medium"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                disabled={!!deletingId}
                className="px-6 py-2.5 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-colors text-sm disabled:opacity-50"
              >
                {deletingId ? 'Suppression...' : 'Supprimer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
