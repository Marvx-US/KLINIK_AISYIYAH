'use client';

import React from 'react';
import { Plus, Edit2, Trash2, Loader2, Power, Clock } from 'lucide-react';
import { type DoctorSchedule } from '../types';
import ScheduleShareButton from '@/components/ui/schedule-share-button';

interface SchedulesGridProps {
  schedules: DoctorSchedule[];
  onCreateNew: () => void;
  onEdit: (schedule: DoctorSchedule) => void;
  onToggle: (id: number, currentStatus: boolean) => void;
  onConfirmDelete: (id: number, poli: string) => void;
  isToggling: number | null;
  isDeleting: number | null;
}

export default function SchedulesGrid({
  schedules,
  onCreateNew,
  onEdit,
  onToggle,
  onConfirmDelete,
  isToggling,
  isDeleting,
}: SchedulesGridProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl border-fine shadow-sm">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-text-dark">Kelola Jadwal Dokter</h1>
          <p className="text-text-muted text-sm mt-1">Atur jadwal praktik dokter yang tampil di Halaman Utama.</p>
        </div>
        <button
          type="button"
          onClick={onCreateNew}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white text-sm font-bold tracking-wide transition-all hover:bg-primary-dark active:scale-[0.98] shadow-sm hover:shadow-md"
        >
          <Plus className="h-4.5 w-4.5" />
          Tambah Jadwal
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {schedules.map((schedule) => (
          <div
            key={schedule.id}
            className={`bg-white rounded-3xl p-6 border-fine shadow-sm transition-all duration-300 ${
              !schedule.isActive ? 'opacity-70 grayscale-[0.3]' : 'hover:-translate-y-1 hover:shadow-md'
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div
                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  schedule.isActive ? 'bg-primary-light/50 text-primary' : 'bg-gray-100 text-gray-500'
                }`}
              >
                {schedule.isActive ? 'Aktif' : 'Disembunyikan'}
              </div>
              <div className="flex items-center gap-2">
                <ScheduleShareButton
                  poli={schedule.poli}
                  doctorName={schedule.doctorName}
                  scheduleInfo={schedule.scheduleInfo}
                  triggerVariant="icon-only"
                  aria-label={`Bagikan jadwal ${schedule.poli}`}
                />
                <button
                  type="button"
                  onClick={() => onToggle(schedule.id, schedule.isActive)}
                  disabled={isToggling === schedule.id}
                  title={schedule.isActive ? 'Sembunyikan' : 'Tampilkan'}
                  className={`p-2 rounded-full transition-colors ${
                    schedule.isActive
                      ? 'text-primary hover:bg-primary-light'
                      : 'text-gray-400 hover:bg-gray-100 hover:text-gray-700'
                  }`}
                >
                  {isToggling === schedule.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Power className="h-4 w-4" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => onEdit(schedule)}
                  className="p-2 rounded-full text-blue-600 hover:bg-blue-50 transition-colors"
                  title="Edit"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onConfirmDelete(schedule.id, schedule.poli)}
                  className="p-2 rounded-full text-red-600 hover:bg-red-50 transition-colors"
                  disabled={isDeleting === schedule.id}
                  title="Hapus"
                >
                  {isDeleting === schedule.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <h3 className="font-heading font-bold text-lg text-text-dark mb-1">{schedule.poli}</h3>
              <p className="text-text-muted text-sm">{schedule.doctorName}</p>
              <div className="flex items-center gap-2 mt-4 pt-4 border-fine-t text-sm font-semibold text-primary">
                <Clock className="h-4 w-4" />
                {schedule.scheduleInfo}
              </div>
            </div>
          </div>
        ))}

        {schedules.length === 0 && (
          <div className="col-span-full py-16 flex flex-col items-center justify-center text-center bg-white rounded-3xl border-fine border-dashed">
            <div className="h-16 w-16 rounded-full bg-bg-snow flex items-center justify-center mb-4">
              <Clock className="h-8 w-8 text-text-muted" />
            </div>
            <p className="font-heading font-bold text-text-dark text-lg mb-2">Belum Ada Jadwal</p>
            <p className="text-text-muted text-sm max-w-sm">
              Tambahkan jadwal dokter untuk menampilkannya di Halaman Utama website.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
