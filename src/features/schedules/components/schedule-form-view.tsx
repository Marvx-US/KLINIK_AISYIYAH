'use client';

import React, { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { saveSchedule as saveScheduleAction } from '../actions/save-schedule';
import { type DoctorSchedule } from '../types';

interface ScheduleFormViewProps {
  schedule: DoctorSchedule | null;
  onCancel: () => void;
  onSuccess: () => void;
}

export default function ScheduleFormView({
  schedule,
  onCancel,
  onSuccess,
}: ScheduleFormViewProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(saveScheduleAction, null);

  useEffect(() => {
    if (state?.success) {
      onSuccess();
      router.refresh();
    }
  }, [state, router, onSuccess]);

  return (
    <div className="max-w-3xl mx-auto animate-fade-in-up">
      <button
        type="button"
        onClick={onCancel}
        className="flex items-center gap-2 text-sm text-text-muted hover:text-text-dark transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke Daftar Jadwal
      </button>

      <div className="bg-white rounded-3xl p-8 border-fine shadow-sm">
        <h2 className="font-heading font-bold text-2xl text-text-dark mb-6">
          {schedule ? 'Edit Jadwal Dokter' : 'Tambah Jadwal Dokter'}
        </h2>

        {state?.error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{state.error}</p>
          </div>
        )}

        <form action={formAction} className="space-y-6">
          {schedule && <input type="hidden" name="id" value={schedule.id} />}

          <div>
            <label htmlFor="poli" className="block text-sm font-semibold text-text-dark mb-2">
              Nama Poli
            </label>
            <input
              type="text"
              id="poli"
              name="poli"
              defaultValue={schedule?.poli || ''}
              placeholder="Contoh: Poli Umum"
              required
              className="w-full px-4 py-3 rounded-xl border-fine bg-bg-snow focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
            />
          </div>

          <div>
            <label htmlFor="doctorName" className="block text-sm font-semibold text-text-dark mb-2">
              Nama Dokter
            </label>
            <input
              type="text"
              id="doctorName"
              name="doctorName"
              defaultValue={schedule?.doctorName || ''}
              placeholder="Contoh: dr. H. Ahmad Fauzi"
              required
              className="w-full px-4 py-3 rounded-xl border-fine bg-bg-snow focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
            />
          </div>

          <div>
            <label htmlFor="scheduleInfo" className="block text-sm font-semibold text-text-dark mb-2">
              Waktu Praktik
            </label>
            <input
              type="text"
              id="scheduleInfo"
              name="scheduleInfo"
              defaultValue={schedule?.scheduleInfo || ''}
              placeholder="Contoh: 08.00 - 13.00 WIB"
              required
              className="w-full px-4 py-3 rounded-xl border-fine bg-bg-snow focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 rounded-full border-fine text-sm font-semibold text-text-muted hover:text-text-dark hover:bg-bg-snow transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-6 py-3 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
            >
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {isPending ? 'Menyimpan...' : 'Simpan Jadwal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
