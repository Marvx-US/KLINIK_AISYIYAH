'use client';

/**
 * Global Error Boundary — BLOCKER B4 (production-readiness)
 * Menampilkan halaman error yang ramah pengguna saat terjadi uncaught error
 * di Server Components. Mencegah stack trace terekspos ke publik.
 *
 * Wajib 'use client' — Next.js mensyaratkan error.tsx sebagai Client Component.
 */

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log ke monitoring — di production bisa diarahkan ke Sentry / Logtail
    console.error('[UNCAUGHT_ERROR]:', error.digest ?? error.message);
  }, [error]);

  return (
    <html lang="id">
      <body>
        <div className="min-h-screen bg-bg-snow flex items-center justify-center px-6">
          <div className="max-w-md w-full text-center">
            {/* Ikon */}
            <div className="flex justify-center mb-6">
              <div className="h-20 w-20 rounded-full bg-red-50 border border-red-100 flex items-center justify-center">
                <AlertTriangle className="h-10 w-10 text-red-500" />
              </div>
            </div>

            {/* Heading */}
            <h1 className="font-heading font-extrabold text-2xl text-text-dark mb-3">
              Ups, Terjadi Kesalahan
            </h1>
            <p className="text-text-muted text-sm leading-relaxed mb-8">
              Terjadi kesalahan tak terduga pada server. Tim kami sudah diberitahu.
              Coba muat ulang halaman atau kembali ke beranda.
            </p>

            {/* Error digest untuk debugging (tidak ekspos detail stack) */}
            {error.digest && (
              <p className="text-xs text-text-muted mb-6 font-mono bg-gray-100 rounded-lg px-3 py-2 inline-block">
                Kode Error: {error.digest}
              </p>
            )}

            {/* Tombol aksi */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={reset}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-primary text-white font-semibold text-sm hover:bg-primary-dark transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                Coba Lagi
              </button>
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-border-fine bg-white text-text-dark font-semibold text-sm hover:bg-bg-snow transition-colors"
              >
                <Home className="h-4 w-4" />
                Kembali ke Beranda
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
