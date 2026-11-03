'use client';

import React from 'react';
import { Plus, Edit2, Trash2, Loader2, Image as ImageIcon, Power } from 'lucide-react';
import { type Banner } from '../types';

interface BannersTableProps {
  banners: Banner[];
  onCreateNew: () => void;
  onEdit: (banner: Banner) => void;
  onToggle: (banner: Banner) => void;
  onDelete: (banner: Banner) => void;
  deletePendingId: number | null;
}

export default function BannersTable({
  banners,
  onCreateNew,
  onEdit,
  onToggle,
  onDelete,
  deletePendingId,
}: BannersTableProps) {
  return (
    <div className="bg-white rounded-3xl border-fine shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="p-6 border-b border-border-fine bg-bg-snow flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <ImageIcon className="w-5 h-5 text-primary" />
          </div>
          <h2 className="font-heading font-bold text-lg text-text-dark">Daftar Banner</h2>
        </div>
        <button
          type="button"
          onClick={onCreateNew}
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-white text-sm font-bold rounded-full hover:bg-primary-dark transition-all active:scale-[0.98] shadow-sm hover:shadow-md"
        >
          <Plus className="w-4 h-4" />
          Tambah Banner
        </button>
      </div>

      <div className="overflow-x-auto">
        {banners.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <ImageIcon className="w-12 h-12 text-gray-200 mb-4" />
            <p className="text-text-muted text-sm">Belum ada banner yang ditambahkan.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="py-4 px-6 text-xs font-bold text-text-dark uppercase tracking-wider border-b border-border-fine">Gambar</th>
                <th className="py-4 px-6 text-xs font-bold text-text-dark uppercase tracking-wider border-b border-border-fine">Info</th>
                <th className="py-4 px-6 text-xs font-bold text-text-dark uppercase tracking-wider border-b border-border-fine w-32 text-center">Status</th>
                <th className="py-4 px-6 text-xs font-bold text-text-dark uppercase tracking-wider border-b border-border-fine w-48 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-fine">
              {banners.map((banner) => (
                <tr key={banner.id} className="hover:bg-bg-snow/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="w-32 h-20 rounded-lg overflow-hidden border border-border-fine">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" />
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-bold text-sm text-text-dark mb-1">{banner.title}</p>
                    <p className="text-xs text-text-muted">
                      Dibuat: {new Date(banner.createdAt).toLocaleDateString('id-ID')}
                    </p>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      banner.isActive 
                        ? 'bg-green-100 text-green-700 border border-green-200' 
                        : 'bg-gray-100 text-gray-600 border border-gray-200'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${banner.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                      {banner.isActive ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onToggle(banner)}
                        className="p-2 text-gray-500 hover:text-primary hover:bg-primary-light rounded-lg transition-colors"
                        title={banner.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                      >
                        <Power className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onEdit(banner)}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(banner)}
                        disabled={deletePendingId === banner.id}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Hapus"
                      >
                        {deletePendingId === banner.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
