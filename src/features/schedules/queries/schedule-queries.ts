import 'server-only';
import { db } from '@/lib/db';

/**
 * DATA ACCESS LAYER (READ) — Jadwal Praktik Dokter & Poliklinik
 * Wajib `server-only` (Bab 6.1 HANDBOOK_CLEANCODE.md)
 */

export async function getAllSchedules(limit = 50) {
  const safeLimit = Math.max(1, Math.min(limit, 50));
  return db.doctorSchedule.findMany({
    orderBy: { poli: 'asc' },
    take: safeLimit,
  });
}

export async function getActiveSchedules(limit = 50) {
  const safeLimit = Math.max(1, Math.min(limit, 50));
  return db.doctorSchedule.findMany({
    where: { isActive: true },
    orderBy: { poli: 'asc' },
    take: safeLimit,
  });
}

export async function getScheduleById(id: number) {
  return db.doctorSchedule.findUnique({ where: { id } });
}
