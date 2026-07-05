/**
 * LAYER 1 - REPOSITORY
 * Hanya berisi operasi database mentah (CRUD).
 */

const prisma = (await import('@/lib/db')).db as any;

export async function findAllFacilities() {
  return prisma.facility.findMany({ orderBy: { createdAt: 'desc' } });
}

export async function findActiveFacilities() {
  return prisma.facility.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
  });
}

export async function findFacilityById(id: number) {
  return prisma.facility.findUnique({ where: { id } });
}

export async function createFacility(data: {
  name: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
}) {
  return prisma.facility.create({ data });
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
  return prisma.facility.update({ where: { id }, data });
}

export async function deleteFacility(id: number) {
  return prisma.facility.delete({ where: { id } });
}
