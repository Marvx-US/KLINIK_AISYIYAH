/**
 * LAYER 1 - REPOSITORY
 */

import { db } from '@/lib/db';
import { unstable_cache } from 'next/cache';

export const findAllPartners = unstable_cache(
  async () => (db as any).partner.findMany({ orderBy: { createdAt: 'desc' } }),
  ['partners-all'],
  { revalidate: 60, tags: ['partners'] }
);

export const findActivePartners = unstable_cache(
  async () =>
    (db as any).partner.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'asc' },
    }),
  ['partners-active'],
  { revalidate: 60, tags: ['partners'] }
);

// Fungsi WRITE — tidak di-cache
export async function findPartnerById(id: number) {
  return (db as any).partner.findUnique({ where: { id } });
}

export async function createPartner(data: {
  name: string;
  logoUrl: string;
  isActive: boolean;
}) {
  return (db as any).partner.create({ data });
}

export async function updatePartner(
  id: number,
  data: { name?: string; logoUrl?: string; isActive?: boolean }
) {
  return (db as any).partner.update({ where: { id }, data });
}

export async function deletePartner(id: number) {
  return (db as any).partner.delete({ where: { id } });
}
