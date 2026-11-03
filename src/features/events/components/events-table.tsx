'use client';

import React from 'react';
import { Calendar, MapPin, Edit2, Trash2, Loader2 } from 'lucide-react';
import { type Event } from '@prisma/client';
import { cn } from '@/lib/utils';
import { CONTENT_STATUS } from '@/lib/constants';

interface EventsTableProps {
  events: Event[];
  onEdit: (event: Event) => void;
  onRequestDelete: (id: number) => void;
  deletePendingId: number | null;
}

export default function EventsTable({
  events,
  onEdit,
  onRequestDelete,
  deletePendingId,
}: EventsTableProps) {
  if (events.length === 0) {
    return (
      <div className="bg-white rounded-3xl border-fine overflow-hidden shadow-sm">
        <div className="text-center py-20">
          <Calendar className="h-12 w-12 text-primary/30 mx-auto mb-4" />
          <p className="text-text-muted text-lg font-medium">Belum ada event/kegiatan</p>
          <p className="text-text-muted text-sm mt-1">
            Klik tombol Buat Event Baru di atas untuk memulai.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border-fine overflow-hidden shadow-sm">
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
                <td className="py-4 px-6 text-text-muted">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span className="truncate">{evt.location || 'Klinik Aisyiyah'}</span>
                  </div>
                </td>
                <td className="py-4 px-6 text-text-muted">
                  {evt.eventDate
                    ? new Date(evt.eventDate).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })
                    : 'Info'}
                </td>
                <td className="py-4 px-6">
                  <span
                    className={cn(
                      'px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide border',
                      evt.status === CONTENT_STATUS.PUBLISHED
                        ? 'bg-primary-light text-primary border-primary/10'
                        : 'bg-gray-100 text-gray-500 border-gray-200'
                    )}
                  >
                    {evt.status}
                  </span>
                </td>
                <td className="py-4 px-8 text-right">
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => onEdit(evt)}
                      className="p-2 rounded-lg text-text-muted hover:text-primary hover:bg-primary-light transition-colors"
                      title="Edit Event"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onRequestDelete(evt.id)}
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
    </div>
  );
}
