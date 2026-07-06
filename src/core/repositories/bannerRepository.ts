/**
 * LAYER 1 - REPOSITORY
 */

import { db } from '@/lib/db';
import { unstable_cache } from 'next/cache';

export const findAllBanners = unstable_cache(
  async () => (db as any).banner.findMany({ orderBy: { createdAt: 'desc' } }),
  ['banners-all'],
  { revalidate: 60, tags: ['banners'] }
);

export const findActiveBanners = unstable_cache(
  async () =>
    (db as any).banner.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    }),
  ['banners-active'],
  { revalidate: 60, tags: ['banners'] }
);

// Fungsi WRITE — tidak di-cache
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
