import React from 'react';
import { Metadata } from 'next';
import { db } from '@/lib/db';
import FacilitiesManager from './FacilitiesManager';

export const metadata: Metadata = {
  title: 'Kelola Fasilitas | Admin',
};

export default async function AdminFacilitiesPage() {
  const facilities = await (db as any).facility.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="w-full">
      <FacilitiesManager initialFacilities={facilities} />
    </div>
  );
}
