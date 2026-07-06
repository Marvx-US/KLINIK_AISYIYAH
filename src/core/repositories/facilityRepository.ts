/**
 * LAYER 1 - REPOSITORY
 * Hanya berisi operasi database mentah (CRUD).
 */

import { db } from '@/lib/db';
import { unstable_cache } from 'next/cache';

export const findAllFacilities = unstable_cache(
  async () => (db as any).facility.findMany({ orderBy: { createdAt: 'desc' } }),
  ['facilities-all'],
  { revalidate: 60, tags: ['facilities'] }
);

export const findActiveFacilities = unstable_cache(
  async () =>
    (db as any).facility.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    }),
  ['facilities-active'],
  { revalidate: 60, tags: ['facilities'] }
);

// Fungsi WRITE — tidak di-cache
export async function findFacilityById(id: number) {
  return (db as any).facility.findUnique({ where: { id } });
}

export async function createFacility(data: {
  name: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
}) {
  return (db as any).facility.create({ data });
}

export async function updateFacility(
  id: number,
  data: {
    name?: string;
    description?: string;
    imageUrl?: string;
    isActive?: boolean;
  }
) {
  return (db as any).facility.update({ where: { id }, data });
}

export async function deleteFacility(id: number) {
  return (db as any).facility.delete({ where: { id } });
}
