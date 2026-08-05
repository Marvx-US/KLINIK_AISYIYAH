import React from 'react';
import { Metadata } from 'next';
import { getAllServices } from '@/core/services/serviceService';
import ServicesManager from '@/features/services/components/ServicesManager';

export const metadata: Metadata = {
  title: 'Kelola Layanan | Admin',
};

// Force dynamic rendering to always fetch fresh data from database
export const revalidate = 0;

export default async function AdminServicesPage() {
  let services: any[] = [];

  try {
    services = await getAllServices();
  } catch (error) {
    console.error('Error fetching services for admin:', error);
  }

  return (
    <div className="w-full">
      <ServicesManager initialServices={services} />
    </div>
  );
}
