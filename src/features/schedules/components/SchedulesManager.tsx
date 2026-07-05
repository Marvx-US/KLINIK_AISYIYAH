'use client';

import React, { useState, useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { saveScheduleAction, deleteScheduleAction, toggleScheduleStatusAction } from '@/app/actions/schedules';
import { Plus, Edit2, Trash2, ArrowLeft, Loader2, AlertCircle, Power, Clock } from 'lucide-react';
import ConfirmModal from '@/components/ui/ConfirmModal';

import { type DoctorSchedule } from '@prisma/client';

interface SchedulesManagerProps {
  initialSchedules: DoctorSchedule[];
}

export default function SchedulesManager({ initialSchedules }: SchedulesManagerProps) {
  const router = useRouter();
  const [schedules, setSchedules] = useState<DoctorSchedule[]>(initialSchedules);
  const [editingSchedule, setEditingSchedule] = useState<DoctorSchedule | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [isToggling, setIsToggling] = useState<number | null>(null);
  const [deletePendingId, setDeletePendingId] = useState<number | null>(null);
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'warning' as 'danger' | 'warning' | 'info',
  });

  const [state, formAction, isPending] = useActionState(saveScheduleAction, null);

  useEffect(() => {
    if (state?.success) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsFormOpen(false);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEditingSchedule(null);
      router.refresh();
    }
  }, [state, router]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSchedules(initialSchedules);
  }, [initialSchedules]);

  const handleDelete = async (id: number) => {
    setIsDeleting(id);
    const result = await deleteScheduleAction(id);
    setIsDeleting(null);
    if (result.success) {
      router.refresh();
    } else {
      alert(result.error);
    }
  };

  const confirmDelete = (id: number, poli: string) => {
    setDeletePendingId(id);
    setModalConfig({
      isOpen: true,
      title: 'Hapus Jadwal?',
      message: `Apakah Anda yakin ingin menghapus jadwal untuk ${poli}? Tindakan ini tidak dapat dibatalkan.`,
      type: 'danger',
    });
  };

  const handleModalConfirm = async () => {
    if (deletePendingId !== null) {
      setModalConfig({ ...modalConfig, isOpen: false });
      await handleDelete(deletePendingId);
      setDeletePendingId(null);
    }
  };

  const handleToggle = async (id: number, currentStatus: boolean) => {
    setIsToggling(id);
    const result = await toggleScheduleStatusAction(id, currentStatus);
    setIsToggling(null);
    if (result.success) {
      router.refresh();
    } else {
      alert(result.error);
    }
  };

  if (isFormOpen) {
    return (
      <div className="max-w-3xl mx-auto animate-fade-in-up">
        <button
          onClick={() => {
            setIsFormOpen(false);
            setEditingSchedule(null);
          }}
          className="flex items-center gap-2 text-sm text-text-muted hover:text-text-dark transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Daftar Jadwal
        </button>

        <div className="bg-white rounded-3xl p-8 border-fine shadow-sm">
          <h2 className="font-heading font-bold text-2xl text-text-dark mb-6">
            {editingSchedule ? 'Edit Jadwal Dokter' : 'Tambah Jadwal Dokter'}
          </h2>

          {state?.error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{state.error}</p>
            </div>
          )}

          <form action={formAction} className="space-y-6">
            {editingSchedule && <input type="hidden" name="id" value={editingSchedule.id} />}

            <div>
              <label htmlFor="poli" className="block text-sm font-semibold text-text-dark mb-2">Nama Poli</label>
              <input
                type="text"
                id="poli"
                name="poli"
                defaultValue={editingSchedule?.poli || ''}
                placeholder="Contoh: Poli Umum"
                required
                className="w-full px-4 py-3 rounded-xl border-fine bg-bg-snow focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
              />
            </div>

            <div>
              <label htmlFor="doctorName" className="block text-sm font-semibold text-text-dark mb-2">Nama Dokter</label>
              <input
                type="text"
                id="doctorName"
                name="doctorName"
                defaultValue={editingSchedule?.doctorName || ''}
                placeholder="Contoh: dr. H. Ahmad Fauzi"
                required
                className="w-full px-4 py-3 rounded-xl border-fine bg-bg-snow focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
              />
            </div>
            
            <div>
              <label htmlFor="scheduleInfo" className="block text-sm font-semibold text-text-dark mb-2">Waktu Praktik</label>
              <input
                type="text"
                id="scheduleInfo"
                name="scheduleInfo"
                defaultValue={editingSchedule?.scheduleInfo || ''}
                placeholder="Contoh: 08.00 - 13.00 WIB"
                required
                className="w-full px-4 py-3 rounded-xl border-fine bg-bg-snow focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
              />
            </div>

            <div className="pt-4 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsFormOpen(false);
                  setEditingSchedule(null);
                }}
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl border-fine shadow-sm">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-text-dark">Kelola Jadwal Dokter</h1>
          <p className="text-text-muted text-sm mt-1">Atur jadwal praktik dokter yang tampil di Halaman Utama.</p>
        </div>
        <button
          onClick={() => {
            setEditingSchedule(null);
            setIsFormOpen(true);
          }}
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
            className={`bg-white rounded-3xl p-6 border-fine shadow-sm transition-all duration-300 ${!schedule.isActive ? 'opacity-70 grayscale-[0.3]' : 'hover:-translate-y-1 hover:shadow-md'}`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${schedule.isActive ? 'bg-primary-light/50 text-primary' : 'bg-gray-100 text-gray-500'}`}>
                {schedule.isActive ? 'Aktif' : 'Disembunyikan'}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggle(schedule.id, schedule.isActive)}
                  disabled={isToggling === schedule.id}
                  title={schedule.isActive ? 'Sembunyikan' : 'Tampilkan'}
                  className={`p-2 rounded-full transition-colors ${schedule.isActive ? 'text-primary hover:bg-primary-light' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-700'}`}
                >
                  {isToggling === schedule.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Power className="h-4 w-4" />
                  )}
                </button>
                <button
                  onClick={() => {
                    setEditingSchedule(schedule);
                    setIsFormOpen(true);
                  }}
                  className="p-2 rounded-full text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => confirmDelete(schedule.id, schedule.poli)}
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

      <ConfirmModal
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
        onConfirm={handleModalConfirm}
        onCancel={() => {
          setModalConfig({ ...modalConfig, isOpen: false });
          setDeletePendingId(null);
        }}
      />
    </div>
  );
}
