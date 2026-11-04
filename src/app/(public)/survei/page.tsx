import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ClipboardList, BarChart3 } from 'lucide-react';
import SurveyFormView from '@/features/surveys/components/survey-form-view';
import { KLINIK_INFO } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Survei Kepuasan Pasien - Klinik Pratama Aisyiyah Pangkajene',
  description:
    'Formulir survei kepuasan masyarakat (SKM) / pasien untuk evaluasi dan peningkatan mutu pelayanan kesehatan di Klinik Pratama Aisyiyah.',
  openGraph: {
    title: 'Survei Kepuasan Pasien | Klinik Aisyiyah Pangkajene',
    description: 'Bantu kami meningkatkan kualitas layanan dengan mengisi kuesioner singkat ini.',
    siteName: KLINIK_INFO.name,
  },
};

export default function SurveyPublicPage() {
  return (
    <div className="bg-bg-snow min-h-screen py-12 md:py-20 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto text-center mb-8">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-primary/10 text-primary mb-3">
          Survei Kepuasan Masyarakat (SKM)
        </span>
        <h1 className="font-heading font-extrabold text-2xl sm:text-4xl text-text-dark tracking-tight mb-3">
          Kuesioner Kepuasan Pasien
        </h1>
        <p className="text-text-muted text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
          Klinik Pratama Aisyiyah berkomitmen memberikan pelayanan prima. Mohon kesediaan Anda memberikan penilaian objektif demi perbaikan mutu berkesinambungan.
        </p>

        {/* Tab Switcher: Form vs Hasil */}
        <div className="flex items-center justify-center mt-6">
          <div className="inline-flex p-1.5 rounded-full bg-white border border-border-fine shadow-xs">
            <div className="flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold bg-primary text-white shadow-xs">
              <ClipboardList className="w-4 h-4" />
              <span>Isi Kuesioner</span>
            </div>
            <Link
              href="/survei/hasil"
              className="flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold text-text-muted hover:text-text-dark transition-all"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Hasil & Indeks Kepuasan</span>
            </Link>
          </div>
        </div>
      </div>

      <SurveyFormView />
    </div>
  );
}
