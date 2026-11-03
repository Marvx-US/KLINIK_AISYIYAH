'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, AlertCircle, Edit2, Image as ImageIcon } from 'lucide-react';
import { savePartner as savePartnerAction } from '../actions/save-partner';
import { type Partner } from '../types';

interface PartnerFormViewProps {
  partner: Partner | null;
  onCancel: () => void;
  onSuccess: () => void;
}

export default function PartnerFormView({
  partner,
  onCancel,
  onSuccess,
}: PartnerFormViewProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(partner?.name || '');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(partner?.logoUrl || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError('Ukuran gambar maksimal 2MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError('File harus berupa gambar');
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      if (partner?.id) formData.append('id', partner.id.toString());
      formData.append('name', name);
      if (imageFile) formData.append('image', imageFile);

      const result = await savePartnerAction(formData);

      if (!result.success) {
        setError(result.message || result.error || 'Gagal menyimpan mitra');
      } else {
        onSuccess();
        router.refresh();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan sistem';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button
        type="button"
        onClick={onCancel}
        className="group flex items-center gap-2 text-text-muted hover:text-primary mb-6 transition-colors"
      >
        <div className="p-2 rounded-lg group-hover:bg-primary-light transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </div>
        <span className="font-semibold tracking-wide">Kembali ke Daftar</span>
      </button>

      <div className="bg-white rounded-3xl shadow-sm border border-border-fine overflow-hidden">
        <div className="p-8 border-b border-border-fine bg-bg-snow">
          <h1 className="font-heading font-extrabold text-2xl text-text-dark tracking-tight">
            {partner ? 'Edit Mitra' : 'Tambah Mitra Baru'}
          </h1>
          <p className="text-text-muted mt-2">
            Masukan nama dan unggah logo (format transparan / PNG disarankan).
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-2xl flex items-start gap-3 border border-red-100">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="font-medium text-sm">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1 space-y-4">
              <label className="block text-sm font-bold text-text-dark">
                Logo Mitra <span className="text-red-500">*</span>
              </label>

              <div
                onClick={() => fileInputRef.current?.click()}
                className={`relative group cursor-pointer aspect-video rounded-2xl border-2 border-dashed flex flex-col items-center justify-center overflow-hidden transition-all ${
                  imagePreview
                    ? 'border-transparent bg-white shadow-md'
                    : 'border-border-fine hover:border-primary hover:bg-primary-light'
                }`}
              >
                {imagePreview ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-contain p-4 bg-white"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                      <p className="text-white font-semibold text-sm flex items-center gap-2">
                        <Edit2 className="w-4 h-4" /> Ganti Logo
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-6">
                    <div className="w-12 h-12 bg-bg-snow rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                      <ImageIcon className="w-6 h-6 text-text-muted group-hover:text-primary" />
                    </div>
                    <p className="text-sm font-semibold text-text-dark">Klik untuk unggah</p>
                    <p className="text-xs text-text-muted mt-1">PNG, JPG (Max. 2MB)</p>
                    <p className="text-xs text-primary mt-1 font-medium">Sangat disarankan: PNG Transparan</p>
                  </div>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                className="hidden"
              />
            </div>

            <div className="md:col-span-2 space-y-6">
              <div>
                <label className="block text-sm font-bold text-text-dark mb-2">
                  Nama Mitra Kerjasama <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: BPJS Kesehatan, Asuransi Prudential"
                  className="w-full px-4 py-3 bg-bg-snow border-border-fine border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-border-fine">
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="px-6 py-3 rounded-xl font-bold text-text-muted hover:bg-bg-snow transition-colors disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-8 py-3 rounded-xl font-bold bg-primary text-white hover:bg-primary-dark transition-all disabled:opacity-70 flex items-center gap-2 shadow-lg shadow-primary/20"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                'Simpan Mitra'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
