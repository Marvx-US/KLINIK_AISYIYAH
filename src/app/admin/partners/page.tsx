import React from 'react';
import { Metadata } from 'next';
import { getAllPartners } from '@/features/partners/queries/partner-queries';
import PartnersManager from '@/features/partners/components/partners-manager';

export const metadata: Metadata = {
  title: 'Kelola Mitra Kerjasama | Admin',
};

export default async function AdminPartnersPage() {
  let partners: Awaited<ReturnType<typeof getAllPartners>> = [];

  try {
    partners = await getAllPartners();
  } catch (error) {
    console.error('Error fetching partners for admin:', error);
  }

  return (
    <div className="w-full">
      <PartnersManager initialPartners={partners} />
    </div>
  );
}
