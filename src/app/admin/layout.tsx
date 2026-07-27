import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSession, logout } from '@/lib/auth';
import { LayoutDashboard, FileText, CalendarRange, LogOut, Heart, User, Users } from 'lucide-react';

export const revalidate = 0;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  // TypeScript: session adalah non-null setelah guard redirect di atas
  const currentSession = session!;

  // Handle logout via form action (Server Action)
  async function handleLogout() {
    'use server';
    await logout();
    redirect('/login');
  }

  return (
    <div className="min-h-screen flex bg-bg-snow">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-white border-fine-r flex flex-col shrink-0">
        {/* Sidebar Header */}
        <div className="h-20 px-8 border-fine-b flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white">
            <Heart className="h-4.5 w-4.5 fill-current" />
          </div>
          <div>
            <span className="font-heading font-extrabold text-base tracking-tight text-text-dark">
              Aisyiyah <span className="text-primary">Admin</span>
            </span>
          </div>
        </div>

        {/* User profile brief */}
        <div className="p-6 border-fine-b flex items-center gap-3 bg-bg-snow/50">
          <div className="h-10 w-10 rounded-full bg-primary-light flex items-center justify-center text-primary border border-primary/10">
            <User className="h-5 w-5" />
          </div>
          <div className="overflow-hidden">
            <p className="font-heading font-bold text-sm text-text-dark truncate">{currentSession.name}</p>
            <p className="text-xs text-text-muted capitalize">{currentSession.role.toLowerCase()}</p>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-grow p-6 flex flex-col gap-2">
          <Link
            href="/admin"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold tracking-wide text-text-muted hover:text-primary hover:bg-primary-light transition-all"
          >
            <LayoutDashboard className="h-4.5 w-4.5" />
            Dashboard
          </Link>
          <Link
            href="/admin/articles"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold tracking-wide text-text-muted hover:text-primary hover:bg-primary-light transition-all"
          >
            <FileText className="h-4.5 w-4.5" />
            Kelola Artikel
          </Link>
          <Link
            href="/admin/events"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold tracking-wide text-text-muted hover:text-primary hover:bg-primary-light transition-all"
          >
            <CalendarRange className="h-4.5 w-4.5" />
            Kelola Event
          </Link>
          <Link
            href="/admin/banners"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold tracking-wide text-text-muted hover:text-primary hover:bg-primary-light transition-all"
          >
            {/* Menggunakan ImageIcon dari lucide-react jika di-import, atau cukup pakai FileText/Heart */}
            <FileText className="h-4.5 w-4.5" />
            Kelola Banner Latar
          </Link>
          <Link
            href="/admin/facilities"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold tracking-wide text-text-muted hover:text-primary hover:bg-primary-light transition-all"
          >
            <Heart className="h-4.5 w-4.5" />
            Kelola Fasilitas
          </Link>
          <Link
            href="/admin/partners"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold tracking-wide text-text-muted hover:text-primary hover:bg-primary-light transition-all"
          >
            <Users className="h-4.5 w-4.5" />
            Kelola Mitra Kerjasama
          </Link>
        </nav>

        {/* Sidebar Footer (Logout) */}
        <div className="p-6 border-fine-t mt-auto">
          <form action={handleLogout}>
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold tracking-wide text-red-600 hover:bg-red-50 transition-all text-left"
            >
              <LogOut className="h-4.5 w-4.5" />
              Keluar Sesi
            </button>
          </form>
        </div>
      </aside>

      {/* Main Admin Content */}
      <div className="flex-grow flex flex-col">
        {/* Top Navbar */}
        <header className="h-20 bg-white border-fine-b px-8 md:px-12 flex justify-between items-center shrink-0">
          <h2 className="font-heading font-bold text-lg text-text-dark">Portal Pengelolaan Konten</h2>
          <div className="flex items-center gap-3 text-sm text-text-muted">
            <span>Sesi aktif sebagai: <strong className="text-text-dark font-semibold">{currentSession.username}</strong></span>
          </div>
        </header>

        {/* Main Scrollable Area */}
        <main className="flex-grow p-8 md:p-12 overflow-y-auto max-w-7xl w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
