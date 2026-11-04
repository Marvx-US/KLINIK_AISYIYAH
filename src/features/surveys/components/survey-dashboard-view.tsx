'use client';

import React, { useState } from 'react';
import {
  Users,
  Award,
  Trash2,
  Phone,
  Calendar,
  Loader2,
  FileSpreadsheet,
  Download,
  Filter,
} from 'lucide-react';
import type { SurveyAnalyticsSummary, SurveyResponseItem } from '../types';
import SurveyQrModal from './survey-qr-modal';
import { deleteSurvey } from '../actions/delete-survey';
import { exportSurveysToExcel } from '../utils/export-excel';

interface SurveyDashboardViewProps {
  analytics: SurveyAnalyticsSummary;
  responses: SurveyResponseItem[];
  surveyUrl: string;
}

export default function SurveyDashboardView({
  analytics,
  responses,
  surveyUrl,
}: SurveyDashboardViewProps) {
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [filterService, setFilterService] = useState<string>('ALL');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Hapus data survei dari responden "${name}"?`)) return;

    setDeletingId(id);
    const res = await deleteSurvey(id);
    setDeletingId(null);

    if (!res.success) {
      alert(res.message);
    }
  };

  // Filter berdasarkan Tanggal Pengisian & Jenis Layanan
  const filteredResponses = responses.filter((r) => {
    // 1. Filter Layanan
    if (filterService !== 'ALL' && r.serviceReceived !== filterService) {
      return false;
    }

    // 2. Filter Rentang Tanggal
    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      if (new Date(r.createdAt) < start) return false;
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      if (new Date(r.createdAt) > end) return false;
    }

    return true;
  });

  const uniqueServices = Array.from(new Set(responses.map((r) => r.serviceReceived)));

  const handleExport = () => {
    exportSurveysToExcel({
      responses: filteredResponses,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      serviceFilter: filterService,
    });
  };

  const handleResetFilter = () => {
    setStartDate('');
    setEndDate('');
    setFilterService('ALL');
  };

  return (
    <div className="space-y-8">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-border-fine shadow-xs">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-text-dark">
            Survei Kepuasan Pasien (SKM)
          </h1>
          <p className="text-text-muted text-xs sm:text-sm mt-1">
            Indeks Kepuasan Masyarakat berbasis 9 Unsur Standar PermenPAN-RB No. 14 Tahun 2017.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-all cursor-pointer shadow-2xs hover:shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Export Rekap Excel ({filteredResponses.length})</span>
          </button>
          <SurveyQrModal surveyUrl={surveyUrl} />
        </div>
      </div>

      {/* Filter Rentang Tanggal & Layanan */}
      <div className="bg-white p-5 rounded-3xl border border-border-fine shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 text-xs font-bold text-text-dark shrink-0">
            <Filter className="w-4 h-4 text-primary" />
            <span>Rentang Waktu:</span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-border-fine bg-bg-snow text-xs text-text-dark focus:outline-none focus:border-primary"
              title="Dari Tanggal"
            />
            <span className="text-xs text-text-muted">s/d</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-border-fine bg-bg-snow text-xs text-text-dark focus:outline-none focus:border-primary"
              title="Sampai Tanggal"
            />
          </div>

          {uniqueServices.length > 0 && (
            <select
              value={filterService}
              onChange={(e) => setFilterService(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-border-fine bg-bg-snow text-xs font-bold text-text-dark focus:outline-none focus:border-primary"
            >
              <option value="ALL">Semua Layanan</option>
              {uniqueServices.map((srv) => (
                <option key={srv} value={srv}>
                  {srv}
                </option>
              ))}
            </select>
          )}

          {(startDate || endDate || filterService !== 'ALL') && (
            <button
              type="button"
              onClick={handleResetFilter}
              className="text-xs font-bold text-red-600 hover:underline px-2 py-1 cursor-pointer"
            >
              Reset Filter
            </button>
          )}
        </div>

        <p className="text-xs text-text-muted">
          Menampilkan <span className="font-bold text-text-dark">{filteredResponses.length}</span> dari {responses.length} total responden
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Responden */}
        <div className="bg-white p-6 rounded-3xl border border-border-fine shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
              Total Responden
            </span>
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="font-heading font-extrabold text-3xl text-text-dark">
            {analytics.totalRespondents}
          </p>
          <p className="text-[11px] text-text-muted mt-1">Orang telah mengisi kuesioner</p>
        </div>

        {/* Nilai IKM */}
        <div className="bg-white p-6 rounded-3xl border border-border-fine shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
              Nilai IKM (25 - 100)
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <p className="font-heading font-extrabold text-3xl text-primary">
            {analytics.ikmScore}
          </p>
          <p className="text-[11px] text-text-muted mt-1">Skor Konversi IKM Pelayanan</p>
        </div>

        {/* Mutu Pelayanan */}
        <div className="bg-white p-6 rounded-3xl border border-border-fine shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
              Mutu Pelayanan
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                analytics.ikmGrade === 'A'
                  ? 'bg-emerald-100 text-emerald-800'
                  : analytics.ikmGrade === 'B'
                    ? 'bg-blue-100 text-blue-800'
                    : analytics.ikmGrade === 'C'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-red-100 text-red-800'
              }`}
            >
              Grade {analytics.ikmGrade}
            </span>
          </div>
          <p className="font-heading font-extrabold text-2xl text-text-dark">
            {analytics.ikmCategory}
          </p>
          <p className="text-[11px] text-text-muted mt-1">Berdasarkan PermenPAN-RB</p>
        </div>

        {/* Tindak Lanjut Keluhan */}
        <div className="bg-white p-6 rounded-3xl border border-border-fine shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
              Kontak Pasien
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <Phone className="w-5 h-5" />
            </div>
          </div>
          <p className="font-heading font-extrabold text-2xl text-text-dark">100%</p>
          <p className="text-[11px] text-text-muted mt-1">Siap untuk follow-up WA/Telepon</p>
        </div>
      </div>

      {/* Rincian Skor per 9 Unsur */}
      <div className="bg-white p-6 rounded-3xl border border-border-fine shadow-xs">
        <h2 className="font-heading font-bold text-lg text-text-dark mb-4 flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5 text-primary" />
          Rata-rata Skor per Unsur Pelayanan (Skala 1.00 - 4.00)
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {analytics.questionAverages.map((q, idx) => (
            <div key={q.questionId} className="p-3.5 rounded-2xl bg-bg-snow/60 border border-border-fine/60">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold text-primary">Unsur {idx + 1}</span>
                <span className="text-xs font-extrabold text-text-dark px-2 py-0.5 rounded-md bg-white border border-border-fine">
                  {q.averageScore} / 4.00
                </span>
              </div>
              <p className="text-xs text-text-muted line-clamp-2 leading-relaxed">
                {q.title}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabel Riwayat Responden */}
      <div className="bg-white rounded-3xl border border-border-fine shadow-xs overflow-hidden">
        <div className="p-6 border-b border-border-fine flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="font-heading font-bold text-lg text-text-dark">
              Daftar Tanggapan Pasien
            </h2>
            <p className="text-xs text-text-muted mt-0.5">
              Data responden beserta tanggal pengisian & kontak untuk keperluan follow-up.
            </p>
          </div>
        </div>

        {filteredResponses.length === 0 ? (
          <div className="py-16 text-center text-text-muted text-sm">
            Tidak ada tanggapan survei pada filter ini.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-bg-snow/70 text-text-dark font-bold border-b border-border-fine">
                <tr>
                  <th className="py-3 px-4">Tanggal & Jam</th>
                  <th className="py-3 px-4">Nama Pasien</th>
                  <th className="py-3 px-4">Kontak (WA)</th>
                  <th className="py-3 px-4">Profil</th>
                  <th className="py-3 px-4">Layanan</th>
                  <th className="py-3 px-4 text-center">Rata-rata Skor</th>
                  <th className="py-3 px-4">Saran / Masukan</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-fine">
                {filteredResponses.map((r) => {
                  const avg = Number(
                    ((r.q1 + r.q2 + r.q3 + r.q4 + r.q5 + r.q6 + r.q7 + r.q8 + r.q9) / 9).toFixed(2)
                  );
                  const cleanPhone = r.contactNumber.replace(/[^0-9]/g, '');
                  const waNumber = cleanPhone.startsWith('0')
                    ? `62${cleanPhone.slice(1)}`
                    : cleanPhone;

                  return (
                    <tr key={r.id} className="hover:bg-bg-snow/40 transition-colors">
                      <td className="py-3.5 px-4 text-text-muted whitespace-nowrap">
                        <span className="flex items-center gap-1.5 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-primary" />
                          {new Date(r.createdAt).toLocaleString('id-ID', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-text-dark">
                        {r.respondentName}
                      </td>
                      <td className="py-3.5 px-4">
                        <a
                          href={`https://wa.me/${waNumber}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-emerald-600 font-bold hover:underline"
                        >
                          <Phone className="w-3 h-3" />
                          <span>{r.contactNumber}</span>
                        </a>
                      </td>
                      <td className="py-3.5 px-4 text-text-muted">
                        {r.gender === 'L' ? 'Laki-laki' : 'Perempuan'}, {r.age} th · {r.education}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold text-[10px]">
                          {r.serviceReceived}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold text-text-dark">
                        <span
                          className={`px-2 py-1 rounded-md text-[11px] font-extrabold ${
                            avg >= 3.5
                              ? 'bg-emerald-100 text-emerald-800'
                              : avg >= 3.0
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {avg} / 4.00
                        </span>
                      </td>
                      <td className="py-3.5 px-4 max-w-xs text-text-dark">
                        {r.feedback ? (
                          <p className="italic text-[11px] bg-bg-snow p-2 rounded-lg border border-border-fine">
                            &ldquo;{r.feedback}&rdquo;
                          </p>
                        ) : (
                          <span className="text-text-muted text-[11px]">-</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleDelete(r.id, r.respondentName)}
                          disabled={deletingId === r.id}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Hapus tanggapan"
                        >
                          {deletingId === r.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
