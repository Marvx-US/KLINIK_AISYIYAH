/**
 * LAYER 2 - SERVICE
 */

import * as scheduleRepo from '@/core/repositories/scheduleRepository';

export async function createSchedule(data: {
  poli: string;
  doctorName: string;
  scheduleInfo: string;
}) {
  return scheduleRepo.createSchedule(data);
}

export async function updateSchedule(
  id: number,
  data: { poli: string; doctorName: string; scheduleInfo: string }
) {
  const existing = await scheduleRepo.findScheduleById(id);
  if (!existing) throw new Error('Jadwal tidak ditemukan.');
  return scheduleRepo.updateSchedule(id, data);
}

export async function deleteSchedule(id: number) {
  const existing = await scheduleRepo.findScheduleById(id);
  if (!existing) throw new Error('Jadwal tidak ditemukan.');
  return scheduleRepo.deleteSchedule(id);
}

export async function toggleScheduleStatus(id: number, currentStatus: boolean) {
  const existing = await scheduleRepo.findScheduleById(id);
  if (!existing) throw new Error('Jadwal tidak ditemukan.');
  return scheduleRepo.updateSchedule(id, { isActive: !currentStatus });
}

export const getAllSchedules = scheduleRepo.findAllSchedules;
export const getActiveSchedules = scheduleRepo.findActiveSchedules;
