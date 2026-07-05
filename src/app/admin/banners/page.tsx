import React from 'react';
import { db } from '@/lib/db';
import BannersManager from './BannersManager';

export const metadata = {
  title: 'Kelola Banner - Admin Klinik Aisyiyah',
};

export default async function AdminBannersPage() {
  const banners = await (db as any).banner.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="font-heading font-bold text-3xl text-text-dark tracking-tight">Kelola Banner Depan</h1>
        <p className="text-text-muted mt-2 text-sm">
          Unggah dan atur gambar latar belakang untuk area Hero beranda.
        </p>
      </div>

      <BannersManager initialBanners={banners} />
    </div>
  );
}
