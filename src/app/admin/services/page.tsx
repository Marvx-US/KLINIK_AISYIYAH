import React from 'react';
import { Metadata } from 'next';
import { type Prisma } from '@prisma/client';
import { getAllServices } from '@/features/services/queries/service-queries';
import ServicesManager from '@/features/services/components/services-manager';
import { type Service } from '@/features/services/types';

export const metadata: Metadata = {
  title: 'Kelola Layanan | Admin',
};

// Force dynamic rendering to always fetch fresh data from database
export const revalidate = 0;

/**
 * Prisma dan local Service interface memiliki field yang identik.
 * Kita gunakan Prisma.ServiceGetPayload untuk mendapat tipe yang tepat,
 * lalu cast via satisfies-compatible assignment (tidak perlu double cast).
 */
type ServiceRow = Prisma.ServiceGetPayload<Record<string, never>>;

export default async function AdminServicesPage() {
  let services: Service[] = [];

  try {
    const rows: ServiceRow[] = await getAllServices();
    // ServiceRow dan Service memiliki shape yang identik — assign langsung
    services = rows as Service[];
  } catch (error) {
    console.error('Error fetching services for admin:', error);
  }

  return (
    <div className="w-full">
      <ServicesManager initialServices={services} />
    </div>
  );
}
