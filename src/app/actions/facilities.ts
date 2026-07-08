'use server';

/**
 * LAYER 3 - ACTION (Controller)
 */

import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { z, parseForm } from '@/lib/validations';
import * as facilityService from '@/core/services/facilityService';

export type ActionResult = { success?: boolean; error?: string };

export async function saveFacilityAction(formData: FormData): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { error: 'Unauthorized. Sesi telah habis.' };

  const validation = parseForm(() => {
    const id = formData.get('id') as string | null;
    return {
      id: id ? z.number(id, 'ID Fasilitas') : null,
      name: z.maxLength(z.string(formData.get('name'), 'Nama Fasilitas'), 100, 'Nama Fasilitas'),
      description: z.maxLength(z.string(formData.get('description'), 'Deskripsi'), 500, 'Deskripsi'),
      imageFile: z.file(formData.get('image'), 'Gambar', !id),
      isActive: z.boolean(formData.get('isActive')),
    };
  });

  if (!validation.success) return { error: validation.error };

  const { id, name, description, imageFile, isActive } = validation.data;

  // Validasi file gambar jika ada
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
      await facilityService.updateFacility(id, { name, description, imageFile, isActive });
    } else {
      await facilityService.createFacility({ name, description, imageFile, isActive });
    }
    revalidatePath('/');
    revalidatePath('/admin/facilities');
    return { success: true };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Gagal menyimpan fasilitas.';
    return { error: msg };
  }
}

export async function deleteFacilityAction(id: number): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { error: 'Unauthorized.' };
  if (!id || isNaN(id) || id <= 0) return { error: 'ID tidak valid.' };

  try {
    await facilityService.deleteFacility(id);
    revalidatePath('/');
    revalidatePath('/admin/facilities');
    return { success: true };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Gagal menghapus fasilitas.';
    return { error: msg };
  }
}

export async function toggleFacilityStatusAction(
  id: number,
  currentStatus: boolean
): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { error: 'Unauthorized.' };
  if (!id || isNaN(id) || id <= 0) return { error: 'ID tidak valid.' };

  try {
    await facilityService.toggleFacilityStatus(id, currentStatus);
    revalidatePath('/');
    revalidatePath('/admin/facilities');
    return { success: true };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Gagal mengubah status.';
    return { error: msg };
  }
}
