'use client';

import React from 'react';
import { Calendar, MapPin, Info, AlertCircle } from 'lucide-react';
import { sanitizeHtml } from '@/lib/sanitize-html';

interface EventPreviewCardProps {
  title: string;
  eventDate: string;
  location: string;
  status: string;
  coverImagePreview: string | null;
  editorContent: string;
}

export default function EventPreviewCard({
  title,
  eventDate,
  location,
  status,
  coverImagePreview,
  editorContent,
}: EventPreviewCardProps) {
  const formatDateForDisplay = (dateStr: string) => {
    if (!dateStr) return 'Segera Hadir';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return 'Segera Hadir';
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatShortDateForDisplay = (dateStr: string) => {
    if (!dateStr) return 'Segera Hadir';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return 'Segera Hadir';
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-8 bg-bg-snow/40 p-6 sm:p-8 rounded-3xl border border-border-fine">
      <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-light text-primary text-xs font-semibold border border-primary/10 mb-4">
        <AlertCircle className="w-4 h-4 shrink-0" />
        <span>
          Mode Pratinjau: Event ini akan ditampilkan dengan status <strong>{status}</strong>.
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-7xl mx-auto bg-white p-8 sm:p-12 rounded-2xl border border-border-fine shadow-sm">
        <div className="lg:col-span-8 space-y-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-light text-primary text-xs font-semibold tracking-wide uppercase border border-primary/10">
            <Calendar className="h-3.5 w-3.5" />
            Agenda Kegiatan
          </span>

          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-text-dark tracking-tight leading-[1.2] font-editorial-serif">
            {title || 'Judul Event Anda Akan Tampil di Sini'}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-text-muted text-xs">
            <div className="flex items-center gap-1.5 bg-bg-snow px-3 py-1.5 rounded-full border border-border-fine">
              <Calendar className="h-3.5 w-3.5 text-primary" />
              <span className="font-semibold">{formatShortDateForDisplay(eventDate)}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-bg-snow px-3 py-1.5 rounded-full border border-border-fine">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              <span className="font-semibold">{location || 'Klinik Aisyiyah'}</span>
            </div>
          </div>

          {coverImagePreview && (
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-border-fine my-6">
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
                  '<p className="text-text-muted italic">Isi deskripsi event masih kosong. Tulis event pada tab Tulis Event.</p>'
              ),
            }}
          />
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-bg-snow/50 p-6 rounded-2xl border border-border-fine">
            <h3 className="font-heading font-bold text-xs tracking-widest uppercase text-text-dark mb-4 flex items-center gap-2 border-b border-border-fine pb-3">
              <Info className="h-4 w-4 text-primary" />
              Ringkasan Kegiatan
            </h3>
            <div className="flex flex-col gap-4 text-xs text-text-muted">
              <div>
                <p className="text-[10px] uppercase text-text-muted tracking-wider font-semibold">
                  Tanggal Pelaksanaan
                </p>
                <p className="font-heading font-bold text-text-dark text-sm mt-1">
                  {formatDateForDisplay(eventDate)}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase text-text-muted tracking-wider font-semibold">
                  Tempat/Lokasi
                </p>
                <p className="font-heading font-bold text-text-dark text-sm mt-1">
                  {location || 'Klinik Aisyiyah'}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase text-text-muted tracking-wider font-semibold">
                  Status Pendaftaran
                </p>
                <p className="font-heading font-bold text-primary text-sm mt-1">
                  Terbuka untuk Umum
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
