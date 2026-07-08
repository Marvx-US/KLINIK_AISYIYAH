'use server';

/**
 * LAYER 3 - ACTION (Controller)
 */

import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { z, parseForm } from '@/lib/validations';
import * as partnerService from '@/core/services/partnerService';

export type ActionResult = { success?: boolean; error?: string };

export async function savePartnerAction(formData: FormData): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { error: 'Unauthorized. Sesi telah habis.' };

  const validation = parseForm(() => {
    const id = formData.get('id') as string | null;
    return {
      id: id ? z.number(id, 'ID Mitra') : null,
      name: z.maxLength(z.string(formData.get('name'), 'Nama Mitra'), 100, 'Nama Mitra'),
      imageFile: z.file(formData.get('image'), 'Logo Mitra', !id),
    };
  });

  if (!validation.success) return { error: validation.error };

  const { id, name, imageFile } = validation.data;

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
      await partnerService.updatePartner(id, { name, imageFile });
    } else {
      await partnerService.createPartner({ name, imageFile });
    }
    revalidatePath('/');
    revalidatePath('/admin/partners');
    return { success: true };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Gagal menyimpan mitra.';
    return { error: msg };
  }
}

export async function deletePartnerAction(id: number): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { error: 'Unauthorized.' };
  if (!id || isNaN(id) || id <= 0) return { error: 'ID tidak valid.' };

  try {
    await partnerService.deletePartner(id);
    revalidatePath('/');
    revalidatePath('/admin/partners');
    return { success: true };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Gagal menghapus mitra.';
    return { error: msg };
  }
}

export async function togglePartnerStatusAction(
  id: number,
  currentStatus: boolean
): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { error: 'Unauthorized.' };
  if (!id || isNaN(id) || id <= 0) return { error: 'ID tidak valid.' };

  try {
    await partnerService.togglePartnerStatus(id, currentStatus);
    revalidatePath('/');
    revalidatePath('/admin/partners');
    return { success: true };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Gagal mengubah status mitra.';
    return { error: msg };
  }
}
