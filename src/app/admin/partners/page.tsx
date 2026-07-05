import React from 'react';
import { Metadata } from 'next';
import { db } from '@/lib/db';
import PartnersManager from './PartnersManager';

export const metadata: Metadata = {
  title: 'Kelola Mitra Kerjasama | Admin',
};

export default async function AdminPartnersPage() {
  const partners = await (db as any).partner.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="w-full">
      <PartnersManager initialPartners={partners} />
    </div>
  );
}
