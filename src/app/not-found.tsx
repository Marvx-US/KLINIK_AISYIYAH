import React from 'react';
import Link from 'next/link';
import { type Metadata } from 'next';
import { FileSearch, Home, ArrowLeft } from 'lucide-react';

/**
 * Global 404 Not Found Page — BLOCKER B4 (production-readiness)
 * Ditampilkan saat notFound() dipanggil atau URL tidak cocok dengan route apapun.
 * Server Component — tidak perlu 'use client'.
 */

export const metadata: Metadata = {
  title: 'Halaman Tidak Ditemukan — Klinik Aisyiyah',
  description: 'Halaman yang Anda cari tidak ditemukan. Silakan kembali ke beranda.',
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg-snow flex items-center justify-center px-6">
      <div className="max-w-lg w-full text-center">
        {/* Angka 404 besar */}
        <p className="font-heading font-extrabold text-8xl text-primary/20 select-none leading-none mb-2">
          404
        </p>

        {/* Ikon */}
        <div className="flex justify-center mb-6">
          <div className="h-20 w-20 rounded-full bg-primary-light border border-primary/10 flex items-center justify-center">
            <FileSearch className="h-10 w-10 text-primary" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="font-heading font-extrabold text-2xl text-text-dark mb-3">
          Halaman Tidak Ditemukan
        </h1>
        <p className="text-text-muted text-sm leading-relaxed mb-8 max-w-sm mx-auto">
          Halaman yang Anda cari mungkin sudah dipindahkan, dihapus, atau
          URL-nya salah ketik. Silakan cek kembali alamatnya.
        </p>

        {/* Tombol aksi */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-primary text-white font-semibold text-sm hover:bg-primary-dark transition-colors"
          >
            <Home className="h-4 w-4" />
            Kembali ke Beranda
          </Link>
          <Link
            href="/services"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-border-fine bg-white text-text-dark font-semibold text-sm hover:bg-bg-snow transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Lihat Layanan Kami
          </Link>
        </div>

        {/* Link bantuan */}
        <p className="mt-8 text-xs text-text-muted">
          Butuh bantuan?{' '}
          <Link href="/contact" className="text-primary hover:underline font-semibold">
            Hubungi kami
          </Link>
        </p>
      </div>
    </div>
  );
}
