'use server';

/**
 * LAYER 3 - ACTION (Controller)
 * Server Action untuk pengaturan situs — foto, deskripsi, visi & misi klinik.
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

/** Simpan/update deskripsi "Tentang Klinik" */
export async function updateClinicDescriptionAction(formData: FormData): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { error: 'Unauthorized. Sesi telah habis.' };

  const description = (formData.get('description') as string | null)?.trim();
  if (!description) return { error: 'Deskripsi tidak boleh kosong.' };
  if (description.length > 1000) return { error: 'Deskripsi terlalu panjang (maks. 1000 karakter).' };

  try {
    await siteSettingService.updateAboutDescription(description);
    revalidatePath('/');
    revalidatePath('/admin/clinic-profile');
    return { success: true };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Gagal menyimpan deskripsi.';
    return { error: msg };
  }
}

/** Simpan/update visi dan misi klinik */
export async function updateVisionMissionAction(formData: FormData): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { error: 'Unauthorized. Sesi telah habis.' };

  const vision = (formData.get('vision') as string | null)?.trim();
  const mission = (formData.get('mission') as string | null)?.trim();

  if (!vision) return { error: 'Visi tidak boleh kosong.' };
  if (!mission) return { error: 'Misi tidak boleh kosong.' };
  if (vision.length > 500) return { error: 'Visi terlalu panjang (maks. 500 karakter).' };
  if (mission.length > 2000) return { error: 'Misi terlalu panjang (maks. 2000 karakter).' };

  try {
    await siteSettingService.updateVisionMission(vision, mission);
    revalidatePath('/');
    revalidatePath('/admin/clinic-profile');
    return { success: true };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Gagal menyimpan visi & misi.';
    return { error: msg };
  }
}
