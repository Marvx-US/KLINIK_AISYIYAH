'use client';

import React from 'react';
import { ImageIcon, Trash2, X, Info } from 'lucide-react';

interface ServiceMediaSectionProps {
  bannerPreview: string | null;
  setBannerPreview: (url: string | null) => void;
  removeBannerImage: boolean;
  setRemoveBannerImage: (remove: boolean) => void;

  imagePreview: string | null;
  setImagePreview: (url: string | null) => void;
  removeRoomImage: boolean;
  setRemoveRoomImage: (remove: boolean) => void;

  existingGallery: string[];
  setExistingGallery: React.Dispatch<React.SetStateAction<string[]>>;
  newGalleryPreviews: string[];
  setNewGalleryPreviews: (urls: string[]) => void;
}

export default function ServiceMediaSection({
  bannerPreview,
  setBannerPreview,
  removeBannerImage,
  setRemoveBannerImage,
  imagePreview,
  setImagePreview,
  removeRoomImage,
  setRemoveRoomImage,
  existingGallery,
  setExistingGallery,
  newGalleryPreviews,
  setNewGalleryPreviews,
}: ServiceMediaSectionProps) {
  return (
    <div className="border-b border-border-fine pb-8">
      <h4 className="text-base md:text-lg font-bold text-primary mb-4 flex items-center gap-2.5">
        <ImageIcon className="w-5 h-5" /> 2. Foto Banner, Kartu Utama & Galeri Ruangan
      </h4>

      {/* Info Guide */}
      <div className="mb-6 p-4 bg-teal-50/80 border border-teal-200/80 rounded-2xl flex items-start gap-3.5 text-xs text-teal-900 leading-relaxed">
        <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-sm text-teal-950">Panduan Penempatan Gambar pada Halaman Layanan:</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-2">
            <div className="p-2.5 bg-white/80 rounded-xl border border-teal-100">
              <span className="font-bold text-primary block">1. Banner Latar Atas</span>
              <span className="text-text-muted text-[11px]">Latar belakang gelap (Hero Banner) di paling atas halaman layanan.</span>
            </div>
            <div className="p-2.5 bg-white/80 rounded-xl border border-teal-100">
              <span className="font-bold text-primary block">2. Foto Kartu Utama / Dokter</span>
              <span className="text-text-muted text-[11px]">Tampil di kartu samping judul & deskripsi.</span>
            </div>
            <div className="p-2.5 bg-white/80 rounded-xl border border-teal-100">
              <span className="font-bold text-primary block">3. Galeri Foto Ruangan</span>
              <span className="text-text-muted text-[11px]">Kumpulan foto di bagian galeri ruangan & fasilitas (bisa di-zoom).</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* SLOT 1: Banner Image */}
        <div className="flex flex-col gap-2.5 bg-bg-snow/60 p-5 rounded-2xl border border-border-fine">
          <div className="flex items-center justify-between">
            <div>
              <label htmlFor="bannerImage" className="text-sm font-bold text-text-dark flex items-center gap-2">
                <span>1. Foto Banner Latar Atas</span>
                <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full">Hero Banner</span>
              </label>
              <p className="text-xs text-text-muted mt-0.5">Latar header atas (Rasio 16:9 disarankan)</p>
            </div>
            {bannerPreview && (
              <button
                type="button"
                onClick={() => {
                  setBannerPreview(null);
                  setRemoveBannerImage(true);
                }}
                className="text-xs text-red-600 hover:text-red-800 font-semibold flex items-center gap-1 shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Hapus
              </button>
            )}
          </div>

          {bannerPreview ? (
            <div className="relative w-full h-44 rounded-xl overflow-hidden border border-border-fine shadow-sm bg-slate-950 flex items-center justify-center group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={bannerPreview} alt="Preview Banner Atas" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-xs font-semibold px-3 py-1 bg-black/60 rounded-full">Preview Hero Banner</span>
              </div>
            </div>
          ) : (
            <div className="w-full h-36 rounded-xl border-2 border-dashed border-border-fine bg-white flex flex-col items-center justify-center gap-1.5 text-text-muted">
              <ImageIcon className="w-7 h-7 text-border-fine" />
              <p className="text-xs font-semibold">Belum ada banner latar kustom</p>
              <p className="text-[10px] text-text-muted">(Jika kosong, sistem menggunakan foto pertama galeri)</p>
            </div>
          )}

          {removeBannerImage && <input type="hidden" name="removeBannerImage" value="true" />}

          <input
            id="bannerImage"
            name="bannerImage"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setBannerPreview(URL.createObjectURL(file));
                setRemoveBannerImage(false);
              }
            }}
            className="px-4 py-2.5 bg-white border border-border-fine rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-xs font-medium cursor-pointer"
          />
        </div>

        {/* SLOT 2: Room Image */}
        <div className="flex flex-col gap-2.5 bg-bg-snow/60 p-5 rounded-2xl border border-border-fine">
          <div className="flex items-center justify-between">
            <div>
              <label htmlFor="roomImage" className="text-sm font-bold text-text-dark flex items-center gap-2">
                <span>2. Foto Kartu Utama / Dokter</span>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">Kartu Deskripsi</span>
              </label>
              <p className="text-xs text-text-muted mt-0.5">Tampil di samping deskripsi (Rasio 4:3 disarankan)</p>
            </div>
            {imagePreview && (
              <button
                type="button"
                onClick={() => {
                  setImagePreview(null);
                  setRemoveRoomImage(true);
                }}
                className="text-xs text-red-600 hover:text-red-800 font-semibold flex items-center gap-1 shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Hapus
              </button>
            )}
          </div>

          {imagePreview ? (
            <div className="relative w-full h-44 rounded-xl overflow-hidden border border-border-fine shadow-sm bg-white flex items-center justify-center p-2 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imagePreview} alt="Preview Foto Utama" className="w-full h-full object-contain" />
            </div>
          ) : (
            <div className="w-full h-36 rounded-xl border-2 border-dashed border-border-fine bg-white flex flex-col items-center justify-center gap-1.5 text-text-muted">
              <ImageIcon className="w-7 h-7 text-border-fine" />
              <p className="text-xs font-semibold">Belum ada foto kartu utama/dokter</p>
              <p className="text-[10px] text-text-muted">(Jika kosong, sistem menggunakan foto bawaan layanan)</p>
            </div>
          )}

          {removeRoomImage && <input type="hidden" name="removeRoomImage" value="true" />}

          <input
            id="roomImage"
            name="roomImage"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setImagePreview(URL.createObjectURL(file));
                setRemoveRoomImage(false);
              }
            }}
            className="px-4 py-2.5 bg-white border border-border-fine rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-xs font-medium cursor-pointer"
          />
        </div>
      </div>

      {/* SLOT 3: Gallery Photos Field */}
      <div className="mt-6 flex flex-col gap-3 bg-bg-snow/60 p-5 rounded-2xl border border-border-fine">
        <label className="text-sm font-bold text-text-dark flex items-center justify-between">
          <div>
            <span className="flex items-center gap-2">
              <span>3. Galeri Foto Ruangan & Fasilitas</span>
              <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded-full">Grid Galeri Bawah</span>
            </span>
            <p className="text-xs text-text-muted font-normal mt-0.5">Unggah beberapa foto dokumentasi ruangan sekaligus.</p>
          </div>
          <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full shrink-0">Multiple upload</span>
        </label>

        {existingGallery.length > 0 && (
          <div className="flex flex-col gap-2.5 mt-2">
            <p className="text-xs font-bold text-text-dark">Foto Galeri Aktif ({existingGallery.length}):</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {existingGallery.map((url, idx) => (
                <div key={idx} className="relative group aspect-[4/3] rounded-xl overflow-hidden border border-border-fine bg-slate-900/5 flex items-center justify-center p-1 shadow-xs">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt={`Galeri ${idx + 1}`} className="w-full h-full object-contain" />
                  <button
                    type="button"
                    onClick={() => setExistingGallery((prev) => prev.filter((_, i) => i !== idx))}
                    className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-90 hover:opacity-100 hover:scale-110 transition-all shadow-md z-10"
                    title="Hapus foto dari galeri"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  <input type="hidden" name="existingGallery" value={url} />
                </div>
              ))}
            </div>
          </div>
        )}

        {newGalleryPreviews.length > 0 && (
          <div className="flex flex-col gap-2.5 mt-2">
            <p className="text-xs font-bold text-primary">Foto Baru yang Akan Diunggah ({newGalleryPreviews.length}):</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {newGalleryPreviews.map((url, idx) => (
                <div key={idx} className="relative aspect-[4/3] rounded-xl overflow-hidden border-2 border-primary/50 bg-slate-900/5 flex items-center justify-center p-1 shadow-xs">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt={`Preview Baru ${idx + 1}`} className="w-full h-full object-contain" />
                </div>
              ))}
            </div>
          </div>
        )}

        <input
          id="galleryFiles"
          name="galleryFiles"
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
          onChange={(e) => {
            const files = e.target.files;
            if (files && files.length > 0) {
              const urls = Array.from(files).map((f) => URL.createObjectURL(f));
              setNewGalleryPreviews(urls);
            } else {
              setNewGalleryPreviews([]);
            }
          }}
          className="mt-1 px-4 py-3 bg-white border border-border-fine rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-xs font-medium cursor-pointer"
        />
      </div>
    </div>
  );
}
