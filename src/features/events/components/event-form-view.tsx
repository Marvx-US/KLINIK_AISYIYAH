'use client';

import React from 'react';
import { ArrowLeft, Loader2, AlertCircle, Image as ImageIcon } from 'lucide-react';
import RichTextEditor from '@/components/ui/rich-text-editor';
import EventPreviewCard from './event-preview-card';
import { type Event } from '@prisma/client';
import { useEventForm } from '../hooks/use-event-form';
import { cn } from '@/lib/utils';

interface EventFormViewProps {
  event: Event | null;
  onCancel: () => void;
  onSuccess: () => void;
}

export default function EventFormView({
  event,
  onCancel,
  onSuccess,
}: EventFormViewProps) {
  const {
    state,
    formAction,
    isPending,
    title,
    setTitle,
    eventDate,
    setEventDate,
    location,
    setLocation,
    status,
    setStatus,
    coverImagePreview,
    handleCoverImageChange,
    editorContent,
    setEditorContent,
    activeTab,
    setActiveTab,
  } = useEventForm({ event, onSuccess });

  return (
    <div className="bg-white rounded-3xl border-fine p-8 shadow-sm">
      <button
        type="button"
        onClick={onCancel}
        className="inline-flex items-center gap-1.5 text-text-muted hover:text-text-dark text-xs font-semibold mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke Daftar
      </button>

      {state?.error && (
        <div className="p-4 mb-6 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex gap-3 items-start">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <span>{state.error}</span>
        </div>
      )}

      <div className="flex border-b border-border-fine mb-8">
        <button
          type="button"
          onClick={() => setActiveTab('edit')}
          className={cn(
            'py-3 px-6 text-sm font-semibold border-b-2 transition-all',
            activeTab === 'edit'
              ? 'border-primary text-primary font-bold'
              : 'border-transparent text-text-muted hover:text-text-dark'
          )}
        >
          Tulis Event
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('preview')}
          className={cn(
            'py-3 px-6 text-sm font-semibold border-b-2 transition-all',
            activeTab === 'preview'
              ? 'border-primary text-primary font-bold'
              : 'border-transparent text-text-muted hover:text-text-dark'
          )}
        >
          Pratinjau (Live Preview)
        </button>
      </div>

      <form action={formAction} className="space-y-6">
        {event && <input type="hidden" name="id" value={event.id} />}

        <div className={activeTab === 'edit' ? 'space-y-6' : 'hidden'}>
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

          <div>
            <label htmlFor="coverImage" className="block text-xs font-bold text-text-dark uppercase tracking-wider mb-2">
              Foto Sampul (Opsional)
            </label>
            {coverImagePreview && (
              <div className="mb-3">
                <span className="text-xs text-text-muted block mb-1">Foto Sampul Saat Ini / Terpilih:</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={coverImagePreview}
                  alt="Cover Preview"
                  className="w-48 h-auto rounded-lg border border-border-fine object-cover"
                />
              </div>
            )}
            <div className="flex items-center gap-3 w-full bg-white border border-border-fine rounded-2xl py-2 px-4 focus-within:border-primary transition-all">
              <ImageIcon className="w-5 h-5 text-text-muted shrink-0" />
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

        <div className={activeTab === 'preview' ? 'block' : 'hidden'}>
          <EventPreviewCard
            title={title}
            eventDate={eventDate}
            location={location}
            status={status}
            coverImagePreview={coverImagePreview}
            editorContent={editorContent}
          />
        </div>

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
            onClick={onCancel}
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full border border-border-fine bg-white text-text-dark font-sans text-sm font-semibold transition-all hover:bg-bg-snow"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}
