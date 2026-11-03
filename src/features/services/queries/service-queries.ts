import 'server-only';
import { db } from '@/lib/db';

/**
 * DATA ACCESS LAYER (READ) — Layanan & Poliklinik Spesialis
 * Wajib `server-only` (Bab 6.1 HANDBOOK_CLEANCODE.md)
 */

export async function getAllServices(limit = 50) {
  const safeLimit = Math.max(1, Math.min(limit, 50));
  return db.service.findMany({
    orderBy: { id: 'asc' },
    take: safeLimit,
  });
}

export async function getActiveServices(limit = 50) {
  const safeLimit = Math.max(1, Math.min(limit, 50));
  return db.service.findMany({
    where: { isActive: true },
    orderBy: { id: 'asc' },
    take: safeLimit,
  });
}

export async function getServiceById(id: number) {
  return db.service.findUnique({ where: { id } });
}

export async function getServiceBySlug(slug: string) {
  return db.service.findUnique({ where: { slug } });
}
