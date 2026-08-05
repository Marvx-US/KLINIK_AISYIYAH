/**
 * LAYER 1 - REPOSITORY
 * Hanya berisi operasi database mentah (CRUD) untuk Layanan.
 */

import { db } from '@/lib/db';

async function ensureServiceColumnsExist() {
  const columns = [
    { name: 'gallery', type: 'TEXT NULL' },
    { name: 'priceList', type: 'TEXT NULL' },
    { name: 'purpose', type: 'TEXT NULL' },
    { name: 'benefits', type: 'TEXT NULL' },
    { name: 'facilities', type: 'TEXT NULL' },
    { name: 'operationalHours', type: 'TEXT NULL' },
    { name: 'preparation', type: 'TEXT NULL' },
    { name: 'procedures', type: 'TEXT NULL' },
    { name: 'faq', type: 'TEXT NULL' },
  ];

  try {
    const existingColsRaw: any = await (db as any).$queryRawUnsafe(
      `SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'Service'`
    );
    const existingColNames = new Set(
      Array.isArray(existingColsRaw) ? existingColsRaw.map((r: any) => r.COLUMN_NAME || r.column_name) : []
    );

    for (const col of columns) {
      if (!existingColNames.has(col.name)) {
        await (db as any).$executeRawUnsafe(`ALTER TABLE Service ADD COLUMN ${col.name} ${col.type}`);
        console.log(`[REPOSITORY] Column "${col.name}" successfully added to Service table.`);
      }
    }
  } catch (e) {
    // ignore
  }
}

export async function findAllServices() {
  await ensureServiceColumnsExist().catch(() => {});
  try {
    const rawResult: any = await (db as any).$queryRawUnsafe(`SELECT * FROM Service ORDER BY id ASC`);
    if (Array.isArray(rawResult)) {
      return rawResult.map((s: any) => ({
        ...s,
        isActive: Boolean(s.isActive),
      }));
    }
  } catch (e) {
    // fallback
  }
  try {
    return await (db as any).service.findMany({ orderBy: { id: 'asc' } });
  } catch (error) {
    console.error('Database error in findAllServices:', error);
    return [];
  }
}

export async function findActiveServices() {
  await ensureServiceColumnsExist().catch(() => {});
  try {
    const rawResult: any = await (db as any).$queryRawUnsafe(`SELECT * FROM Service WHERE isActive = 1 ORDER BY id ASC`);
    if (Array.isArray(rawResult)) {
      return rawResult.map((s: any) => ({
        ...s,
        isActive: Boolean(s.isActive),
      }));
    }
  } catch (e) {
    // fallback
  }
  try {
    return await (db as any).service.findMany({
      where: { isActive: true },
      orderBy: { id: 'asc' },
    });
  } catch (error) {
    console.error('Database error in findActiveServices:', error);
    return [];
  }
}

export async function findServiceById(id: number) {
  await ensureServiceColumnsExist().catch(() => {});
  try {
    const rawResult: any = await (db as any).$queryRawUnsafe(`SELECT * FROM Service WHERE id = ? LIMIT 1`, id);
    if (Array.isArray(rawResult) && rawResult.length > 0) {
      const s = rawResult[0];
      return {
        ...s,
        isActive: Boolean(s.isActive),
      };
    }
  } catch (e) {
    // fallback
  }
  return (db as any).service.findUnique({ where: { id } });
}

export async function findServiceBySlug(slug: string) {
  await ensureServiceColumnsExist().catch(() => {});
  try {
    const rawResult: any = await (db as any).$queryRawUnsafe(`SELECT * FROM Service WHERE slug = ? LIMIT 1`, slug);
    if (Array.isArray(rawResult) && rawResult.length > 0) {
      const s = rawResult[0];
      return {
        ...s,
        isActive: Boolean(s.isActive),
      };
    }
  } catch (e) {
    // fallback
  }
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
  await ensureServiceColumnsExist().catch(() => {});

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
  await ensureServiceColumnsExist().catch(() => {});

  const existing = await findServiceById(id);
  if (!existing) throw new Error('Layanan tidak ditemukan.');

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

export async function deleteService(id: number) {
  return (db as any).service.delete({ where: { id } });
}
