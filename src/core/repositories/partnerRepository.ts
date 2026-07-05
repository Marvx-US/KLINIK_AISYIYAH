/**
 * LAYER 1 - REPOSITORY
 */

const prisma = (await import('@/lib/db')).db as any;

export async function findAllPartners() {
  return prisma.partner.findMany({ orderBy: { createdAt: 'desc' } });
}

export async function findActivePartners() {
  return prisma.partner.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'asc' },
  });
}

export async function findPartnerById(id: number) {
  return prisma.partner.findUnique({ where: { id } });
}

export async function createPartner(data: {
  name: string;
  logoUrl: string;
  isActive: boolean;
}) {
  return prisma.partner.create({ data });
}

export async function updatePartner(
  id: number,
  data: { name?: string; logoUrl?: string; isActive?: boolean }
) {
  return prisma.partner.update({ where: { id }, data });
}

export async function deletePartner(id: number) {
  return prisma.partner.delete({ where: { id } });
}
