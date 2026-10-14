import React from 'react';
import { Building2 } from 'lucide-react';
import {
  getAboutImageUrl,
  getAboutDescription,
  getClinicVision,
  getClinicMission,
} from '@/core/services/siteSettingService';
import ClinicPhotoManager from '@/features/settings/components/ClinicPhotoManager';
import ClinicProfileTextEditor from '@/features/settings/components/ClinicProfileTextEditor';

export const dynamic = 'force-dynamic';

export default async function ClinicProfileAdminPage() {
  const [currentImageUrl, currentDescription, currentVision, currentMission] = await Promise.all([
    getAboutImageUrl().catch(() => null),
    getAboutDescription().catch(() => null),
    getClinicVision().catch(() => null),
    getClinicMission().catch(() => null),
  ]);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center text-primary">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-heading font-extrabold text-2xl text-text-dark tracking-tight">
                Profil Klinik
              </h1>
              <p className="text-sm text-text-muted mt-0.5">
                Kelola foto, deskripsi, visi &amp; misi yang tampil di halaman utama
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-border-fine" />

      {/* Section Foto Utama */}
      <div>
        <h2 className="font-heading font-bold text-lg text-text-dark mb-4">Foto Utama Klinik</h2>
        <div className="bg-white rounded-3xl border border-border-fine p-8 shadow-sm">
          <ClinicPhotoManager currentImageUrl={currentImageUrl} />
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-border-fine" />

      {/* Section Teks Profil, Visi & Misi */}
      <div>
        <h2 className="font-heading font-bold text-lg text-text-dark mb-4">Konten Teks Profil</h2>
        <ClinicProfileTextEditor
          currentDescription={currentDescription}
          currentVision={currentVision}
          currentMission={currentMission}
        />
      </div>
    </div>
  );
}
