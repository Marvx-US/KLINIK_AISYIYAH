/**
 * LAYER 1 - REPOSITORY
 */

import { db } from '@/lib/db';

export async function findAllSchedules() {
  return (db as any).doctorSchedule.findMany({ orderBy: { poli: 'asc' } });
}

export async function findActiveSchedules() {
  return (db as any).doctorSchedule.findMany({
    where: { isActive: true },
    orderBy: { poli: 'asc' },
  });
}

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
