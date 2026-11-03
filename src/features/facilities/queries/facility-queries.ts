import 'server-only';
import { db } from '@/lib/db';

/**
 * DATA ACCESS LAYER (READ) — Fasilitas & Sarana Medis
 * Wajib `server-only` (Bab 6.1 HANDBOOK_CLEANCODE.md)
 */

export async function getAllFacilities(limit = 50) {
  const safeLimit = Math.max(1, Math.min(limit, 50));
  return db.facility.findMany({
    orderBy: { createdAt: 'desc' },
    take: safeLimit,
  });
}

export async function getActiveFacilities(limit = 50) {
  const safeLimit = Math.max(1, Math.min(limit, 50));
  return db.facility.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
    take: safeLimit,
  });
}

export async function getFacilityById(id: number) {
  return db.facility.findUnique({ where: { id } });
}
