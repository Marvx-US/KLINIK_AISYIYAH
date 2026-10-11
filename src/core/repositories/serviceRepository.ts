/**
 * LAYER 1 - REPOSITORY
 * Operasi database mentah (CRUD) untuk Layanan menggunakan Prisma Client.
 */

import { db } from '@/lib/db';

const serviceClient = (db as any).service;

export async function findAllServices() {
  try {
    return await serviceClient.findMany({ orderBy: { id: 'asc' } });
  } catch (error) {
    console.error('Database error in findAllServices:', error);
    return [];
  }
}

export async function findActiveServices() {
  try {
    return await serviceClient.findMany({
      where: { isActive: true },
      orderBy: { id: 'asc' },
    });
  } catch (error) {
    console.error('Database error in findActiveServices:', error);
    return [];
  }
}

export async function findServiceById(id: number) {
  return serviceClient.findUnique({ where: { id } });
}

export async function findServiceBySlug(slug: string) {
  return serviceClient.findUnique({ where: { slug } });
}

export async function createService(data: {
  name: string;
  slug: string;
  description: string;
  iconName: string;
  isActive: boolean;
  roomImage?: string | null;
  gallery?: string | null;
  priceList?: string | null;
  purpose?: string | null;
  benefits?: string | null;
  facilities?: string | null;
  operationalHours?: string | null;
  preparation?: string | null;
  procedures?: string | null;
  faq?: string | null;
}) {
  return serviceClient.create({ data });
}

export async function updateService(
  id: number,
  data: {
    name?: string;
    slug?: string;
    description?: string;
    iconName?: string;
    isActive?: boolean;
    roomImage?: string | null;
    gallery?: string | null;
    priceList?: string | null;
    purpose?: string | null;
    benefits?: string | null;
    facilities?: string | null;
    operationalHours?: string | null;
    preparation?: string | null;
    procedures?: string | null;
    faq?: string | null;
  }
) {
  return serviceClient.update({
    where: { id },
    data,
  });
}

export async function deleteService(id: number) {
  return serviceClient.delete({ where: { id } });
}


