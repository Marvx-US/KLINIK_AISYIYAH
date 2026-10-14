'use client';

import React, { useState, useTransition } from 'react';
import { CheckCircle2, AlertCircle, Loader2, FileText, Eye, Target } from 'lucide-react';
import { updateClinicDescriptionAction, updateVisionMissionAction } from '@/app/actions/siteSettings';

interface ClinicProfileTextEditorProps {
  currentDescription: string | null;
  currentVision: string | null;
  currentMission: string | null;
}

const DEFAULT_DESCRIPTION =
  'Klinik Aisyiyah Pangkajene hadir memberikan layanan kesehatan komprehensif, mudah diakses, serta mengutamakan pendekatan medis yang hangat bagi seluruh masyarakat Sidenreng Rappang. Didukung oleh tim dokter, bidan, dan staf medis profesional yang berdedikasi.';

const DEFAULT_VISION =
  'Menjadi klinik pratama pilihan utama masyarakat Sidenreng Rappang yang memberikan pelayanan kesehatan berkualitas, terjangkau, dan berkeadilan berlandaskan nilai-nilai Islami.';

const DEFAULT_MISSION =
  '1. Memberikan pelayanan medis yang profesional, ramah, dan komprehensif kepada seluruh lapisan masyarakat.\n2. Menyediakan tenaga kesehatan yang kompeten, berdedikasi, dan terus meningkatkan kompetensi.\n3. Membangun fasilitas kesehatan yang bersih, nyaman, dan berstandar tinggi.\n4. Mengedepankan pendekatan promotif, preventif, kuratif, dan rehabilitatif secara terpadu.\n5. Berperan aktif dalam program kesehatan masyarakat dan pemberdayaan komunitas.';

function FeedbackBanner({ result }: { result: { success?: boolean; error?: string } | null }) {
  if (!result) return null;
  return (
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
        {result.success ? 'Berhasil disimpan! Halaman utama akan diperbarui.' : result.error}
      </span>
    </div>
  );
}

export default function ClinicProfileTextEditor({
  currentDescription,
  currentVision,
  currentMission,
}: ClinicProfileTextEditorProps) {
  // --- State: Deskripsi ---
  const [description, setDescription] = useState(currentDescription ?? DEFAULT_DESCRIPTION);
  const [descResult, setDescResult] = useState<{ success?: boolean; error?: string } | null>(null);
  const [isDescPending, startDescTransition] = useTransition();

  // --- State: Visi & Misi ---
  const [vision, setVision] = useState(currentVision ?? DEFAULT_VISION);
  const [mission, setMission] = useState(currentMission ?? DEFAULT_MISSION);
  const [vmResult, setVmResult] = useState<{ success?: boolean; error?: string } | null>(null);
  const [isVmPending, startVmTransition] = useTransition();

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

  function handleVmSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setVmResult(null);
    const formData = new FormData();
    formData.append('vision', vision);
    formData.append('mission', mission);
    startVmTransition(async () => {
      const res = await updateVisionMissionAction(formData);
      setVmResult(res);
    });
  }

  return (
    <div className="space-y-8">

      {/* ── SECTION 1: Deskripsi Profil Klinik ── */}
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

          <FeedbackBanner result={descResult} />

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

      {/* ── SECTION 2: Visi & Misi ── */}
      <div className="bg-white rounded-3xl border border-border-fine p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-border-fine">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Target className="w-4.5 h-4.5" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-base text-text-dark">Visi &amp; Misi Klinik</h2>
            <p className="text-xs text-text-muted mt-0.5">
              Ditampilkan pada section Visi &amp; Misi di halaman utama website
            </p>
          </div>
        </div>

        <form onSubmit={handleVmSubmit} className="space-y-6">
          {/* Visi */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="clinic-vision" className="text-xs font-bold text-text-dark uppercase tracking-wider">
                Visi Klinik
              </label>
              <span className={`text-xs font-medium ${vision.length > 450 ? 'text-amber-600' : 'text-text-muted'}`}>
                {vision.length} / 500 karakter
              </span>
            </div>
            <textarea
              id="clinic-vision"
              value={vision}
              onChange={(e) => setVision(e.target.value)}
              rows={3}
              maxLength={500}
              placeholder="Tulis visi klinik..."
              className="w-full px-4 py-3 rounded-xl border border-border-fine bg-bg-snow text-text-dark text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/60 transition-all placeholder:text-text-muted/60"
            />
          </div>

          {/* Misi */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="clinic-mission" className="text-xs font-bold text-text-dark uppercase tracking-wider">
                Misi Klinik
              </label>
              <span className={`text-xs font-medium ${mission.length > 1800 ? 'text-amber-600' : 'text-text-muted'}`}>
                {mission.length} / 2000 karakter
              </span>
            </div>
            <textarea
              id="clinic-mission"
              value={mission}
              onChange={(e) => setMission(e.target.value)}
              rows={8}
              maxLength={2000}
              placeholder="Tulis misi klinik, satu poin per baris atau pisahkan dengan nomor (1. ... 2. ...)..."
              className="w-full px-4 py-3 rounded-xl border border-border-fine bg-bg-snow text-text-dark text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/60 transition-all placeholder:text-text-muted/60"
            />
            <p className="text-[11px] text-text-muted">
              Tip: Pisahkan setiap poin misi dengan baris baru atau awali dengan angka (1. 2. 3.)
            </p>
          </div>

          {/* Preview Visi & Misi */}
          {(vision || mission) && (
            <div className="bg-bg-snow rounded-2xl border border-border-fine p-5 space-y-4">
              <div className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-text-muted" />
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Pratinjau Tampilan</span>
              </div>
              {vision && (
                <div>
                  <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Visi</p>
                  <p className="text-sm text-text-dark leading-relaxed italic">{vision}</p>
                </div>
              )}
              {mission && (
                <div>
                  <p className="text-xs font-bold text-primary uppercase tracking-wider mb-2">Misi</p>
                  <ul className="space-y-1.5">
                    {mission.split('\n').filter(Boolean).map((line, i) => (
                      <li key={i} className="text-sm text-text-dark leading-relaxed flex gap-2">
                        <span className="text-primary font-bold shrink-0 mt-0.5">›</span>
                        <span>{line.replace(/^\d+\.\s*/, '')}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <FeedbackBanner result={vmResult} />

          <button
            type="submit"
            disabled={isVmPending || !vision.trim() || !mission.trim()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {isVmPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              'Simpan Visi & Misi'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

