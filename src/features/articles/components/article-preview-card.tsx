'use client';

import React from 'react';
import { Tag, Calendar, AlertCircle } from 'lucide-react';
import { sanitizeHtml } from '@/lib/sanitize-html';

interface ArticlePreviewCardProps {
  title: string;
  summary: string;
  category: string;
  status: string;
  coverImagePreview: string | null;
  editorContent: string;
}

export default function ArticlePreviewCard({
  title,
  summary,
  category,
  status,
  coverImagePreview,
  editorContent,
}: ArticlePreviewCardProps) {
  return (
    <div className="space-y-8 bg-bg-snow/40 p-6 sm:p-8 rounded-3xl border border-border-fine">
      <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-light text-primary text-xs font-semibold border border-primary/10 mb-4">
        <AlertCircle className="w-4 h-4 shrink-0" />
        <span>
          Mode Pratinjau: Artikel ini akan ditampilkan dengan status <strong>{status}</strong>.
        </span>
      </div>

      <div className="max-w-4xl mx-auto bg-white p-8 sm:p-12 rounded-2xl border border-border-fine shadow-sm">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-light text-primary text-xs font-semibold tracking-wide uppercase mb-6 border border-primary/10">
          <Tag className="h-3.5 w-3.5" />
          {category || 'Kategori Artikel'}
        </span>

        <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-text-dark tracking-tight leading-[1.2] mb-6 font-editorial-serif">
          {title || 'Judul Artikel Anda Akan Tampil di Sini'}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-text-muted text-xs mb-8 border-b border-border-fine pb-6">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-primary" />
            <span>
              {new Date().toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
          <span>•</span>
          <span>
            Ditulis oleh: <strong>Klinik Aisyiyah (Admin)</strong>
          </span>
        </div>

        {summary && (
          <div className="bg-bg-snow p-5 rounded-xl border-l-4 border-primary text-text-muted text-sm italic mb-8">
            {summary}
          </div>
        )}

        {coverImagePreview && (
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-border-fine mb-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={coverImagePreview}
              alt="Cover Preview"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div
          className="prose prose-neutral max-w-none font-sans text-text-dark/95 leading-relaxed text-base"
          dangerouslySetInnerHTML={{
            __html: sanitizeHtml(
              editorContent ||
                '<p className="text-text-muted italic">Isi konten masih kosong. Tulis artikel pada tab Tulis Artikel.</p>'
            ),
          }}
        />
      </div>
    </div>
  );
}
