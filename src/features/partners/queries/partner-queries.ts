import 'server-only';
import { db } from '@/lib/db';

/**
 * DATA ACCESS LAYER (READ) — Mitra & Kerjasama Instansi
 * Wajib `server-only` (Bab 6.1 HANDBOOK_CLEANCODE.md)
 */

export async function getAllPartners(limit = 50) {
  const safeLimit = Math.max(1, Math.min(limit, 50));
  return db.partner.findMany({
    orderBy: { createdAt: 'desc' },
    take: safeLimit,
  });
}

export async function getActivePartners(limit = 50) {
  const safeLimit = Math.max(1, Math.min(limit, 50));
  return db.partner.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
    take: safeLimit,
  });
}

export async function getPartnerById(id: number) {
  return db.partner.findUnique({ where: { id } });
}
