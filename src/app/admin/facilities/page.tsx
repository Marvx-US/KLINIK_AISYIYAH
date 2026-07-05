import React from 'react';
import { Metadata } from 'next';
import { getAllFacilities } from '@/core/services/facilityService';
import FacilitiesManager from '@/features/facilities/components/FacilitiesManager';

export const metadata: Metadata = {
  title: 'Kelola Fasilitas | Admin',
};

export default async function AdminFacilitiesPage() {
  let facilities: Awaited<ReturnType<typeof getAllFacilities>> = [];

  try {
    facilities = await getAllFacilities();
  } catch (error) {
    console.error('Error fetching facilities for admin:', error);
  }

  return (
    <div className="w-full">
      <FacilitiesManager initialFacilities={facilities} />
    </div>
  );
}
