/**
 * LAYER 1 - REPOSITORY
 */

const prisma = (await import('@/lib/db')).db as any;

export async function findAllBanners() {
  return prisma.banner.findMany({ orderBy: { createdAt: 'desc' } });
}

export async function findActiveBanners() {
  return prisma.banner.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
  });
}

export async function findBannerById(id: number) {
  return prisma.banner.findUnique({ where: { id } });
}

export async function createBanner(data: {
  title: string;
  imageUrl: string;
  isActive: boolean;
}) {
  return prisma.banner.create({ data });
}

export async function updateBanner(
  id: number,
  data: { title?: string; imageUrl?: string; isActive?: boolean }
) {
  return prisma.banner.update({ where: { id }, data });
}

export async function deleteBanner(id: number) {
  return prisma.banner.delete({ where: { id } });
}
