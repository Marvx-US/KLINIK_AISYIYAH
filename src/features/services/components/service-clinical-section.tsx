'use client';

import React from 'react';
import { Upload, FileText } from 'lucide-react';
import { type Service } from '../types';

interface ServiceClinicalSectionProps {
  service: Service;
  operationalHours: string;
  facilities: string;
  benefits: string;
  preparation: string;
  onAutoResize: (
    e: React.FormEvent<HTMLTextAreaElement> | React.FocusEvent<HTMLTextAreaElement>
  ) => void;
}

export default function ServiceClinicalSection({
  service,
  operationalHours,
  facilities,
  benefits,
  preparation,
  onAutoResize,
}: ServiceClinicalSectionProps) {
  const isPoli = service.slug?.toLowerCase().includes('poli') || service.name.toLowerCase().includes('poli');

  return (
    <>
      {/* BAGIAN 3: JADWAL & FASILITAS */}
      <div className="border-b border-border-fine pb-8">
        <h4 className="text-base md:text-lg font-bold text-primary mb-6 flex items-center gap-2.5">
          <Upload className="w-5 h-5" /> 3. Jadwal Operasional & Fasilitas Pendukung
        </h4>

        <div className="flex flex-col gap-8">
          {isPoli ? (
            <div className="flex flex-col gap-2.5">
              <label htmlFor="operationalHours" className="text-sm font-bold text-text-dark">
                Jadwal Operasional / Jam Praktek
              </label>
              <textarea
                id="operationalHours"
                name="operationalHours"
                rows={3}
                defaultValue={operationalHours}
                onFocus={onAutoResize}
                onInput={onAutoResize}
                placeholder="Format satu per baris (Hari: Jam)..."
                className="w-full px-5 py-3.5 bg-bg-snow border border-border-fine rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium font-mono leading-relaxed resize-y overflow-hidden min-h-[90px]"
              />
            </div>
          ) : (
            <input type="hidden" name="operationalHours" value="" />
          )}

          <div className="flex flex-col gap-2.5">
            <label htmlFor="facilities" className="text-sm font-bold text-text-dark">
              Fasilitas Pendukung
            </label>
            <textarea
              id="facilities"
              name="facilities"
              rows={3}
              defaultValue={facilities}
              onFocus={onAutoResize}
              onInput={onAutoResize}
              placeholder="Tulis 1 nama fasilitas per baris..."
              className="w-full px-5 py-3.5 bg-bg-snow border border-border-fine rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium leading-relaxed resize-y overflow-hidden min-h-[90px]"
            />
          </div>
        </div>
      </div>

      {/* BAGIAN 4: DETAIL PELAYANAN & PERSIAPAN */}
      <div className="border-b border-border-fine pb-8">
        <h4 className="text-base md:text-lg font-bold text-primary mb-6 flex items-center gap-2.5">
          <FileText className="w-5 h-5" /> 4. Detail Pelayanan, Keunggulan & Persiapan
        </h4>

        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2.5">
            <label htmlFor="benefits" className="text-sm font-bold text-text-dark">
              Manfaat & Keunggulan Layanan
            </label>
            <textarea
              id="benefits"
              name="benefits"
              rows={3}
              defaultValue={benefits}
              onFocus={onAutoResize}
              onInput={onAutoResize}
              placeholder="Tulis 1 manfaat per baris..."
              className="w-full px-5 py-3.5 bg-bg-snow border border-border-fine rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium leading-relaxed resize-y overflow-hidden min-h-[90px]"
            />
          </div>

          <div className="flex flex-col gap-2.5">
            <label htmlFor="preparation" className="text-sm font-bold text-text-dark">
              Persiapan Berkunjung Pasien
            </label>
            <textarea
              id="preparation"
              name="preparation"
              rows={3}
              defaultValue={preparation}
              onFocus={onAutoResize}
              onInput={onAutoResize}
              placeholder="Tulis 1 instruksi per baris..."
              className="w-full px-5 py-3.5 bg-bg-snow border border-border-fine rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium leading-relaxed resize-y overflow-hidden min-h-[90px]"
            />
          </div>
        </div>
      </div>
    </>
  );
}
