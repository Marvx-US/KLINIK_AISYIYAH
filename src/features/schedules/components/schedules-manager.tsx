'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteSchedule as deleteScheduleAction } from '../actions/delete-schedule';
import { toggleSchedule as toggleScheduleStatusAction } from '../actions/toggle-schedule';
import ConfirmModal from '@/components/ui/confirm-modal';
import SchedulesGrid from './schedules-grid';
import ScheduleFormView from './schedule-form-view';
import { type DoctorSchedule } from '../types';

export type { DoctorSchedule };

interface SchedulesManagerProps {
  initialSchedules: DoctorSchedule[];
}

export default function SchedulesManager({ initialSchedules }: SchedulesManagerProps) {
  const router = useRouter();
  const [schedules, setSchedules] = useState<DoctorSchedule[]>(initialSchedules);
  const [prevSchedules, setPrevSchedules] = useState(initialSchedules);
  if (prevSchedules !== initialSchedules) {
    setPrevSchedules(initialSchedules);
    setSchedules(initialSchedules);
  }
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

  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (id: number) => {
    setIsDeleting(id);
    setError(null);
    const result = await deleteScheduleAction(id);
    setIsDeleting(null);
    if (result.success) {
      router.refresh();
    } else {
      setError(result.message || result.error || 'Gagal menghapus jadwal');
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
      setModalConfig((prev) => ({ ...prev, isOpen: false }));
      await handleDelete(deletePendingId);
      setDeletePendingId(null);
    }
  };

  const handleToggle = async (id: number, currentStatus: boolean) => {
    setIsToggling(id);
    setError(null);
    const result = await toggleScheduleStatusAction(id, currentStatus);
    setIsToggling(null);
    if (result.success) {
      router.refresh();
    } else {
      setError(result.message || result.error || 'Gagal mengubah status jadwal');
    }
  };

  if (isFormOpen) {
    return (
      <ScheduleFormView
        schedule={editingSchedule}
        onCancel={() => {
          setIsFormOpen(false);
          setEditingSchedule(null);
        }}
        onSuccess={() => {
          setIsFormOpen(false);
          setEditingSchedule(null);
        }}
      />
    );
  }

  return (
    <>
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl flex items-center justify-between text-sm font-medium border border-red-100">
          <span>{error}</span>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-red-400 hover:text-red-600 text-xs font-bold ml-4"
          >
            Tutup
          </button>
        </div>
      )}

      <SchedulesGrid
        schedules={schedules}
        onCreateNew={() => {
          setEditingSchedule(null);
          setIsFormOpen(true);
        }}
        onEdit={(sch) => {
          setEditingSchedule(sch);
          setIsFormOpen(true);
        }}
        onToggle={handleToggle}
        onConfirmDelete={confirmDelete}
        isToggling={isToggling}
        isDeleting={isDeleting}
      />

      <ConfirmModal
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
        onConfirm={handleModalConfirm}
        onCancel={() => {
          setModalConfig((prev) => ({ ...prev, isOpen: false }));
          setDeletePendingId(null);
        }}
      />
    </>
  );
}
