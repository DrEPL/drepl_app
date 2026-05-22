import { ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FolderKanban, LayoutDashboard, LogOut, Eye } from 'lucide-react';

interface AdminLayoutProps { children: ReactNode }

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();

  const navItems = [
    { href: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
    { href: '/admin/projects', icon: FolderKanban, label: 'Projets' },
  ];

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return router.pathname === href;
    return router.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-deep)] flex">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r border-[var(--border)] bg-[var(--bg-surface)] flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[var(--accent-teal)]/10 border border-[var(--accent-teal)]/20 flex items-center justify-center">
              <span className="text-[var(--accent-teal)] font-bold text-sm">Dr</span>
            </div>
            <div>
              <p className="font-heading font-bold text-[var(--text-primary)] text-sm">EPL Admin</p>
              <p className="text-xs text-[var(--text-muted)]">Panneau de gestion</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ href, icon: Icon, label, exact }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive(href, exact)
                  ? 'bg-[var(--accent-teal)]/10 text-[var(--accent-teal)] border border-[var(--accent-teal)]/20'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-[var(--border)] space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-all"
          >
            <Eye size={18} /> Voir le site
          </Link>
          <button
            onClick={async () => { await fetch('/api/auth/logout', { method: 'POST' }); window.location.href = '/admin/login'; }}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-[var(--text-muted)] hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut size={18} /> Déconnexion
          </button>
          <p className="text-xs text-[var(--text-muted)] px-4 truncate">Dr EPL Admin</p>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
