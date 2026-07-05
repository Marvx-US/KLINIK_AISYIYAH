/**
 * LAYER 1 - REPOSITORY
 * Hanya berisi operasi database mentah (CRUD).
 */

import { db } from '@/lib/db';

export async function findAllFacilities() {
  return (db as any).facility.findMany({ orderBy: { createdAt: 'desc' } });
}

export async function findActiveFacilities() {
  return (db as any).facility.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
  });
}

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
