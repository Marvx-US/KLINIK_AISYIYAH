'use client';

import React, { useState, useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { saveEventAction, deleteEventAction } from '@/app/actions/events';
import { 
  Plus, Edit2, Trash2, ArrowLeft, Loader2, AlertCircle, 
  Calendar, MapPin, Info, Image as ImageIcon 
} from 'lucide-react';
import ConfirmModal from '@/components/ui/ConfirmModal';
import RichTextEditor from '@/components/ui/RichTextEditor';
import { sanitizeHtml } from '@/lib/sanitizeHtml';

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
  
  // Controlled inputs states for previewing
  const [title, setTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState('DRAFT');
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const [editorContent, setEditorContent] = useState('');
  
  // Navigation tabs state
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

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

  // Clean up Object URL to prevent memory leaks
  useEffect(() => {
    return () => {
      if (coverImagePreview && coverImagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(coverImagePreview);
      }
    };
  }, [coverImagePreview]);

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setEditorContent(event.content);
    setTitle(event.title);
    setEventDate(formatDateForInput(event.eventDate));
    setLocation(event.location || '');
    setStatus(event.status);
    setCoverImagePreview(event.coverImage || null);
    setActiveTab('edit');
    setIsFormOpen(true);
  };

  const handleCreateNew = () => {
    setEditingEvent(null);
    setEditorContent('');
    setTitle('');
    setEventDate('');
    setLocation('');
    setStatus('DRAFT');
    setCoverImagePreview(null);
    setActiveTab('edit');
    setIsFormOpen(true);
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Revoke previous blob URL if exists
      if (coverImagePreview && coverImagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(coverImagePreview);
      }
      const objectUrl = URL.createObjectURL(file);
      setCoverImagePreview(objectUrl);
    }
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

  // Format Date for display
  const formatDateForDisplay = (dateStr: string) => {
    if (!dateStr) return 'Segera Hadir';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return 'Segera Hadir';
    return date.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const formatShortDateForDisplay = (dateStr: string) => {
    if (!dateStr) return 'Segera Hadir';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return 'Segera Hadir';
    return date.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
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
          {/* Back Button */}
          <button
            onClick={() => setIsFormOpen(false)}
            className="inline-flex items-center gap-1.5 text-text-muted hover:text-text-dark text-xs font-semibold mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Daftar
          </button>

          {/* Navigation Tabs */}
          <div className="flex border-b border-border-fine mb-8">
            <button
              type="button"
              onClick={() => setActiveTab('edit')}
              className={`py-3 px-6 text-sm font-semibold border-b-2 transition-all ${
                activeTab === 'edit'
                  ? 'border-primary text-primary font-bold'
                  : 'border-transparent text-text-muted hover:text-text-dark'
              }`}
            >
              Tulis Event
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`py-3 px-6 text-sm font-semibold border-b-2 transition-all ${
                activeTab === 'preview'
                  ? 'border-primary text-primary font-bold'
                  : 'border-transparent text-text-muted hover:text-text-dark'
              }`}
            >
              Pratinjau (Live Preview)
            </button>
          </div>

          <form action={formAction} className="space-y-6">
            {editingEvent && (
              <input type="hidden" name="id" value={editingEvent.id} />
            )}

            {/* EDIT TAB CONTENT */}
            <div className={activeTab === 'edit' ? 'space-y-6' : 'hidden'}>
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
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
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
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
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
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
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
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
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
                {coverImagePreview && (
                  <div className="mb-3">
                    <span className="text-xs text-text-muted block mb-1">Foto Sampul Saat Ini / Terpilih:</span>
                    <img 
                      src={coverImagePreview} 
                      alt="Cover Preview" 
                      className="w-48 h-auto rounded-lg border border-border-fine object-cover" 
                    />
                  </div>
                )}
                <div className="flex items-center gap-3 w-full bg-white border border-border-fine rounded-2xl py-2 px-4 focus-within:border-primary transition-all">
                  <ImageIcon className="w-5 h-5 text-text-muted flex-shrink-0" />
                  <input
                    type="file"
                    id="coverImage"
                    name="coverImage"
                    accept="image/*"
                    onChange={handleCoverImageChange}
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
                <RichTextEditor 
                  value={editorContent} 
                  onChange={setEditorContent} 
                  placeholder="Tuliskan deskripsi lengkap event, jadwal kegiatan, atau persyaratan..." 
                />
              </div>
            </div>

            {/* PREVIEW TAB CONTENT */}
            <div className={activeTab === 'preview' ? 'block space-y-8 bg-bg-snow/40 p-6 sm:p-8 rounded-3xl border border-border-fine' : 'hidden'}>
              {/* Alert status preview */}
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-light text-primary text-xs font-semibold border border-primary/10 mb-4">
                <AlertCircle className="w-4 h-4" />
                <span>Mode Pratinjau: Event ini akan ditampilkan dengan status <strong>{status}</strong>.</span>
              </div>

              {/* Mock Detail Page */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-7xl mx-auto bg-white p-8 sm:p-12 rounded-2xl border border-border-fine shadow-sm">
                
                {/* Main Content */}
                <div className="lg:col-span-8 space-y-6">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-light text-primary text-xs font-semibold tracking-wide uppercase border border-primary/10">
                    <Calendar className="h-3.5 w-3.5" />
                    Agenda Kegiatan
                  </span>
                  
                  <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-text-dark tracking-tight leading-[1.2] font-editorial-serif">
                    {title || 'Judul Event Anda Akan Tampil di Sini'}
                  </h1>

                  <div className="flex flex-wrap items-center gap-4 text-text-muted text-xs">
                    <div className="flex items-center gap-1.5 bg-bg-snow px-3 py-1.5 rounded-full border border-border-fine">
                      <Calendar className="h-3.5 w-3.5 text-primary" />
                      <span className="font-semibold">{formatShortDateForDisplay(eventDate)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-bg-snow px-3 py-1.5 rounded-full border border-border-fine">
                      <MapPin className="h-3.5 w-3.5 text-primary" />
                      <span className="font-semibold">{location || 'Klinik Aisyiyah'}</span>
                    </div>
                  </div>

                  {coverImagePreview && (
                    <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-border-fine my-6">
                      <img 
                        src={coverImagePreview} 
                        alt="Cover Preview" 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  )}

                  {/* HTML content render */}
                  <div 
                    className="prose prose-neutral max-w-none font-sans text-text-dark/95 leading-relaxed text-base"
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(editorContent || '<p className="text-text-muted italic">Isi deskripsi event masih kosong. Tulis event pada tab Tulis Event.</p>') }}
                  />
                </div>

                {/* Sidebar Info Summary */}
                <div className="lg:col-span-4 space-y-6">
                  <div className="bg-bg-snow/50 p-6 rounded-2xl border border-border-fine">
                    <h3 className="font-heading font-bold text-xs tracking-widest uppercase text-text-dark mb-4 flex items-center gap-2 border-b border-border-fine pb-3">
                      <Info className="h-4 w-4 text-primary" />
                      Ringkasan Kegiatan
                    </h3>
                    <div className="flex flex-col gap-4 text-xs text-text-muted">
                      <div>
                        <p className="text-[10px] uppercase text-text-muted tracking-wider font-semibold">Tanggal Pelaksanaan</p>
                        <p className="font-heading font-bold text-text-dark text-sm mt-1">
                          {formatDateForDisplay(eventDate)}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase text-text-muted tracking-wider font-semibold">Tempat/Lokasi</p>
                        <p className="font-heading font-bold text-text-dark text-sm mt-1">
                          {location || 'Klinik Aisyiyah'}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase text-text-muted tracking-wider font-semibold">Status Pendaftaran</p>
                        <p className="font-heading font-bold text-primary text-sm mt-1">
                          Terbuka untuk Umum
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Submit & Cancel Buttons */}
            <div className="flex gap-4 pt-4 border-t border-border-fine">
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
