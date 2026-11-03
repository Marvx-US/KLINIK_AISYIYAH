import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface SectionHeaderProps {
  eyebrow: string;
  heading: string;
  /** Teks tautan "Lihat Semua" — opsional */
  linkText?: string;
  /** URL tujuan tautannya */
  linkHref?: string;
  /** Deskripsi opsional di sebelah kanan heading */
  description?: string;
}

/**
 * SectionHeader — Komponen header section yang konsisten di seluruh halaman publik.
 * Menampilkan eyebrow label, heading utama, deskripsi opsional, dan tautan "lihat semua".
 */
export default function SectionHeader({
  eyebrow,
  heading,
  linkText,
  linkHref,
  description,
}: SectionHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
      <div className="max-w-2xl">
        <span className="text-xs font-bold text-primary uppercase tracking-widest block mb-3">
          {eyebrow}
        </span>
        <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-text-dark tracking-tight font-editorial-serif">
          {heading}
        </h2>
      </div>

      {description && (
        <p className="text-text-muted max-w-md text-sm leading-relaxed">{description}</p>
      )}

      {linkText && linkHref && (
        <Link
          href={linkHref}
          className="inline-flex items-center gap-1.5 text-primary text-sm font-semibold hover:text-primary-dark transition-colors shrink-0"
        >
          {linkText}
          <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}
