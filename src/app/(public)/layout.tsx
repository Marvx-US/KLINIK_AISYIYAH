import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

/**
 * PublicLayout — Layout wrapper untuk semua halaman publik (/beranda, /articles, /events, /contact).
 * Menyertakan Navbar di atas dan Footer di bawah secara konsisten.
 */
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-bg-snow">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
