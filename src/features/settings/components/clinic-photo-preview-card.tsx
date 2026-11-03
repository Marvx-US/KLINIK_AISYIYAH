'use client';

import React from 'react';
import Image from 'next/image';
import { ImagePlus } from 'lucide-react';

interface ClinicPhotoPreviewCardProps {
  displaySrc: string | null;
  preview: string | null;
  onClick: () => void;
}

export default function ClinicPhotoPreviewCard({
  displaySrc,
  preview,
  onClick,
}: ClinicPhotoPreviewCardProps) {
  return (
    <div className="space-y-3">
      <h3 className="font-heading font-bold text-sm text-text-dark uppercase tracking-wider">
        Pratinjau Foto
      </h3>
      <div
        className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border-2 border-dashed border-border-fine bg-bg-snow group cursor-pointer"
        onClick={onClick}
        role="button"
        aria-label="Klik untuk pilih gambar baru"
      >
        {displaySrc ? (
          <>
            <Image
              src={displaySrc}
              alt="Foto Tentang Klinik"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              unoptimized
            />
            <div className="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/40 transition-all duration-300 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center gap-2 text-white">
                <ImagePlus className="w-8 h-8" />
                <span className="text-xs font-bold">Ganti Foto</span>
              </div>
            </div>
            {preview && (
              <div className="absolute top-3 left-3 bg-amber-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                Pratinjau — Belum Disimpan
              </div>
            )}
            {!preview && (
              <div className="absolute top-3 left-3 bg-primary text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                ✓ Foto Aktif Saat Ini
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-text-muted">
            <div className="w-16 h-16 rounded-2xl bg-primary-light flex items-center justify-center">
              <ImagePlus className="w-8 h-8 text-primary" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-sm">Belum ada foto yang diatur</p>
              <p className="text-xs mt-1">Klik untuk pilih foto</p>
            </div>
          </div>
        )}
      </div>
      <p className="text-xs text-text-muted text-center">
        Klik pada area foto untuk mengganti gambar
      </p>
    </div>
  );
}
