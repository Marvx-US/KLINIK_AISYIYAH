'use client';

import React from 'react';
import { Plus, Edit2, Trash2, Image as ImageIcon, Power } from 'lucide-react';
import { type Partner } from '../types';

interface PartnersListProps {
  partners: Partner[];
  onCreateNew: () => void;
  onEdit: (partner: Partner) => void;
  onToggleStatus: (id: number, currentStatus: boolean) => void;
  onPromptDelete: (id: number) => void;
}

export default function PartnersList({
  partners,
  onCreateNew,
  onEdit,
  onToggleStatus,
  onPromptDelete,
}: PartnersListProps) {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-3xl text-text-dark tracking-tight">Mitra Kerjasama</h1>
          <p className="text-text-muted mt-2">Kelola logo-logo mitra yang tampil berjajar di halaman beranda Anda.</p>
        </div>

        <button
          type="button"
          onClick={onCreateNew}
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 active:scale-95"
        >
          <Plus className="w-5 h-5" />
          <span>Tambah Mitra</span>
        </button>
      </div>

      {partners.length === 0 ? (
        <div className="bg-white rounded-3xl border border-border-fine p-12 text-center shadow-sm">
          <div className="w-20 h-20 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-6">
            <ImageIcon className="w-10 h-10 text-primary" />
          </div>
          <h3 className="font-heading font-bold text-xl text-text-dark mb-2">Belum ada Mitra</h3>
          <p className="text-text-muted mb-8 max-w-md mx-auto">
            Tambahkan logo mitra kerjasama untuk meningkatkan kepercayaan pengunjung website.
          </p>
          <button
            type="button"
            onClick={onCreateNew}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
          >
            <Plus className="w-5 h-5" />
            <span>Tambah Mitra Pertama</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {partners.map((partner) => (
            <div
              key={partner.id}
              className={`group relative bg-white rounded-3xl border border-border-fine overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col ${
                !partner.isActive ? 'opacity-60 grayscale' : ''
              }`}
            >
              <div className="relative aspect-video bg-bg-snow flex items-center justify-center p-6 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={partner.logoUrl}
                  alt={partner.name}
                  className="max-w-full max-h-full object-contain filter drop-shadow-sm group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm backdrop-blur-md ${
                      partner.isActive
                        ? 'bg-green-100/90 text-green-700 border border-green-200'
                        : 'bg-gray-100/90 text-gray-600 border border-gray-200'
                    }`}
                  >
                    {partner.isActive ? 'Aktif' : 'Nonaktif'}
                  </span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-heading font-bold text-lg text-text-dark truncate" title={partner.name}>
                  {partner.name}
                </h3>

                <div className="mt-6 flex items-center justify-between pt-4 border-t border-border-fine">
                  <button
                    type="button"
                    onClick={() => onToggleStatus(partner.id, partner.isActive)}
                    className={`p-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-semibold ${
                      partner.isActive ? 'text-amber-600 hover:bg-amber-50' : 'text-green-600 hover:bg-green-50'
                    }`}
                    title={partner.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                  >
                    <Power className="w-4 h-4" />
                    {partner.isActive ? 'Matikan' : 'Nyalakan'}
                  </button>

                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => onEdit(partner)}
                      className="p-2 text-text-muted hover:text-primary hover:bg-primary-light rounded-lg transition-colors"
                      title="Edit Mitra"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onPromptDelete(partner.id)}
                      className="p-2 text-text-muted hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Hapus Mitra"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
