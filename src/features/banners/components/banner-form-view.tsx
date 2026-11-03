'use client';

import React, { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { saveBanner as saveBannerAction } from '../actions/save-banner';
import { type Banner } from '../types';

interface BannerFormViewProps {
  banner: Banner | null;
  onCancel: () => void;
  onSuccess: () => void;
}

export default function BannerFormView({
  banner,
  onCancel,
  onSuccess,
}: BannerFormViewProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(saveBannerAction, null);

  useEffect(() => {
    if (state?.success) {
      onSuccess();
      router.refresh();
    }
  }, [state, router, onSuccess]);

  return (
    <div className="bg-white rounded-3xl border-fine shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="border-b border-border-fine px-8 py-6 bg-bg-snow flex items-center gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-border-fine text-text-muted hover:text-text-dark"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="font-heading font-bold text-xl text-text-dark">
            {banner ? 'Edit Banner' : 'Tambah Banner Baru'}
          </h2>
          <p className="text-xs text-text-muted mt-1">
            Formulir {banner ? 'perubahan' : 'pembuatan'} gambar latar.
          </p>
        </div>
      </div>

      <div className="p-8">
        <form action={formAction} className="space-y-8">
          {banner && <input type="hidden" name="id" value={banner.id} />}

          {state?.error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-medium border border-red-100 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{state.error}</span>
            </div>
          )}

          <div>
            <label htmlFor="title" className="block text-xs font-bold text-text-dark uppercase tracking-wider mb-2">
              Judul / Deskripsi (Internal)
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              defaultValue={banner?.title}
              placeholder="Contoh: Promo Ramadhan 2026"
              className="w-full bg-white border border-border-fine rounded-2xl py-3 px-5 text-sm font-sans focus:outline-none focus:border-primary text-text-dark transition-all"
            />
          </div>

          <div>
            <label htmlFor="image" className="block text-xs font-bold text-text-dark uppercase tracking-wider mb-2">
              Gambar Banner {banner ? '(Opsional)' : ''}
            </label>
            {banner?.imageUrl && (
              <div className="mb-3">
                <span className="text-xs text-text-muted block mb-2">Gambar saat ini:</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={banner.imageUrl}
                  alt="Cover"
                  className="w-full max-w-lg h-auto rounded-xl border border-border-fine object-cover aspect-video"
                />
              </div>
            )}
            <div className="flex items-center gap-3 w-full bg-white border border-border-fine rounded-2xl py-2 px-4 focus-within:border-primary transition-all">
              <ImageIcon className="w-5 h-5 text-text-muted shrink-0" />
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                required={!banner}
                className="w-full text-sm font-sans text-text-dark file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-all cursor-pointer"
              />
            </div>
            <p className="text-xs text-text-muted mt-2">
              Format: JPG, PNG, WEBP. Rekomendasi resolusi lebar 1920px (Desktop Full Width).
            </p>
          </div>

          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                name="isActive" 
                defaultChecked={banner ? banner.isActive : true}
                className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary" 
              />
              <span className="text-sm font-bold text-text-dark">
                Tampilkan banner ini di halaman utama (Aktif)
              </span>
            </label>
          </div>

          <div className="flex gap-4 pt-4 border-t border-border-fine">
            <button
              type="submit"
              disabled={isPending}
              className="px-8 py-3 bg-primary text-white text-sm font-bold rounded-full hover:bg-primary-dark transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[140px]"
            >
              {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Simpan Banner'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              disabled={isPending}
              className="px-8 py-3 bg-bg-snow text-text-dark border border-border-fine text-sm font-bold rounded-full hover:bg-white hover:border-gray-300 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
