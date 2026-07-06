/**
 * LAYER 1 - REPOSITORY
 */

import { db } from '@/lib/db';
import { unstable_cache } from 'next/cache';

export const findAllSchedules = unstable_cache(
  async () => (db as any).doctorSchedule.findMany({ orderBy: { poli: 'asc' } }),
  ['schedules-all'],
  { revalidate: 60, tags: ['schedules'] }
);

export const findActiveSchedules = unstable_cache(
  async () =>
    (db as any).doctorSchedule.findMany({
      where: { isActive: true },
      orderBy: { poli: 'asc' },
    }),
  ['schedules-active'],
  { revalidate: 60, tags: ['schedules'] }
);

// Fungsi WRITE — tidak di-cache
export async function findScheduleById(id: number) {
  return (db as any).doctorSchedule.findUnique({ where: { id } });
}

export async function createSchedule(data: {
  poli: string;
  doctorName: string;
  scheduleInfo: string;
}) {
  return (db as any).doctorSchedule.create({ data });
}

export async function updateSchedule(
  id: number,
  data: {
    poli?: string;
    doctorName?: string;
    scheduleInfo?: string;
    isActive?: boolean;
  }
) {
  return (db as any).doctorSchedule.update({ where: { id }, data });
}

export async function deleteSchedule(id: number) {
  return (db as any).doctorSchedule.delete({ where: { id } });
}
