'use server';

/**
 * LAYER 3 - ACTION (Controller) untuk Layanan
 * Mengatur alur validasi, eksekusi service layer, dan revalidasi path Next.js.
 */

import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { z, parseForm } from '@/lib/validations';
import * as serviceService from '@/core/services/serviceService';

export type ActionResult = { success?: boolean; error?: string; service?: any };

const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']);

export async function saveServiceAction(formData: FormData): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { error: 'Unauthorized. Sesi Anda telah habis, silakan login kembali.' };

  const validation = parseForm(() => {
    const id = formData.get('id') as string | null;
    return {
      id: id ? z.number(id, 'ID Layanan') : null,
      name: z.maxLength(z.string(formData.get('name'), 'Nama Layanan'), 100, 'Nama Layanan'),
      description: z.maxLength(z.string(formData.get('description'), 'Deskripsi'), 2000, 'Deskripsi'),
      iconName: z.maxLength(z.string(formData.get('iconName'), 'Nama Ikon'), 50, 'Nama Ikon'),
      isActive: z.boolean(formData.get('isActive')),
      imageFile: z.file(formData.get('roomImage'), 'Foto Utama Layanan', false),
      priceList: formData.get('priceList') as string | null,
      purpose: formData.get('purpose') as string | null,
      benefits: formData.get('benefits') as string | null,
      facilities: formData.get('facilities') as string | null,
      operationalHours: formData.get('operationalHours') as string | null,
      preparation: formData.get('preparation') as string | null,
      procedures: formData.get('procedures') as string | null,
      faq: formData.get('faq') as string | null,
    };
  });

  if (!validation.success) return { error: validation.error };

  const { id, name, description, iconName, isActive, imageFile, priceList, purpose, benefits, facilities, operationalHours, preparation, procedures, faq } = validation.data;
  const removeRoomImage = formData.get('removeRoomImage') === 'true';

  // --- Validasi File Foto Utama ---
  if (imageFile && imageFile.size > 0) {
    if (!ALLOWED_MIME_TYPES.has(imageFile.type)) {
      return { error: 'Format foto utama tidak didukung. Gunakan format JPG, PNG, atau WebP.' };
    }
    if (imageFile.size > 5 * 1024 * 1024) {
      return { error: 'Ukuran foto utama melebihi batas maksimum 5 MB.' };
    }
  }

  // --- Validasi File Galeri Foto ---
  const rawGalleryFiles = formData.getAll('galleryFiles');
  const galleryFiles: File[] = [];
  for (const item of rawGalleryFiles) {
    if (item instanceof File && item.size > 0) {
      if (!ALLOWED_MIME_TYPES.has(item.type)) {
        return { error: `Format file "${item.name}" tidak didukung. Gunakan format JPG, PNG, atau WebP.` };
      }
      if (item.size > 5 * 1024 * 1024) {
        return { error: `Ukuran foto "${item.name}" melebihi batas maksimum 5 MB.` };
      }
      galleryFiles.push(item);
    }
  }

  const rawExisting = formData.getAll('existingGallery');
  const existingGallery: string[] = rawExisting.map((item) => String(item)).filter(Boolean);

  try {
    let saved = null;
    if (id) {
      saved = await serviceService.updateService(id, { 
        name, 
        description, 
        iconName, 
        isActive, 
        imageFile, 
        removeRoomImage,
        galleryFiles, 
        existingGallery, 
        priceList,
        purpose,
        benefits,
        facilities,
        operationalHours,
        preparation,
        procedures,
        faq
      });
    } else {
      saved = await serviceService.createService({ 
        name, 
        description, 
        iconName, 
        isActive, 
        imageFile, 
        galleryFiles, 
        priceList,
        purpose,
        benefits,
        facilities,
        operationalHours,
        preparation,
        procedures,
        faq
      });
    }

    // Revalidasi seluruh path publik & admin secara serentak
    revalidatePath('/');
    revalidatePath('/services');
    revalidatePath('/services/[slug]', 'page');
    revalidatePath('/admin/services');

    return { success: true, service: saved };
  } catch (error: unknown) {
    console.error('[ACTION ERROR] saveServiceAction failed:', error);
    const msg = error instanceof Error ? error.message : 'Gagal menyimpan layanan. Silakan coba lagi.';
    return { error: msg };
  }
}

export async function deleteServiceAction(id: number): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { error: 'Unauthorized.' };
  if (!id || isNaN(id) || id <= 0) return { error: 'ID layanan tidak valid.' };

  try {
    await serviceService.deleteService(id);
    revalidatePath('/');
    revalidatePath('/services');
    revalidatePath('/services/[slug]', 'page');
    revalidatePath('/admin/services');
    return { success: true };
  } catch (error: unknown) {
    console.error('[ACTION ERROR] deleteServiceAction failed:', error);
    const msg = error instanceof Error ? error.message : 'Gagal menghapus layanan.';
    return { error: msg };
  }
}

export async function toggleServiceStatusAction(
  id: number,
  currentStatus: boolean
): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { error: 'Unauthorized.' };
  if (!id || isNaN(id) || id <= 0) return { error: 'ID layanan tidak valid.' };

  try {
    await serviceService.toggleServiceStatus(id, currentStatus);
    revalidatePath('/');
    revalidatePath('/services');
    revalidatePath('/services/[slug]', 'page');
    revalidatePath('/admin/services');
    return { success: true };
  } catch (error: unknown) {
    console.error('[ACTION ERROR] toggleServiceStatusAction failed:', error);
    const msg = error instanceof Error ? error.message : 'Gagal mengubah status layanan.';
    return { error: msg };
  }
}
