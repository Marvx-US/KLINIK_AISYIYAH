'use client';

import React from 'react';
import { Plus, Edit2, Trash2, Loader2, Power, Activity, HelpCircle } from 'lucide-react';
import { type Service } from '../types';
import { ICON_MAP } from '../constants/service-icons';
import { cn } from '@/lib/utils';

interface ServicesTableProps {
  services: Service[];
  onCreateNew: () => void;
  onEdit: (service: Service) => void;
  onToggleStatus: (id: number, currentStatus: boolean) => void;
  onPromptDelete: (id: number) => void;
  togglePendingId: number | null;
}

export default function ServicesTable({
  services,
  onCreateNew,
  onEdit,
  onToggleStatus,
  onPromptDelete,
  togglePendingId,
}: ServicesTableProps) {
  const renderIcon = (iconName: string) => {
    const IconComp = ICON_MAP[iconName] || HelpCircle;
    return <IconComp className="w-6 h-6" />;
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-3xl text-text-dark">Kelola Layanan Medis</h1>
          <p className="text-text-muted mt-2">Daftar poli, IGD, dan layanan kesehatan Klinik Aisyiyah Pangkajene.</p>
        </div>
        <button
          type="button"
          onClick={onCreateNew}
          className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-full text-sm font-bold flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
        >
          <Plus className="w-4 h-4" />
          Layanan Baru
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-border-fine shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-snow border-b border-border-fine">
                <th className="py-4 px-6 font-semibold text-xs text-text-muted uppercase tracking-wider w-1/4">
                  Layanan & Ikon
                </th>
                <th className="py-4 px-6 font-semibold text-xs text-text-muted uppercase tracking-wider w-1/2">
                  Deskripsi
                </th>
                <th className="py-4 px-6 font-semibold text-xs text-text-muted uppercase tracking-wider w-1/8">
                  Status
                </th>
                <th className="py-4 px-6 font-semibold text-xs text-text-muted uppercase tracking-wider text-right w-1/8">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-fine">
              {services.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-text-muted">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <Activity className="w-12 h-12 text-border-fine" />
                      <p>Belum ada data layanan medis. Silakan tambah baru.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                services.map((service) => (
                  <tr key={service.id} className="hover:bg-bg-snow/50 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary-light border border-primary/10 flex items-center justify-center text-primary shrink-0">
                          {renderIcon(service.iconName)}
                        </div>
                        <div>
                          <p className="font-bold text-text-dark text-sm">{service.name}</p>
                          <p className="text-xs text-text-muted mt-0.5">slug: /{service.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm text-text-muted line-clamp-2 max-w-lg">{service.description}</p>
                    </td>
                    <td className="py-4 px-6">
                      <button
                        type="button"
                        onClick={() => onToggleStatus(service.id, service.isActive)}
                        disabled={togglePendingId === service.id}
                        className={cn(
                          'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-colors border disabled:opacity-50',
                          service.isActive
                            ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                            : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                        )}
                      >
                        {togglePendingId === service.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Power className="w-3 h-3" />
                        )}
                        {service.isActive ? 'Aktif' : 'Nonaktif'}
                      </button>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => onEdit(service)}
                          className="p-2 text-text-muted hover:text-primary hover:bg-primary-light rounded-xl transition-colors"
                          title="Edit Layanan"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onPromptDelete(service.id)}
                          className="p-2 text-text-muted hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                          title="Hapus Layanan"
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
