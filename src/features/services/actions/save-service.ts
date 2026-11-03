'use server';

/**
 * SERVER ACTION (WRITE) — Simpan/Perbarui Layanan & Poliklinik
 * Mengikuti Template 5 Langkah Aman Bab 6.3 HANDBOOK_CLEANCODE.md
 */

import { revalidatePath} from 'next/cache';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { serviceSchema } from '../schemas/service-schema';
import { processServiceMedia } from '../utils/service-media';
import { type ActionResponse } from '@/types';
import { type Service } from '../types';
import { USER_ROLE } from '@/lib/constants';

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
]);

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function saveService(
  formData: FormData
): Promise<ActionResponse<{ service?: Service }> & { service?: Service }> {
  // 1. Cek Autentikasi & Hak Akses (RBAC)
  const session = await getSession();
  if (!session || session.role !== USER_ROLE.ADMIN) {
    return {
      success: false,
      message: 'Akses ditolak. Sesi Anda telah habis, silakan login kembali.',
      error: 'Akses ditolak. Sesi Anda telah habis, silakan login kembali.',
    };
  }

  // 2. Parse & Validasi Input dengan Zod
  const rawId = formData.get('id');
  const id = rawId ? Number(rawId) : null;
  const rawName = formData.get('name');
  const rawDescription = formData.get('description');
  const rawIconName = formData.get('iconName');
  const rawIsActive = formData.get('isActive') === 'true' || formData.get('isActive') === 'on';

  const validated = serviceSchema.safeParse({
    id,
    name: rawName,
    description: rawDescription,
    iconName: rawIconName,
    isActive: rawIsActive,
    purpose: formData.get('purpose') as string | null,
    benefits: formData.get('benefits') as string | null,
    facilities: formData.get('facilities') as string | null,
    operationalHours: formData.get('operationalHours') as string | null,
    preparation: formData.get('preparation') as string | null,
    procedures: formData.get('procedures') as string | null,
    faq: formData.get('faq') as string | null,
    priceList: formData.get('priceList') as string | null,
  });

  if (!validated.success) {
    const firstError = validated.error.issues[0]?.message ?? 'Validasi layanan gagal';
    return {
      success: false,
      message: firstError,
      error: firstError,
      fieldErrors: validated.error.flatten().fieldErrors,
    };
  }

  const imageFile = formData.get('roomImage') as File | null;
  const bannerImageFile = formData.get('bannerImage') as File | null;
  const removeRoomImage = formData.get('removeRoomImage') === 'true';
  const removeBannerImage = formData.get('removeBannerImage') === 'true';

  if (imageFile && imageFile.size > 0) {
    if (!ALLOWED_MIME_TYPES.has(imageFile.type)) {
      return {
        success: false,
        message: 'Format foto utama tidak didukung. Gunakan format JPG, PNG, atau WebP.',
        error: 'Format foto utama tidak didukung. Gunakan format JPG, PNG, atau WebP.',
      };
    }
    if (imageFile.size > 5 * 1024 * 1024) {
      return {
        success: false,
        message: 'Ukuran foto utama melebihi batas maksimum 5 MB.',
        error: 'Ukuran foto utama melebihi batas maksimum 5 MB.',
      };
    }
  }

  if (bannerImageFile && bannerImageFile.size > 0) {
    if (!ALLOWED_MIME_TYPES.has(bannerImageFile.type)) {
      return {
        success: false,
        message: 'Format foto banner tidak didukung. Gunakan format JPG, PNG, atau WebP.',
        error: 'Format foto banner tidak didukung. Gunakan format JPG, PNG, atau WebP.',
      };
    }
    if (bannerImageFile.size > 5 * 1024 * 1024) {
      return {
        success: false,
        message: 'Ukuran foto banner melebihi batas maksimum 5 MB.',
        error: 'Ukuran foto banner melebihi batas maksimum 5 MB.',
      };
    }
  }

  const rawGalleryFiles = formData.getAll('galleryFiles');
  const galleryFiles: File[] = [];
  for (const item of rawGalleryFiles) {
    if (item instanceof File && item.size > 0) {
      if (!ALLOWED_MIME_TYPES.has(item.type)) {
        return {
          success: false,
          message: `Format berkas "${item.name}" tidak didukung.`,
          error: `Format berkas "${item.name}" tidak didukung.`,
        };
      }
      if (item.size > 5 * 1024 * 1024) {
        return {
          success: false,
          message: `Ukuran berkas "${item.name}" melebihi batas maksimum 5 MB.`,
          error: `Ukuran berkas "${item.name}" melebihi batas maksimum 5 MB.`,
        };
      }
      galleryFiles.push(item);
    }
  }

  const rawExisting = formData.getAll('existingGallery');
  const existingGallery: string[] = rawExisting.map((item) => String(item)).filter(Boolean);

  // 3. Cek Aturan Bisnis & 4. Eksekusi Database
  try {
    let saved: Service;
    const {
      name,
      description,
      iconName,
      isActive,
      priceList,
      purpose,
      benefits,
      facilities,
      operationalHours,
      preparation,
      procedures,
      faq,
    } = validated.data;

    if (id) {
      const existing = await db.service.findUnique({ where: { id } });
      if (!existing) {
        return {
          success: false,
          message: 'Layanan tidak ditemukan untuk diperbarui.',
          error: 'Layanan tidak ditemukan untuk diperbarui.',
        };
      }

      const media = await processServiceMedia({
        imageFile,
        bannerImageFile,
        galleryFiles,
        existingGallery,
        currentRoomImage: existing.roomImage,
        currentBannerImage: existing.bannerImage,
        currentGallery: existing.gallery,
        removeRoomImage,
        removeBannerImage,
      });

      saved = await db.service.update({
        where: { id },
        data: {
          name,
          description,
          iconName,
          isActive,
          roomImage: media.roomImage,
          bannerImage: media.bannerImage,
          gallery: media.gallery,
          priceList: priceList || null,
          purpose: purpose || null,
          benefits: benefits || null,
          facilities: facilities || null,
          operationalHours: operationalHours || null,
          preparation: preparation || null,
          procedures: procedures || null,
          faq: faq || null,
        },
      });
    } else {
      const baseSlug = generateSlug(name);
      const existingSlug = await db.service.findUnique({ where: { slug: baseSlug } });
      const finalSlug = existingSlug ? `${baseSlug}-${Date.now().toString().slice(-4)}` : baseSlug;

      const media = await processServiceMedia({
        imageFile,
        bannerImageFile,
        galleryFiles,
        existingGallery,
      });

      saved = await db.service.create({
        data: {
          name,
          slug: finalSlug,
          description,
          iconName,
          isActive,
          roomImage: media.roomImage,
          bannerImage: media.bannerImage,
          gallery: media.gallery,
          priceList: priceList || null,
          purpose: purpose || null,
          benefits: benefits || null,
          facilities: facilities || null,
          operationalHours: operationalHours || null,
          preparation: preparation || null,
          procedures: procedures || null,
          faq: faq || null,
        },
      });
    }

    // 5. Revalidate Cache & Kembalikan Response Standar
    revalidatePath('/', 'layout');
    revalidatePath('/services', 'layout');
    revalidatePath('/services/[slug]', 'page');
    revalidatePath('/admin/services', 'layout');

    return {
      success: true,
      message: id ? 'Layanan medis berhasil diperbarui.' : 'Layanan medis baru berhasil dibuat.',
      data: { service: saved },
      service: saved,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal menyimpan layanan. Silakan coba lagi.';
    return { success: false, message, error: message };
  }
}
