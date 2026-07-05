/**
 * LAYER 1 - REPOSITORY
 */

const prisma = (await import('@/lib/db')).db as any;

export async function findAllSchedules() {
  return prisma.doctorSchedule.findMany({ orderBy: { poli: 'asc' } });
}

export async function findActiveSchedules() {
  return prisma.doctorSchedule.findMany({
    where: { isActive: true },
    orderBy: { poli: 'asc' },
  });
}

export async function findScheduleById(id: number) {
  return prisma.doctorSchedule.findUnique({ where: { id } });
}

export async function createSchedule(data: {
  poli: string;
  doctorName: string;
  scheduleInfo: string;
}) {
  return prisma.doctorSchedule.create({ data });
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
  return prisma.doctorSchedule.update({ where: { id }, data });
}

export async function deleteSchedule(id: number) {
  return prisma.doctorSchedule.delete({ where: { id } });
}
