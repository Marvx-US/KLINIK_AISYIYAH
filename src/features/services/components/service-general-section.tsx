'use client';

import React from 'react';
import { Activity } from 'lucide-react';
import { AVAILABLE_ICONS, ICON_MAP } from '../constants/service-icons';
import { type Service } from '../types';

interface ServiceGeneralSectionProps {
  service: Service;
  selectedIcon: string;
  setSelectedIcon: (icon: string) => void;
  purpose: string;
  onAutoResize: (
    e: React.FormEvent<HTMLTextAreaElement> | React.FocusEvent<HTMLTextAreaElement>
  ) => void;
}

export default function ServiceGeneralSection({
  service,
  selectedIcon,
  setSelectedIcon,
  purpose,
  onAutoResize,
}: ServiceGeneralSectionProps) {
  const renderIconPreview = (iconName: string) => {
    const IconComp = ICON_MAP[iconName] || Activity;
    return <IconComp className="w-5 h-5" />;
  };

  return (
    <div className="border-b border-border-fine pb-8">
      <h4 className="text-base md:text-lg font-bold text-primary mb-6 flex items-center gap-2.5">
        <Activity className="w-5 h-5" /> 1. Informasi Utama Layanan
      </h4>

      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          <div className="flex flex-col gap-2.5">
            <label htmlFor="name" className="text-sm font-bold text-text-dark">
              Nama Layanan / Poli <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              defaultValue={service.name}
              placeholder="Contoh: Poli Gigi"
              className="px-4 py-3 bg-bg-snow border border-border-fine rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium"
            />
          </div>

          <div className="flex flex-col gap-2.5">
            <label htmlFor="iconName" className="text-sm font-bold text-text-dark">
              Pilih Ikon Layanan <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-primary-light border border-primary/20 flex items-center justify-center text-primary shrink-0">
                {renderIconPreview(selectedIcon)}
              </div>
              <div className="grow">
                <select
                  id="iconName"
                  name="iconName"
                  value={selectedIcon}
                  onChange={(e) => setSelectedIcon(e.target.value)}
                  className="w-full px-4 py-2.5 bg-bg-snow border border-border-fine rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-semibold text-text-dark cursor-pointer"
                >
                  {AVAILABLE_ICONS.map((icon) => (
                    <option key={icon.name} value={icon.name}>
                      {icon.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <label className="text-sm font-bold text-text-dark">Status Visibilitas</label>
            <label className="flex items-center gap-3 cursor-pointer p-3 border border-border-fine rounded-2xl hover:bg-bg-snow transition-colors">
              <input
                type="checkbox"
                name="isActive"
                value="true"
                defaultChecked={service.isActive}
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <div>
                <p className="font-semibold text-sm text-text-dark">Aktifkan Layanan</p>
                <p className="text-xs text-text-muted mt-0.5">Tampil di halaman publik</p>
              </div>
            </label>
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          <label htmlFor="description" className="text-sm font-bold text-text-dark">
            Deskripsi Layanan <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={3}
            defaultValue={service.description}
            onFocus={onAutoResize}
            onInput={onAutoResize}
            placeholder="Deskripsikan layanan secara lengkap..."
            className="w-full px-5 py-3.5 bg-bg-snow border border-border-fine rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium leading-relaxed resize-y overflow-hidden min-h-[90px]"
          />
        </div>

        <div className="flex flex-col gap-2.5">
          <label htmlFor="purpose" className="text-sm font-bold text-text-dark">
            Tujuan Utama Medis
          </label>
          <textarea
            id="purpose"
            name="purpose"
            rows={3}
            defaultValue={purpose}
            onFocus={onAutoResize}
            onInput={onAutoResize}
            placeholder="Tujuan utama pelayanan ini..."
            className="w-full px-5 py-3.5 bg-bg-snow border border-border-fine rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium leading-relaxed resize-y overflow-hidden min-h-[90px]"
          />
        </div>
      </div>
    </div>
  );
}
