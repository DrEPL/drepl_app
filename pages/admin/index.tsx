import { GetServerSideProps } from 'next';
import { isAuthenticated } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';
import AdminLayout from '@/components/AdminLayout';
import Head from 'next/head';
import Link from 'next/link';
import { FolderKanban, Plus, TrendingUp } from 'lucide-react';

interface DashboardProps {
  projectCount: number;
  categoryCounts: Record<string, number>;
  recentProjects: { id: string; title: string; category: string; updated_at: string }[];
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  
  if (!isAuthenticated(context.req)) return { redirect: { destination: '/admin/login', permanent: false } };

  const { data: projects } = await supabaseAdmin
    .from('projects')
    .select('id, title, category, updated_at')
    .order('updated_at', { ascending: false });

  const categoryCounts: Record<string, number> = {};
  (projects || []).forEach(p => {
    categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
  });

  return {
    props: {
      projectCount: projects?.length || 0,
      categoryCounts,
      recentProjects: (projects || []).slice(0, 5),
    },
  };
};

export default function AdminDashboard({ projectCount, categoryCounts, recentProjects }: DashboardProps) {
  const categoryColors: Record<string, string> = {
    'IA': 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    'Big Data': 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    'Web/Mobile': 'text-green-400 bg-green-500/10 border-green-500/20',
    'IoT': 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  };

  return (
    <AdminLayout>
      <Head><title>Dashboard | Admin Dr EPL</title></Head>
      <div className="p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-heading font-bold text-[var(--text-primary)]">Dashboard</h1>
            <p className="text-[var(--text-muted)] text-sm mt-1">Vue d&apos;ensemble de votre portfolio</p>
          </div>
          <Link href="/admin/projects/new" className="flex items-center gap-2 bg-[var(--accent-teal)] text-[var(--bg-deep)] font-bold px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity text-sm">
            <Plus size={18} /> Nouveau projet
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="glass-dark border border-[var(--border)] rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--accent-teal)]/10 flex items-center justify-center">
                <FolderKanban size={20} className="text-[var(--accent-teal)]" />
              </div>
              <span className="text-sm text-[var(--text-muted)]">Total projets</span>
            </div>
            <p className="text-3xl font-heading font-bold text-[var(--text-primary)]">{projectCount}</p>
          </div>

          {Object.entries(categoryCounts).map(([cat, count]) => (
            <div key={cat} className="glass-dark border border-[var(--border)] rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${categoryColors[cat] || 'bg-gray-500/10'}`}>
                  <TrendingUp size={20} />
                </div>
                <span className="text-sm text-[var(--text-muted)]">{cat}</span>
              </div>
              <p className="text-3xl font-heading font-bold text-[var(--text-primary)]">{count}</p>
            </div>
          ))}
        </div>

        {/* Recent projects */}
        <div className="glass-dark border border-[var(--border)] rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-[var(--border)] flex items-center justify-between">
            <h2 className="font-heading font-semibold text-[var(--text-primary)]">Projets récents</h2>
            <Link href="/admin/projects" className="text-sm text-[var(--accent-teal)] hover:underline">Voir tout →</Link>
          </div>
          <div className="divide-y divide-[var(--border)]">
            {recentProjects.map(p => (
              <div key={p.id} className="flex items-center justify-between px-6 py-4 hover:bg-[var(--bg-elevated)] transition-colors">
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-0.5 rounded-md border ${categoryColors[p.category] || ''}`}>{p.category}</span>
                  <span className="text-sm font-medium text-[var(--text-primary)]">{p.title}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-[var(--text-muted)]">
                    {new Date(p.updated_at).toLocaleDateString('fr-FR')}
                  </span>
                  <Link href={`/admin/projects/${p.id}`} className="text-xs text-[var(--accent-teal)] hover:underline">
                    Modifier
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
