'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { saveFacility as saveFacilityAction } from '../actions/save-facility';
import { type Facility } from '../types';

interface FacilityFormViewProps {
  facility: Facility;
  onCancel: () => void;
  onSuccess: () => void;
}

export default function FacilityFormView({
  facility,
  onCancel,
  onSuccess,
}: FacilityFormViewProps) {
  const router = useRouter();
  const isEdit = facility.id !== 0;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const formData = new FormData(e.currentTarget);
      const res = await saveFacilityAction(formData);

      if (res?.error) {
        setErrorMsg(res.error);
      } else {
        onSuccess();
        router.refresh();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan sistem.';
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-border-fine shadow-sm overflow-hidden">
      <div className="p-6 md:p-8 border-b border-border-fine bg-bg-snow flex items-center justify-between">
        <div>
          <h3 className="font-heading font-bold text-xl text-text-dark">
            {isEdit ? 'Edit Fasilitas' : 'Tambah Fasilitas Baru'}
          </h3>
          <p className="text-sm text-text-muted mt-1">
            {isEdit
              ? 'Ubah informasi fasilitas atau ganti gambarnya.'
              : 'Unggah foto fasilitas baru untuk ditampilkan di beranda.'}
          </p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-text-muted hover:text-text-dark hover:bg-white rounded-full transition-colors border border-transparent hover:border-border-fine"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 md:p-8 flex flex-col gap-6">
        {isEdit && <input type="hidden" name="id" value={facility.id} />}

        {errorMsg && (
          <div className="p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 text-sm font-medium border border-red-100">
            <AlertCircle className="w-5 h-5 shrink-0" />
            {errorMsg}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-sm font-bold text-text-dark">
                Nama Fasilitas <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                defaultValue={facility.name}
                placeholder="Contoh: Poli Gigi & Mulut"
                className="px-4 py-3 bg-bg-snow border border-border-fine rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium"
              />
            </div>

            <div className="flex flex-col gap-2.5">
              <label htmlFor="description" className="text-sm font-bold text-text-dark">
                Deskripsi <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={3}
                defaultValue={facility.description}
                placeholder="Deskripsikan fasilitas secara singkat namun menarik..."
                className="w-full px-5 py-3.5 bg-bg-snow border border-border-fine rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium leading-relaxed resize-y overflow-hidden min-h-[90px]"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-text-dark">Status Visibilitas</label>
              <label className="flex items-center gap-3 cursor-pointer p-4 border border-border-fine rounded-2xl hover:bg-bg-snow transition-colors">
                <input
                  type="checkbox"
                  name="isActive"
                  value="true"
                  defaultChecked={facility.isActive}
                  className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <div>
                  <p className="font-semibold text-sm text-text-dark">Tampilkan Publik</p>
                  <p className="text-xs text-text-muted">
                    Jika dicentang, fasilitas akan muncul di halaman beranda.
                  </p>
                </div>
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2 h-full">
              <label htmlFor="image" className="text-sm font-bold text-text-dark">
                Gambar Foto <span className="text-red-500">{!isEdit && '*'}</span>
              </label>

              <div className="grow flex flex-col items-center justify-center border-2 border-dashed border-border-fine rounded-3xl p-8 bg-bg-snow text-center relative overflow-hidden group">
                {isEdit && facility.imageUrl && (
                  <div className="absolute inset-0 w-full h-full opacity-30 group-hover:opacity-10 transition-opacity">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={facility.imageUrl} alt="Current" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 text-primary">
                    <ImageIcon className="w-8 h-8" />
                  </div>
                  <p className="text-sm font-bold text-text-dark">Pilih atau Seret Foto Baru</p>
                  <p className="text-xs text-text-muted mt-2 max-w-[200px]">
                    Format JPG, PNG, WEBP. Maksimal 5MB. Resolusi disarankan 800x800px.
                  </p>
                  <input
                    id="image"
                    name="image"
                    type="file"
                    accept="image/*"
                    required={!isEdit}
                    className="mt-6 block w-full text-sm text-slate-500
                      file:mr-4 file:py-2.5 file:px-6
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-primary file:text-white
                      hover:file:bg-primary-dark transition-all cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-4 pt-6 border-t border-border-fine">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 rounded-full text-sm font-semibold text-text-muted hover:bg-bg-snow transition-colors"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 rounded-full text-sm font-bold text-white bg-primary hover:bg-primary-dark disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              'Simpan Fasilitas'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
