/**
 * LAYER 1 - REPOSITORY
 * Hanya berisi operasi database mentah (CRUD) untuk Layanan.
 */

import { db } from '@/lib/db';
import { unstable_cache } from 'next/cache';

export const findAllServices = unstable_cache(
  async () => {
    try {
      return await (db as any).service.findMany({ orderBy: { id: 'asc' } });
    } catch (error) {
      console.error('Database error in findAllServices:', error);
      return [];
    }
  },
  ['services-all'],
  { revalidate: 60, tags: ['services'] }
);

export const findActiveServices = unstable_cache(
  async () => {
    try {
      return await (db as any).service.findMany({
        where: { isActive: true },
        orderBy: { id: 'asc' },
      });
    } catch (error) {
      console.error('Database error in findActiveServices:', error);
      return [];
    }
  },
  ['services-active'],
  { revalidate: 60, tags: ['services'] }
);

// Fungsi WRITE — tidak di-cache
export async function findServiceById(id: number) {
  return (db as any).service.findUnique({ where: { id } });
}

export async function findServiceBySlug(slug: string) {
  return (db as any).service.findUnique({ where: { slug } });
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
}) {
  return (db as any).service.create({ data });
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
  }
) {
  return (db as any).service.update({ where: { id }, data });
}

export async function deleteService(id: number) {
  return (db as any).service.delete({ where: { id } });
}
