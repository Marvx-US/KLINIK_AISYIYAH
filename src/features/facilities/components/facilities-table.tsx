'use client';

import React from 'react';
import { Plus, Edit2, Trash2, Loader2, Image as ImageIcon, Power } from 'lucide-react';
import { type Facility } from '../types';

interface FacilitiesTableProps {
  facilities: Facility[];
  onCreateNew: () => void;
  onEdit: (facility: Facility) => void;
  onToggleStatus: (id: number, currentStatus: boolean) => void;
  onPromptDelete: (id: number) => void;
  togglePendingId: number | null;
}

export default function FacilitiesTable({
  facilities,
  onCreateNew,
  onEdit,
  onToggleStatus,
  onPromptDelete,
  togglePendingId,
}: FacilitiesTableProps) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-3xl text-text-dark">Kelola Fasilitas</h1>
          <p className="text-text-muted mt-2">
            Atur foto ruangan dan fasilitas klinik untuk ditampilkan secara estetis di beranda.
          </p>
        </div>
        <button
          type="button"
          onClick={onCreateNew}
          className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-full text-sm font-bold flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
        >
          <Plus className="w-4 h-4" />
          Fasilitas Baru
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-border-fine shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-snow border-b border-border-fine">
                <th className="py-4 px-6 font-semibold text-xs text-text-muted uppercase tracking-wider">
                  Foto & Info
                </th>
                <th className="py-4 px-6 font-semibold text-xs text-text-muted uppercase tracking-wider">
                  Deskripsi
                </th>
                <th className="py-4 px-6 font-semibold text-xs text-text-muted uppercase tracking-wider">
                  Status
                </th>
                <th className="py-4 px-6 font-semibold text-xs text-text-muted uppercase tracking-wider text-right">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-fine">
              {facilities.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-text-muted">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <ImageIcon className="w-12 h-12 text-border-fine" />
                      <p>Belum ada fasilitas. Silakan tambah baru.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                facilities.map((facility) => (
                  <tr key={facility.id} className="hover:bg-bg-snow/50 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="relative w-20 h-20 rounded-2xl overflow-hidden shadow-sm shrink-0 border border-border-fine">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={facility.imageUrl} alt={facility.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-bold text-text-dark text-sm">{facility.name}</p>
                          <p className="text-xs text-text-muted mt-1">
                            Ditambahkan: {new Date(facility.createdAt).toLocaleDateString('id-ID')}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm text-text-muted line-clamp-2 max-w-md">{facility.description}</p>
                    </td>
                    <td className="py-4 px-6">
                      <button
                        type="button"
                        onClick={() => onToggleStatus(facility.id, facility.isActive)}
                        disabled={togglePendingId === facility.id}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-colors border ${
                          facility.isActive 
                            ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' 
                            : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                        } disabled:opacity-50`}
                      >
                        {togglePendingId === facility.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Power className="w-3 h-3" />
                        )}
                        {facility.isActive ? 'Aktif' : 'Nonaktif'}
                      </button>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => onEdit(facility)}
                          className="p-2 text-text-muted hover:text-primary hover:bg-primary-light rounded-xl transition-colors"
                          title="Edit Fasilitas"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onPromptDelete(facility.id)}
                          className="p-2 text-text-muted hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                          title="Hapus Fasilitas"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
