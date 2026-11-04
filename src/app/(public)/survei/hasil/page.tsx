import React from 'react';
import type { Metadata } from 'next';
import SurveyResultsPublicView from '@/features/surveys/components/survey-results-public-view';
import { getMonthlySurveyStats } from '@/features/surveys/queries/get-surveys';
import { KLINIK_INFO } from '@/lib/constants';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Hasil Indeks Kepuasan Masyarakat (IKM) - Klinik Pratama Aisyiyah Pangkajene',
  description:
    'Transparansi hasil survei kepuasan pasien (SKM/IKM) Klinik Pratama Aisyiyah Pangkajene berdasarkan 9 unsur PermenPAN-RB No. 14 Tahun 2017.',
  openGraph: {
    title: 'Hasil Survei Kepuasan Pasien | Klinik Aisyiyah Pangkajene',
    description:
      'Lihat transparansi penilaian mutu pelayanan kami yang dinilai langsung oleh pasien.',
    siteName: KLINIK_INFO.name,
  },
};

export default async function SurveyResultsPage() {
  const data = await getMonthlySurveyStats();

  return (
    <div className="bg-bg-snow min-h-screen py-12 md:py-20 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto text-center mb-8">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-primary/10 text-primary mb-3">
          Transparansi Publik & Akuntabilitas
        </span>
        <h1 className="font-heading font-extrabold text-2xl sm:text-4xl text-text-dark tracking-tight mb-3">
          Hasil Survei Kepuasan Pasien
        </h1>
        <p className="text-text-muted text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
          Rekapitulasi Indeks Kepuasan Masyarakat (IKM) per bulan berdasarkan Peraturan Menteri PAN-RB Nomor 14 Tahun 2017.
        </p>
      </div>

      <SurveyResultsPublicView initialData={data} />
    </div>
  );
}
