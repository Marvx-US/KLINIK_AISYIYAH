import 'server-only';
import { db } from '@/lib/db';

/**
 * DATA ACCESS LAYER (READ) — Banner Promosi & Pengumuman
 * Wajib `server-only` (Bab 6.1 HANDBOOK_CLEANCODE.md)
 */

export async function getAllBanners(limit = 20) {
  const safeLimit = Math.max(1, Math.min(limit, 50));
  return db.banner.findMany({
    orderBy: { createdAt: 'desc' },
    take: safeLimit,
  });
}

export async function getActiveBanners(limit = 20) {
  const safeLimit = Math.max(1, Math.min(limit, 50));
  return db.banner.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
    take: safeLimit,
  });
}

export async function getBannerById(id: number) {
  return db.banner.findUnique({ where: { id } });
}
