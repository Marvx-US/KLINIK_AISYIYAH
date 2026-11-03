'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { deleteEvent as deleteEventAction } from '../actions/delete-event';
import ConfirmModal from '@/components/ui/confirm-modal';
import EventsTable from './events-table';
import EventFormView from './event-form-view';
import { type Event } from '@prisma/client';

interface EventsManagerProps {
  initialEvents: Event[];
}

export default function EventsManager({ initialEvents }: EventsManagerProps) {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deletePendingId, setDeletePendingId] = useState<number | null>(null);

  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    targetId?: number;
    isAlertOnly?: boolean;
    type?: 'danger' | 'warning' | 'info';
  }>({ isOpen: false, title: '', message: '' });

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setIsFormOpen(true);
  };

  const handleCreateNew = () => {
    setEditingEvent(null);
    setIsFormOpen(true);
  };

  const requestDelete = (id: number) => {
    setModalConfig({
      isOpen: true,
      title: 'Hapus Event',
      message:
        'Apakah Anda yakin ingin menghapus event/kegiatan ini? Tindakan ini tidak dapat dibatalkan.',
      targetId: id,
      type: 'danger',
      isAlertOnly: false,
    });
  };

  const confirmDelete = async () => {
    if (!modalConfig.targetId) return;
    const id = modalConfig.targetId;

    setDeletePendingId(id);
    const res = await deleteEventAction(id);

    if (res.success) {
      setEvents((prev) => prev.filter((evt) => evt.id !== id));
      router.refresh();
      setModalConfig((prev) => ({ ...prev, isOpen: false }));
    } else {
      setModalConfig({
        isOpen: true,
        title: 'Gagal Menghapus',
        message: res.error || 'Gagal menghapus event. Silakan coba lagi.',
        isAlertOnly: true,
        type: 'danger',
      });
    }
    setDeletePendingId(null);
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-text-dark">
            {isFormOpen
              ? editingEvent
                ? 'Edit Event/Kegiatan'
                : 'Buat Event Baru'
              : 'Kelola Event & Kegiatan'}
          </h1>
          <p className="text-text-muted text-sm mt-1">
            {isFormOpen
              ? 'Isi formulir di bawah ini dengan lengkap.'
              : 'Daftar semua kegiatan/agenda klinik yang ada di website.'}
          </p>
        </div>

        {!isFormOpen && (
          <button
            type="button"
            onClick={handleCreateNew}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white font-sans text-sm font-semibold transition-all duration-300 hover:bg-primary-dark active:scale-[0.98] shadow-sm hover:shadow-md"
          >
            <Plus className="h-4.5 w-4.5" />
            Buat Event Baru
          </button>
        )}
      </div>

      {isFormOpen ? (
        <EventFormView
          event={editingEvent}
          onCancel={() => setIsFormOpen(false)}
          onSuccess={() => {
            setIsFormOpen(false);
            setEditingEvent(null);
          }}
        />
      ) : (
        <EventsTable
          events={events}
          onEdit={handleEdit}
          onRequestDelete={requestDelete}
          deletePendingId={deletePendingId}
        />
      )}

      {/* Confirmation & Alert Modal */}
      <ConfirmModal
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
        isAlertOnly={modalConfig.isAlertOnly}
        isLoading={deletePendingId !== null}
        onConfirm={
          modalConfig.isAlertOnly
            ? () => setModalConfig((prev) => ({ ...prev, isOpen: false }))
            : confirmDelete
        }
        onCancel={() => setModalConfig((prev) => ({ ...prev, isOpen: false }))}
        confirmText={modalConfig.isAlertOnly ? 'Tutup' : 'Ya, Hapus Event'}
        cancelText="Batal"
      />
    </div>
  );
}
