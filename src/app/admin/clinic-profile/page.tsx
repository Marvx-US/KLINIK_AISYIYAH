import React from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { getAboutImageUrl } from '@/core/services/siteSettingService';
import ClinicPhotoManager from '@/features/settings/components/ClinicPhotoManager';

export const dynamic = 'force-dynamic';

export default async function ClinicProfileAdminPage() {
  const currentImageUrl = await getAboutImageUrl().catch(() => null);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center text-primary">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-heading font-extrabold text-2xl text-text-dark tracking-tight">
                Foto Utama Klinik
              </h1>
              <p className="text-sm text-text-muted mt-0.5">
                Kelola foto yang tampil pada section &quot;Tentang Klinik&quot; di halaman utama
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-border-fine" />

      {/* Manager Component */}
      <div className="bg-white rounded-3xl border border-border-fine p-8 shadow-sm">
        <ClinicPhotoManager currentImageUrl={currentImageUrl} />
      </div>
    </div>
  );
}
