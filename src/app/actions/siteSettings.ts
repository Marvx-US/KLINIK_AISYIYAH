'use server';

/**
 * LAYER 3 - ACTION (Controller)
 * Server Action untuk pengaturan situs — foto "Tentang Klinik".
 */

import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import * as siteSettingService from '@/core/services/siteSettingService';

export type ActionResult = { success?: boolean; error?: string; imageUrl?: string };

/** Simpan/update foto Tentang Klinik */
export async function updateAboutImageAction(formData: FormData): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { error: 'Unauthorized. Sesi telah habis.' };

  const imageFile = formData.get('image') as File | null;

  if (!imageFile || imageFile.size === 0) {
    return { error: 'Silakan pilih gambar terlebih dahulu.' };
  }

  // Validasi tipe file
  if (!imageFile.type.startsWith('image/')) {
    return { error: 'File yang diunggah harus berupa gambar.' };
  }

  // Validasi ukuran file (5 MB)
  if (imageFile.size > 5 * 1024 * 1024) {
    return { error: 'Ukuran gambar tidak boleh melebihi 5 MB.' };
  }

  try {
    const imageUrl = await siteSettingService.updateAboutImage(imageFile);

    // Revalidate cache homepage dan halaman admin
    revalidatePath('/');
    revalidatePath('/admin/clinic-profile');

    return { success: true, imageUrl };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Gagal menyimpan foto.';
    return { error: msg };
  }
}
