'use server';

/**
 * LAYER 3 - ACTION (Controller) untuk Layanan
 */

import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { z, parseForm } from '@/lib/validations';
import * as serviceService from '@/core/services/serviceService';

export type ActionResult = { success?: boolean; error?: string };

export async function saveServiceAction(formData: FormData): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { error: 'Unauthorized. Sesi telah habis.' };

  const validation = parseForm(() => {
    const id = formData.get('id') as string | null;
    return {
      id: id ? z.number(id, 'ID Layanan') : null,
      name: z.maxLength(z.string(formData.get('name'), 'Nama Layanan'), 100, 'Nama Layanan'),
      description: z.maxLength(z.string(formData.get('description'), 'Deskripsi'), 1000, 'Deskripsi'),
      iconName: z.maxLength(z.string(formData.get('iconName'), 'Nama Ikon'), 50, 'Nama Ikon'),
      isActive: z.boolean(formData.get('isActive')),
      imageFile: z.file(formData.get('roomImage'), 'Gambar Ruangan', false),
      priceList: formData.get('priceList') as string | null,
    };
  });

  if (!validation.success) return { error: validation.error };

  const { id, name, description, iconName, isActive, imageFile, priceList } = validation.data;

  // Extract gallery files and existing gallery array
  const rawGalleryFiles = formData.getAll('galleryFiles');
  const galleryFiles: File[] = [];
  for (const item of rawGalleryFiles) {
    if (item instanceof File && item.size > 0) {
      if (!item.type.startsWith('image/')) {
        return { error: 'File galeri yang diunggah harus berupa gambar.' };
      }
      if (item.size > 5 * 1024 * 1024) {
        return { error: 'Ukuran foto galeri tidak boleh melebihi 5 MB.' };
      }
      galleryFiles.push(item);
    }
  }

  const rawExisting = formData.getAll('existingGallery');
  const existingGallery: string[] = rawExisting.map((item) => String(item)).filter(Boolean);

  // Validasi file gambar utama jika ada
  if (imageFile) {
    if (!imageFile.type.startsWith('image/')) {
      return { error: 'File yang diunggah harus berupa gambar.' };
    }
    if (imageFile.size > 5 * 1024 * 1024) {
      return { error: 'Ukuran gambar tidak boleh melebihi 5 MB.' };
    }
  }

  try {
    if (id) {
      await serviceService.updateService(id, { 
        name, description, iconName, isActive, imageFile, galleryFiles, existingGallery, priceList 
      });
    } else {
      await serviceService.createService({ 
        name, description, iconName, isActive, imageFile, galleryFiles, priceList 
      });
    }
    revalidatePath('/');
    revalidatePath('/services');
    revalidatePath('/admin/services');
    return { success: true };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Gagal menyimpan layanan.';
    return { error: msg };
  }
}

export async function deleteServiceAction(id: number): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { error: 'Unauthorized.' };
  if (!id || isNaN(id) || id <= 0) return { error: 'ID tidak valid.' };

  try {
    await serviceService.deleteService(id);
    revalidatePath('/');
    revalidatePath('/services');
    revalidatePath('/admin/services');
    return { success: true };
  } catch (error: unknown) {
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
  if (!id || isNaN(id) || id <= 0) return { error: 'ID tidak valid.' };

  try {
    await serviceService.toggleServiceStatus(id, currentStatus);
    revalidatePath('/');
    revalidatePath('/services');
    revalidatePath('/admin/services');
    return { success: true };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Gagal mengubah status.';
    return { error: msg };
  }
}
