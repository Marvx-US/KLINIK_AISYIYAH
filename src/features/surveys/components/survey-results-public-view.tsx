'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Users,
  Award,
  ChevronDown,
  Info,
  ArrowRight,
  ClipboardList,
  BarChart3,
  CheckCircle,
  Share2,
} from 'lucide-react';
import type { PublicSurveyResultsPayload } from '../types';
import SurveyShareModal from './survey-share-modal';

interface SurveyResultsPublicViewProps {
  initialData: PublicSurveyResultsPayload;
}

export default function SurveyResultsPublicView({ initialData }: SurveyResultsPublicViewProps) {
  const { availableMonths, monthlyStats, allTimeSummary } = initialData;
  const [selectedMonth, setSelectedMonth] = useState<string>(
    initialData.selectedMonth || (availableMonths[0]?.monthKey ?? '')
  );
  const [isShareOpen, setIsShareOpen] = useState(false);

  const currentStat = monthlyStats[selectedMonth];
  const hasData = availableMonths.length > 0 && !!currentStat;

  const getGradeTheme = (grade: string) => {
    switch (grade) {
      case 'A':
        return {
          bg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
          badge: 'bg-emerald-600 text-white',
          bar: 'bg-emerald-500',
        };
      case 'B':
        return {
          bg: 'bg-teal-50 border-teal-200 text-teal-800',
          badge: 'bg-primary text-white',
          bar: 'bg-primary',
        };
      case 'C':
        return {
          bg: 'bg-amber-50 border-amber-200 text-amber-800',
          badge: 'bg-amber-600 text-white',
          bar: 'bg-amber-500',
        };
      default:
        return {
          bg: 'bg-rose-50 border-rose-200 text-rose-800',
          badge: 'bg-rose-600 text-white',
          bar: 'bg-rose-500',
        };
    }
  };

  const theme = getGradeTheme(currentStat?.ikmGrade || 'B');
  const pageUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/survei/hasil`
      : '/survei/hasil';

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Tab Switcher: Form vs Hasil */}
      <div className="flex items-center justify-center">
        <div className="inline-flex p-1.5 rounded-full bg-white border border-border-fine shadow-xs">
          <Link
            href="/survei"
            className="flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold text-text-muted hover:text-text-dark transition-all"
          >
            <ClipboardList className="w-4 h-4" />
            <span>Isi Kuesioner</span>
          </Link>
          <div className="flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold bg-primary text-white shadow-xs">
            <BarChart3 className="w-4 h-4" />
            <span>Hasil & Indeks Kepuasan</span>
          </div>
        </div>
      </div>

      {/* Filter Pemilihan Bulan */}
      <div className="bg-white p-5 rounded-3xl border border-border-fine shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-heading font-extrabold text-sm text-text-dark">
              Pilih Periode Bulan
            </h2>
            <p className="text-xs text-text-muted">
              Pilih bulan untuk melihat rekapitulasi penilaian kepuasan pasien.
            </p>
          </div>
        </div>

        {availableMonths.length > 0 ? (
          <div className="relative w-full sm:w-auto">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full sm:w-56 appearance-none pl-4 pr-10 py-2.5 rounded-2xl border border-border-fine bg-bg-snow text-xs font-bold text-text-dark focus:outline-none focus:border-primary cursor-pointer shadow-2xs"
            >
              {availableMonths.map((m) => (
                <option key={m.monthKey} value={m.monthKey}>
                  {m.monthLabel}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-text-muted absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        ) : (
          <span className="text-xs text-text-muted italic">Belum ada riwayat survei</span>
        )}
      </div>

      {!hasData ? (
        /* Empty State */
        <div className="bg-white p-12 rounded-3xl border border-border-fine text-center shadow-xs">
          <div className="w-16 h-16 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
            <Info className="w-8 h-8" />
          </div>
          <h3 className="font-heading font-extrabold text-lg text-text-dark mb-2">
            Belum Ada Data Survei
          </h3>
          <p className="text-xs text-text-muted max-w-md mx-auto mb-6">
            Hasil survei kepuasan masyarakat akan otomatis ditampilkan di sini setelah pasien mengisi kuesioner.
          </p>
          <Link
            href="/survei"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white text-xs font-bold hover:bg-primary-dark transition-all"
          >
            <span>Isi Kuesioner Pertama</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedMonth}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Kartu Ringkasan IKM Utama */}
            <div className={`p-6 sm:p-8 rounded-3xl border ${theme.bg} shadow-xs relative overflow-hidden`}>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider ${theme.badge} mb-3`}>
                    <Award className="w-3.5 h-3.5" />
                    Mutu {currentStat.ikmGrade} • {currentStat.ikmCategory}
                  </span>
                  <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-text-dark">
                    Indeks Kepuasan Masyarakat (IKM)
                  </h3>
                  <p className="text-xs text-text-muted mt-1">
                    Periode: <strong className="text-text-dark">{currentStat.monthLabel}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-baseline gap-2 bg-white/80 backdrop-blur-xs px-6 py-4 rounded-2xl border border-border-fine shrink-0 shadow-xs">
                    <span className="font-heading font-black text-4xl sm:text-5xl text-primary tracking-tight">
                      {currentStat.ikmScore.toFixed(2)}
                    </span>
                    <span className="text-xs font-bold text-text-muted">/ 100</span>
                  </div>

                  {/* Tombol Bagikan Infografis */}
                  <button
                    type="button"
                    onClick={() => setIsShareOpen(true)}
                    className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/90 border border-border-fine shadow-xs text-xs font-bold text-text-dark hover:bg-white hover:shadow-sm transition-all cursor-pointer shrink-0"
                    title="Bagikan infografis ke sosial media"
                  >
                    <Share2 className="w-4 h-4 text-primary" />
                    <span className="hidden sm:inline">Bagikan</span>
                  </button>
                </div>
              </div>

              {/* Pill Ringkasan Parameter */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-black/5 text-xs">
                <div>
                  <span className="text-text-muted block text-[11px]">Jumlah Responden</span>
                  <strong className="text-text-dark text-sm sm:text-base flex items-center gap-1.5 mt-0.5">
                    <Users className="w-4 h-4 text-primary" />
                    {currentStat.totalRespondents} Pasien
                  </strong>
                </div>
                <div>
                  <span className="text-text-muted block text-[11px]">NRR Tertimbang</span>
                  <strong className="text-text-dark text-sm sm:text-base mt-0.5 block">
                    {currentStat.nrrTertimbang.toFixed(3)} <span className="text-text-muted text-xs font-normal">(Skala 1 - 4)</span>
                  </strong>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <span className="text-text-muted block text-[11px]">Total Seluruh Waktu</span>
                  <strong className="text-text-dark text-sm sm:text-base mt-0.5 block">
                    {allTimeSummary.totalRespondents} Responden
                  </strong>
                </div>
              </div>
            </div>

            {/* Rincian 9 Unsur Pelayanan (Bar Chart Horizontal) */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-border-fine shadow-xs">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h4 className="font-heading font-extrabold text-base sm:text-lg text-text-dark">
                    Rincian Penilaian 9 Unsur Pelayanan
                  </h4>
                  <p className="text-xs text-text-muted mt-0.5">
                    Sesuai Peraturan MenPAN-RB No. 14 Tahun 2017 (Skala Nilai 1.00 s/d 4.00)
                  </p>
                </div>
                <span className="hidden sm:inline-flex px-3 py-1 rounded-full text-xs font-bold bg-bg-snow border border-border-fine text-text-muted">
                  9 Indikator
                </span>
              </div>

              <div className="space-y-4">
                {currentStat.questionAverages.map((q) => (
                  <div key={q.questionId} className="p-4 rounded-2xl bg-bg-snow border border-border-fine/60">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-primary/10 text-primary text-[11px] font-black flex items-center justify-center shrink-0">
                          {q.unsurCode}
                        </span>
                        <span className="text-xs font-extrabold text-text-dark">
                          {q.shortLabel}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-heading font-extrabold text-xs text-text-dark">
                          {q.averageScore.toFixed(2)}
                        </span>
                        <span className="text-[10px] text-text-muted">/ 4.00</span>
                      </div>
                    </div>

                    <div className="w-full bg-white h-2.5 rounded-full overflow-hidden border border-border-fine/40">
                      <motion.div
                        className={`h-full rounded-full ${theme.bar}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${q.percentage}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="p-6 rounded-3xl bg-primary/5 border border-primary/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-primary shrink-0" />
                <p className="text-xs text-text-dark leading-relaxed">
                  Penilaian ini diperbarui secara real-time berdasarkan suara pasien. Masukan Anda sangat berharga bagi peningkatan mutu layanan kami.
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsShareOpen(true)}
                  className="px-4 py-2.5 rounded-full bg-white border border-border-fine text-xs font-bold text-text-dark hover:bg-bg-snow transition-all inline-flex items-center gap-2 shadow-2xs cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5 text-primary" />
                  <span>Bagikan</span>
                </button>
                <Link
                  href="/survei"
                  className="px-5 py-2.5 rounded-full bg-primary text-white text-xs font-bold hover:bg-primary-dark transition-all inline-flex items-center gap-2 shadow-2xs"
                >
                  <span>Beri Penilaian</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      )}

      {/* Share Modal */}
      {hasData && (
        <SurveyShareModal
          stat={currentStat}
          isOpen={isShareOpen}
          onClose={() => setIsShareOpen(false)}
          pageUrl={pageUrl}
        />
      )}
    </div>
  );
}
