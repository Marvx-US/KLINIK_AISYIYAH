/**
 * LAYER 1 - REPOSITORY
 */

import { db } from '@/lib/db';

export async function findAllBanners() {
  return (db as any).banner.findMany({ orderBy: { createdAt: 'desc' } });
}

export async function findActiveBanners() {
  return (db as any).banner.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
  });
}

export async function findBannerById(id: number) {
  return (db as any).banner.findUnique({ where: { id } });
}

export async function createBanner(data: {
  title: string;
  imageUrl: string;
  isActive: boolean;
}) {
  return (db as any).banner.create({ data });
}

export async function updateBanner(
  id: number,
  data: { title?: string; imageUrl?: string; isActive?: boolean }
) {
  return (db as any).banner.update({ where: { id }, data });
}

export async function deleteBanner(id: number) {
  return (db as any).banner.delete({ where: { id } });
}
