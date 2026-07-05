'use client';

import React, { useState, useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { saveEventAction, deleteEventAction } from '../../actions/events';
import { Plus, Edit2, Trash2, ArrowLeft, Loader2, AlertCircle, Calendar, MapPin, Info, Image as ImageIcon } from 'lucide-react';
import ConfirmModal from '@/components/ui/ConfirmModal';
import RichTextEditor from '@/components/ui/RichTextEditor';

import { type Event } from '@prisma/client';

interface EventsManagerProps {
  initialEvents: Event[];
}

export default function EventsManager({ initialEvents }: EventsManagerProps) {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(saveEventAction, null);
  const [deletePendingId, setDeletePendingId] = useState<number | null>(null);
  const [editorContent, setEditorContent] = useState('');

  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    targetId?: number;
    isAlertOnly?: boolean;
    type?: 'danger' | 'warning' | 'info';
  }>({ isOpen: false, title: '', message: '' });

  useEffect(() => {
    if (state?.success) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsFormOpen(false);
      setEditingEvent(null);
      router.refresh();
      window.location.reload();
    }
  }, [state, router]);

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setEditorContent(event.content);
    setIsFormOpen(true);
  };

  const handleCreateNew = () => {
    setEditingEvent(null);
    setEditorContent('');
    setIsFormOpen(true);
  };

  const requestDelete = (id: number) => {
    setModalConfig({
      isOpen: true,
      title: 'Hapus Event',
      message: 'Apakah Anda yakin ingin menghapus event/kegiatan ini? Tindakan ini tidak dapat dibatalkan.',
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
      setEvents(events.filter((evt) => evt.id !== id));
      router.refresh();
      setModalConfig({ ...modalConfig, isOpen: false });
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

  // Convert Date object to YYYY-MM-DD for date input value
  const formatDateForInput = (dateObj: Date | null | undefined) => {
    if (!dateObj) return '';
    const date = new Date(dateObj);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-text-dark">
            {isFormOpen ? (editingEvent ? 'Edit Event/Kegiatan' : 'Buat Event Baru') : 'Kelola Event & Kegiatan'}
          </h1>
          <p className="text-text-muted text-sm mt-1">
            {isFormOpen ? 'Isi formulir di bawah ini dengan lengkap.' : 'Daftar semua kegiatan/agenda klinik yang ada di website.'}
          </p>
        </div>

        {!isFormOpen && (
          <button
            onClick={handleCreateNew}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white font-sans text-sm font-semibold transition-all duration-300 hover:bg-primary-dark active:scale-[0.98] shadow-sm hover:shadow-md"
          >
            <Plus className="h-4.5 w-4.5" />
            Buat Event Baru
          </button>
        )}
      </div>

      {state?.error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex gap-3 items-start">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <span>{state.error}</span>
        </div>
      )}

      {/* Form Editor View */}
      {isFormOpen ? (
        <div className="bg-white rounded-3xl border-fine p-8 shadow-sm">
          <button
            onClick={() => setIsFormOpen(false)}
            className="inline-flex items-center gap-1.5 text-text-muted hover:text-text-dark text-xs font-semibold mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Daftar
          </button>

          <form action={formAction} className="space-y-6">
            {editingEvent && (
              <input type="hidden" name="id" value={editingEvent.id} />
            )}

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-xs font-bold text-text-dark uppercase tracking-wider mb-2">
                Judul Kegiatan
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                defaultValue={editingEvent?.title || ''}
                placeholder="Masukkan judul event/berita..."
                className="w-full bg-white border border-border-fine rounded-full py-3 px-5 text-sm font-sans focus:outline-none focus:border-primary text-text-dark transition-all"
              />
            </div>

            {/* Date, Location, and Status Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Event Date */}
              <div>
                <label htmlFor="eventDate" className="block text-xs font-bold text-text-dark uppercase tracking-wider mb-2">
                  Tanggal Pelaksanaan
                </label>
                <input
                  id="eventDate"
                  name="eventDate"
                  type="date"
                  defaultValue={formatDateForInput(editingEvent?.eventDate)}
                  className="w-full bg-white border border-border-fine rounded-full py-3 px-5 text-sm font-sans focus:outline-none focus:border-primary text-text-dark transition-all"
                />
              </div>

              {/* Location */}
              <div>
                <label htmlFor="location" className="block text-xs font-bold text-text-dark uppercase tracking-wider mb-2">
                  Tempat / Lokasi
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  defaultValue={editingEvent?.location || ''}
                  placeholder="Contoh: Aula Klinik Lt. 1"
                  className="w-full bg-white border border-border-fine rounded-full py-3 px-5 text-sm font-sans focus:outline-none focus:border-primary text-text-dark transition-all"
                />
              </div>

              {/* Status */}
              <div>
                <label htmlFor="status" className="block text-xs font-bold text-text-dark uppercase tracking-wider mb-2">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  required
                  defaultValue={editingEvent?.status || 'DRAFT'}
                  className="w-full bg-white border border-border-fine rounded-2xl py-3 px-5 text-sm font-sans focus:outline-none focus:border-primary text-text-dark transition-all"
                >
                  <option value="DRAFT">Draf (Sembunyikan)</option>
                  <option value="PUBLISHED">Publikasikan</option>
                </select>
              </div>
            </div>

            {/* Foto Sampul */}
            <div>
              <label htmlFor="coverImage" className="block text-xs font-bold text-text-dark uppercase tracking-wider mb-2">
                Foto Sampul (Opsional)
              </label>
              {editingEvent?.coverImage && (
                <div className="mb-3">
                  <span className="text-xs text-text-muted block mb-1">Foto saat ini:</span>
                  <img src={editingEvent.coverImage} alt="Cover" className="w-48 h-auto rounded-lg border border-border-fine object-cover" />
                </div>
              )}
              <div className="flex items-center gap-3 w-full bg-white border border-border-fine rounded-2xl py-2 px-4 focus-within:border-primary transition-all">
                <ImageIcon className="w-5 h-5 text-text-muted flex-shrink-0" />
                <input
                  type="file"
                  id="coverImage"
                  name="coverImage"
                  accept="image/*"
                  className="w-full text-sm font-sans text-text-dark file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-all cursor-pointer"
                />
              </div>
              <p className="text-xs text-text-muted mt-2">Format: JPG, PNG. Rekomendasi ukuran 1200x630px.</p>
            </div>

            {/* Content (HTML Editor area) */}
            <div>
              <label className="block text-xs font-bold text-text-dark uppercase tracking-wider mb-2">
                Detail Deskripsi Event
              </label>
              <input type="hidden" name="content" value={editorContent} />
              <RichTextEditor value={editorContent} onChange={setEditorContent} placeholder="Tuliskan deskripsi lengkap event, jadwal kegiatan, atau persyaratan..." />
            </div>

            {/* Submit */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-primary text-white font-sans text-sm font-semibold transition-all duration-300 hover:bg-primary-dark active:scale-[0.98] disabled:opacity-50"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  'Simpan Event'
                )}
              </button>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full border border-border-fine bg-white text-text-dark font-sans text-sm font-semibold transition-all hover:bg-bg-snow"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Listing View */
        <div className="bg-white rounded-3xl border-fine overflow-hidden shadow-sm">
          {events.length === 0 ? (
            <div className="text-center py-20">
              <Calendar className="h-12 w-12 text-primary/30 mx-auto mb-4" />
              <p className="text-text-muted text-lg font-medium">Belum ada event/kegiatan</p>
              <p className="text-text-muted text-sm mt-1">Klik tombol Buat Event Baru di atas untuk memulai.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-fine-b bg-bg-snow/50 text-xs font-bold text-text-muted uppercase tracking-wider">
                    <th className="py-4 px-8">Judul Kegiatan</th>
                    <th className="py-4 px-6">Lokasi</th>
                    <th className="py-4 px-6">Tanggal Acara</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-8 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-fine">
                  {events.map((evt) => (
                    <tr key={evt.id} className="hover:bg-bg-snow/35 transition-colors">
                      <td className="py-4 px-8 font-heading font-bold text-text-dark max-w-xs truncate">
                        {evt.title}
                      </td>
                      <td className="py-4 px-6 text-text-muted flex items-center gap-1.5 mt-1.5">
                        <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span className="truncate">{evt.location || 'Klinik Aisyiyah'}</span>
                      </td>
                      <td className="py-4 px-6 text-text-muted">
                        {evt.eventDate ? new Date(evt.eventDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Info'}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide border ${
                          evt.status === 'PUBLISHED'
                            ? 'bg-primary-light text-primary border-primary/10'
                            : 'bg-gray-100 text-gray-500 border-gray-200'
                        }`}>
                          {evt.status}
                        </span>
                      </td>
                      <td className="py-4 px-8 text-right">
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() => handleEdit(evt)}
                            className="p-2 rounded-lg text-text-muted hover:text-primary hover:bg-primary-light transition-colors"
                            title="Edit Event"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                        onClick={() => requestDelete(evt.id)}
                        disabled={deletePendingId === evt.id}
                        className="p-2 text-text-muted hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-50"
                        title="Hapus"
                      >
                            {deletePendingId === evt.id ? (
                              <Loader2 className="h-4 w-4 animate-spin text-red-600" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
      {/* Custom Modal untuk konfirmasi & alert */}
      <ConfirmModal
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
        isAlertOnly={modalConfig.isAlertOnly}
        isLoading={deletePendingId !== null}
        onConfirm={modalConfig.isAlertOnly ? () => setModalConfig({ ...modalConfig, isOpen: false }) : confirmDelete}
        onCancel={() => setModalConfig({ ...modalConfig, isOpen: false })}
        confirmText={modalConfig.isAlertOnly ? 'Tutup' : 'Ya, Hapus Event'}
        cancelText="Batal"
      />
    </div>
  );
}
