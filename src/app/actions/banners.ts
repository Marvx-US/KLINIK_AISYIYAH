'use server';

/**
 * LAYER 3 - ACTION (Controller)
 */

import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { z, parseForm } from '@/lib/validations';
import * as bannerService from '@/core/services/bannerService';

export type ActionResult = { success?: boolean; error?: string };

export async function saveBannerAction(
  prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { error: 'Unauthorized. Harap login kembali.' };

  const validation = parseForm(() => {
    const id = formData.get('id') as string | null;
    return {
      id: id ? z.number(id, 'ID Banner') : null,
      title: z.maxLength(z.string(formData.get('title'), 'Judul Banner'), 150, 'Judul Banner'),
      imageFile: z.file(formData.get('image'), 'Gambar Banner', !id),
      isActive: z.boolean(formData.get('isActive')),
    };
  });

  if (!validation.success) return { error: validation.error };

  const { id, title, imageFile, isActive } = validation.data;

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
      await bannerService.updateBanner(id, { title, imageFile, isActive });
    } else {
      await bannerService.createBanner({ title, imageFile, isActive });
    }
    revalidatePath('/');
    revalidatePath('/admin/banners');
    return { success: true };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Gagal menyimpan banner.';
    return { error: msg };
  }
}

export async function deleteBannerAction(id: number): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { error: 'Unauthorized.' };
  if (!id || isNaN(id) || id <= 0) return { error: 'ID tidak valid.' };

  try {
    await bannerService.deleteBanner(id);
    revalidatePath('/');
    revalidatePath('/admin/banners');
    return { success: true };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Gagal menghapus banner.';
    return { error: msg };
  }
}

export async function toggleBannerStatusAction(
  id: number,
  currentStatus: boolean
): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { error: 'Unauthorized.' };
  if (!id || isNaN(id) || id <= 0) return { error: 'ID tidak valid.' };

  try {
    await bannerService.toggleBannerStatus(id, currentStatus);
    revalidatePath('/');
    revalidatePath('/admin/banners');
    return { success: true };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Gagal mengubah status banner.';
    return { error: msg };
  }
}
