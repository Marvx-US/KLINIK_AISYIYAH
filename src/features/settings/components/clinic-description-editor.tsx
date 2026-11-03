'use client';

import React, { useState, useTransition } from 'react';
import { CheckCircle2, AlertCircle, Loader2, FileText, Eye } from 'lucide-react';
import { updateClinicDescription as updateClinicDescriptionAction } from '../actions/save-setting';

interface ClinicDescriptionEditorProps {
  currentDescription: string | null;
}

const DEFAULT_DESCRIPTION =
  'Klinik Aisyiyah Pangkajene hadir memberikan layanan kesehatan komprehensif, mudah diakses, serta mengutamakan pendekatan medis yang hangat bagi seluruh masyarakat Sidenreng Rappang. Didukung oleh tim dokter, bidan, dan staf medis profesional yang berdedikasi.';

export function ClinicDescriptionEditor({ currentDescription }: ClinicDescriptionEditorProps) {
  const [description, setDescription] = useState(currentDescription ?? DEFAULT_DESCRIPTION);
  const [descResult, setDescResult] = useState<{ success?: boolean; error?: string; message?: string } | null>(null);
  const [isDescPending, startDescTransition] = useTransition();

  function handleDescSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setDescResult(null);
    const formData = new FormData();
    formData.append('description', description);
    startDescTransition(async () => {
      const res = await updateClinicDescriptionAction(formData);
      setDescResult(res);
    });
  }

  return (
    <div className="bg-white rounded-3xl border border-border-fine p-8 shadow-sm space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-border-fine">
        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
          <FileText className="w-4.5 h-4.5" />
        </div>
        <div>
          <h2 className="font-heading font-bold text-base text-text-dark">Deskripsi Profil Klinik</h2>
          <p className="text-xs text-text-muted mt-0.5">
            Teks paragraf yang tampil di section &quot;Tentang Klinik&quot; halaman utama
          </p>
        </div>
      </div>

      <form onSubmit={handleDescSubmit} className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="clinic-description" className="text-xs font-bold text-text-dark uppercase tracking-wider">
              Paragraf Deskripsi
            </label>
            <span className={`text-xs font-medium ${description.length > 950 ? 'text-amber-600' : 'text-text-muted'}`}>
              {description.length} / 1000 karakter
            </span>
          </div>
          <textarea
            id="clinic-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            maxLength={1000}
            placeholder="Tulis deskripsi singkat tentang klinik..."
            className="w-full px-4 py-3 rounded-xl border border-border-fine bg-bg-snow text-text-dark text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/60 transition-all placeholder:text-text-muted/60"
          />
        </div>

        {/* Preview box */}
        <div className="bg-bg-snow rounded-2xl border border-border-fine p-4">
          <div className="flex items-center gap-1.5 mb-2">
            <Eye className="w-3.5 h-3.5 text-text-muted" />
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Pratinjau Tampilan</span>
          </div>
          <p className="text-text-muted text-sm leading-relaxed italic">
            {description || 'Deskripsi akan tampil di sini...'}
          </p>
        </div>

        {descResult && (
          <div
            role="alert"
            className={`flex items-start gap-3 px-4 py-3.5 rounded-xl text-sm font-medium border ${
              descResult.success
                ? 'bg-green-50 border-green-200 text-green-700'
                : 'bg-red-50 border-red-200 text-red-700'
            }`}
          >
            {descResult.success ? (
              <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            )}
            <span>
              {descResult.success
                ? descResult.message || 'Berhasil disimpan! Halaman utama akan diperbarui.'
                : descResult.error || descResult.message || 'Terjadi kesalahan.'}
            </span>
          </div>
        )}

        <button
          type="submit"
          disabled={isDescPending || !description.trim()}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          {isDescPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Menyimpan...
            </>
          ) : (
            'Simpan Deskripsi'
          )}
        </button>
      </form>
    </div>
  );
}
