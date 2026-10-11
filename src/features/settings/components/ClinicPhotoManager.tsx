'use client';

import React, { useState, useRef, useTransition, useEffect } from 'react';
import Image from 'next/image';
import { ImagePlus, Upload, CheckCircle2, AlertCircle, Loader2, RefreshCw, Info } from 'lucide-react';
import { updateAboutImageAction } from '@/app/actions/siteSettings';

interface ClinicPhotoManagerProps {
  currentImageUrl: string | null;
}

export default function ClinicPhotoManager({ currentImageUrl }: ClinicPhotoManagerProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [result, setResult] = useState<{ success?: boolean; error?: string } | null>(null);
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Gambar yang ditampilkan: preview baru > gambar tersimpan > null
  const displaySrc = preview || currentImageUrl;

  useEffect(() => {
    // Bersihkan object URL saat komponen unmount atau preview berubah
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset state sebelumnya
    setResult(null);

    // Validasi sisi klien
    if (!file.type.startsWith('image/')) {
      setResult({ error: 'File harus berupa gambar (JPG, PNG, WebP, dll).' });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setResult({ error: 'Ukuran file maksimal 5 MB.' });
      return;
    }

    // Buat preview lokal
    if (preview) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(file));
    setSelectedFile(file);
  }

  function handleReset() {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setSelectedFile(null);
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedFile) {
      setResult({ error: 'Silakan pilih gambar terlebih dahulu.' });
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile);

    startTransition(async () => {
      const res = await updateAboutImageAction(formData);
      setResult(res);
      if (res.success) {
        // Bersihkan state preview setelah sukses
        if (preview) URL.revokeObjectURL(preview);
        setPreview(null);
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    });
  }

  return (
    <div className="space-y-8">
      {/* Info Banner */}
      <div className="flex items-start gap-3 px-5 py-4 bg-blue-50 border border-blue-200/80 rounded-2xl text-sm">
        <Info className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
        <p className="text-blue-700 leading-relaxed">
          Foto yang Anda atur di sini akan tampil pada{' '}
          <strong className="font-bold">Section "Tentang Klinik"</strong> di halaman utama website —
          bukan dari daftar fasilitas. Foto ini bersifat independen.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Pratinjau Foto */}
        <div className="space-y-3">
          <h3 className="font-heading font-bold text-sm text-text-dark uppercase tracking-wider">
            Pratinjau Foto
          </h3>
          <div
            className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border-2 border-dashed border-border-fine bg-bg-snow group cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
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
                {/* Overlay hover */}
                <div className="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/40 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center gap-2 text-white">
                    <ImagePlus className="w-8 h-8" />
                    <span className="text-xs font-bold">Ganti Foto</span>
                  </div>
                </div>
                {/* Badge "Baru" jika ada preview */}
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

        {/* Form Upload */}
        <div className="space-y-4">
          <h3 className="font-heading font-bold text-sm text-text-dark uppercase tracking-wider">
            Unggah Foto Baru
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Area drop/pilih file */}
            <div
              className="relative border-2 border-dashed border-border-fine rounded-2xl p-8 text-center hover:border-primary/50 hover:bg-primary-light/30 transition-all duration-200 cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
              role="button"
              aria-label="Klik untuk pilih file gambar"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="clinic-photo-input"
                aria-label="Pilih file foto klinik"
              />
              <div className="flex flex-col items-center gap-3 text-text-muted">
                <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center">
                  <Upload className="w-6 h-6 text-primary" />
                </div>
                {selectedFile ? (
                  <div>
                    <p className="font-bold text-sm text-text-dark">{selectedFile.name}</p>
                    <p className="text-xs text-text-muted mt-0.5">
                      {(selectedFile.size / 1024).toFixed(0)} KB — Klik untuk ganti file
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="font-semibold text-sm">Pilih file gambar</p>
                    <p className="text-xs mt-1">JPG, PNG, WebP, AVIF — Maks. 5 MB</p>
                  </div>
                )}
              </div>
            </div>

            {/* Tombol aksi */}
            <div className="flex gap-3">
              {selectedFile && (
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={isPending}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-border-fine text-sm font-semibold text-text-muted hover:bg-bg-snow hover:text-text-dark transition-all disabled:opacity-50"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reset
                </button>
              )}
              <button
                type="submit"
                disabled={isPending || !selectedFile}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Simpan Foto Klinik
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Feedback Hasil Aksi */}
          {result && (
            <div
              role="alert"
              className={`flex items-start gap-3 px-4 py-3.5 rounded-xl text-sm font-medium border ${
                result.success
                  ? 'bg-green-50 border-green-200 text-green-700'
                  : 'bg-red-50 border-red-200 text-red-700'
              }`}
            >
              {result.success ? (
                <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              )}
              <span>
                {result.success
                  ? 'Foto berhasil disimpan! Halaman utama akan diperbarui.'
                  : result.error}
              </span>
            </div>
          )}

          {/* Panduan */}
          <div className="bg-bg-snow rounded-2xl border border-border-fine p-4 space-y-2">
            <p className="text-xs font-bold text-text-dark">Tips Foto Terbaik:</p>
            <ul className="text-xs text-text-muted space-y-1.5 list-none">
              <li className="flex items-center gap-2">
                <span className="text-primary font-bold">✓</span>
                Gunakan rasio 4:3 atau landscape untuk tampilan optimal
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary font-bold">✓</span>
                Resolusi minimal 800 × 600 piksel
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary font-bold">✓</span>
                Foto gedung, ruang tunggu, atau aktivitas klinik
              </li>
              <li className="flex items-center gap-2">
                <span className="text-amber-500 font-bold">!</span>
                Kompres foto sebelum upload agar halaman cepat
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
