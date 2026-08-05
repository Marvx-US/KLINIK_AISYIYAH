/**
 * LAYER 1 - REPOSITORY
 * Hanya berisi operasi database mentah (CRUD) untuk Layanan.
 */

import { db } from '@/lib/db';
import { unstable_cache } from 'next/cache';

export const findAllServices = unstable_cache(
  async () => {
    try {
      return await (db as any).service.findMany({ orderBy: { id: 'asc' } });
    } catch (error) {
      console.error('Database error in findAllServices:', error);
      return [];
    }
  },
  ['services-all'],
  { revalidate: 60, tags: ['services'] }
);

export const findActiveServices = unstable_cache(
  async () => {
    try {
      return await (db as any).service.findMany({
        where: { isActive: true },
        orderBy: { id: 'asc' },
      });
    } catch (error) {
      console.error('Database error in findActiveServices:', error);
      return [];
    }
  },
  ['services-active'],
  { revalidate: 60, tags: ['services'] }
);

// Fungsi WRITE — tidak di-cache
export async function findServiceById(id: number) {
  return (db as any).service.findUnique({ where: { id } });
}

export async function findServiceBySlug(slug: string) {
  return (db as any).service.findUnique({ where: { slug } });
}

export async function createService(data: {
  name: string;
  slug: string;
  description: string;
  iconName: string;
  isActive: boolean;
  roomImage?: string | null;
  gallery?: string | null;
  priceList?: string | null;
  purpose?: string | null;
  benefits?: string | null;
  facilities?: string | null;
  operationalHours?: string | null;
  preparation?: string | null;
  procedures?: string | null;
  faq?: string | null;
}) {
  try {
    return await (db as any).service.create({ data });
  } catch (err: any) {
    if (err.message && (err.message.includes("Unknown argument") || err.message.includes("gallery"))) {
      await (db as any).$executeRawUnsafe(
        `INSERT INTO Service (name, slug, description, iconName, isActive, roomImage, gallery, priceList, purpose, benefits, facilities, operationalHours, preparation, procedures, faq, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        data.name,
        data.slug,
        data.description,
        data.iconName,
        data.isActive ? 1 : 0,
        data.roomImage || null,
        data.gallery || null,
        data.priceList || null,
        data.purpose || null,
        data.benefits || null,
        data.facilities || null,
        data.operationalHours || null,
        data.preparation || null,
        data.procedures || null,
        data.faq || null
      );
      return findServiceBySlug(data.slug);
    }
    throw err;
  }
}

export async function updateService(
  id: number,
  data: {
    name?: string;
    slug?: string;
    description?: string;
    iconName?: string;
    isActive?: boolean;
    roomImage?: string | null;
    gallery?: string | null;
    priceList?: string | null;
    purpose?: string | null;
    benefits?: string | null;
    facilities?: string | null;
    operationalHours?: string | null;
    preparation?: string | null;
    procedures?: string | null;
    faq?: string | null;
  }
) {
  try {
    return await (db as any).service.update({ where: { id }, data });
  } catch (err: any) {
    if (err.message && (err.message.includes("Unknown argument") || err.message.includes("gallery"))) {
      const existing = await findServiceById(id);
      const name = data.name !== undefined ? data.name : existing.name;
      const slug = data.slug !== undefined ? data.slug : existing.slug;
      const description = data.description !== undefined ? data.description : existing.description;
      const iconName = data.iconName !== undefined ? data.iconName : existing.iconName;
      const isActive = data.isActive !== undefined ? (data.isActive ? 1 : 0) : (existing.isActive ? 1 : 0);
      const roomImage = data.roomImage !== undefined ? data.roomImage : existing.roomImage;
      const gallery = data.gallery !== undefined ? data.gallery : existing.gallery;
      const priceList = data.priceList !== undefined ? data.priceList : existing.priceList;
      const purpose = data.purpose !== undefined ? data.purpose : existing.purpose;
      const benefits = data.benefits !== undefined ? data.benefits : existing.benefits;
      const facilities = data.facilities !== undefined ? data.facilities : existing.facilities;
      const operationalHours = data.operationalHours !== undefined ? data.operationalHours : existing.operationalHours;
      const preparation = data.preparation !== undefined ? data.preparation : existing.preparation;
      const procedures = data.procedures !== undefined ? data.procedures : existing.procedures;
      const faq = data.faq !== undefined ? data.faq : existing.faq;

      await (db as any).$executeRawUnsafe(
        `UPDATE Service SET name = ?, slug = ?, description = ?, iconName = ?, isActive = ?, roomImage = ?, gallery = ?, priceList = ?, purpose = ?, benefits = ?, facilities = ?, operationalHours = ?, preparation = ?, procedures = ?, faq = ?, updatedAt = NOW() WHERE id = ?`,
        name,
        slug,
        description,
        iconName,
        isActive,
        roomImage,
        gallery,
        priceList,
        purpose,
        benefits,
        facilities,
        operationalHours,
        preparation,
        procedures,
        faq,
        id
      );
      return findServiceById(id);
    }
    throw err;
  }
}

export async function deleteService(id: number) {
  return (db as any).service.delete({ where: { id } });
}
