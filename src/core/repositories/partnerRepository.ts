/**
 * LAYER 1 - REPOSITORY
 */

import { db } from '@/lib/db';

export async function findAllPartners() {
  return (db as any).partner.findMany({ orderBy: { createdAt: 'desc' } });
}

export async function findActivePartners() {
  return (db as any).partner.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'asc' },
  });
}

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
