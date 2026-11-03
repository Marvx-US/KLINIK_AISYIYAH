'use server';

/**
 * SERVER ACTION (WRITE) — Pengaturan Profil & Informasi Situs
 * Mengikuti Template 5 Langkah Aman Bab 6.3 HANDBOOK_CLEANCODE.md
 */

import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/auth';
import { USER_ROLE } from '@/lib/constants';
import { uploadFile } from '@/lib/upload';
import { db } from '@/lib/db';
import { SETTING_KEYS } from '../constants/setting-keys';
import { ClinicDescriptionSchema, VisionMissionSchema } from '../schemas/setting-schema';
import { ActionResponse } from '@/types';

async function verifyAdmin(): Promise<ActionResponse | null> {
  const session = await getSession();
  if (!session || session.role !== USER_ROLE.ADMIN) {
    return {
      success: false,
      message: 'Akses ditolak. Sesi Anda telah habis atau akun tidak berwenang.',
      error: 'Akses ditolak. Sesi Anda telah habis atau akun tidak berwenang.',
    };
  }
  return null;
}

/** Update Foto Tentang Klinik */
export async function updateAboutImage(
  formData: FormData
): Promise<ActionResponse<{ imageUrl: string }>> {
  const authError = await verifyAdmin();
  if (authError) return authError as ActionResponse<{ imageUrl: string }>;

  const imageFile = formData.get('image') as File | null;
  if (!imageFile || imageFile.size === 0) {
    return {
      success: false,
      message: 'Silakan pilih berkas gambar terlebih dahulu.',
      error: 'Silakan pilih berkas gambar terlebih dahulu.',
    };
  }

  if (!imageFile.type.startsWith('image/')) {
    return {
      success: false,
      message: 'Berkas yang diunggah harus berupa gambar.',
      error: 'Berkas yang diunggah harus berupa gambar.',
    };
  }

  if (imageFile.size > 5 * 1024 * 1024) {
    return {
      success: false,
      message: 'Ukuran gambar tidak boleh melebihi 5 MB.',
      error: 'Ukuran gambar tidak boleh melebihi 5 MB.',
    };
  }

  try {
    const imageUrl = await uploadFile(imageFile);
    if (!imageUrl) {
      return {
        success: false,
        message: 'Gagal mengunggah foto ke server.',
        error: 'Gagal mengunggah foto ke server.',
      };
    }

    await db.siteSetting.upsert({
      where: { key: SETTING_KEYS.ABOUT_IMAGE_URL },
      update: { value: imageUrl },
      create: { key: SETTING_KEYS.ABOUT_IMAGE_URL, value: imageUrl },
    });

    revalidatePath('/');
    revalidatePath('/admin/clinic-profile');

    return {
      success: true,
      message: 'Foto profil klinik berhasil diperbarui.',
      data: { imageUrl },
    };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Gagal menyimpan foto klinik.';
    return { success: false, message: msg, error: msg };
  }
}

/** Update Deskripsi Tentang Klinik */
export async function updateClinicDescription(
  formData: FormData
): Promise<ActionResponse> {
  const authError = await verifyAdmin();
  if (authError) return authError;

  const rawDescription = formData.get('description');
  const parsed = ClinicDescriptionSchema.safeParse({ description: rawDescription });

  if (!parsed.success) {
    const errorMsg = parsed.error.issues[0]?.message || 'Deskripsi tidak valid.';
    return {
      success: false,
      message: errorMsg,
      error: errorMsg,
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await db.siteSetting.upsert({
      where: { key: SETTING_KEYS.ABOUT_DESCRIPTION },
      update: { value: parsed.data.description },
      create: { key: SETTING_KEYS.ABOUT_DESCRIPTION, value: parsed.data.description },
    });

    revalidatePath('/');
    revalidatePath('/admin/clinic-profile');

    return {
      success: true,
      message: 'Deskripsi profil klinik berhasil disimpan.',
    };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Gagal menyimpan deskripsi klinik.';
    return { success: false, message: msg, error: msg };
  }
}

/** Update Visi & Misi Klinik */
export async function updateVisionMission(
  formData: FormData
): Promise<ActionResponse> {
  const authError = await verifyAdmin();
  if (authError) return authError;

  const rawVision = formData.get('vision');
  const rawMission = formData.get('mission');
  const parsed = VisionMissionSchema.safeParse({ vision: rawVision, mission: rawMission });

  if (!parsed.success) {
    const errorMsg = parsed.error.issues[0]?.message || 'Visi & Misi tidak valid.';
    return {
      success: false,
      message: errorMsg,
      error: errorMsg,
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await db.$transaction([
      db.siteSetting.upsert({
        where: { key: SETTING_KEYS.VISION },
        update: { value: parsed.data.vision },
        create: { key: SETTING_KEYS.VISION, value: parsed.data.vision },
      }),
      db.siteSetting.upsert({
        where: { key: SETTING_KEYS.MISSION },
        update: { value: parsed.data.mission },
        create: { key: SETTING_KEYS.MISSION, value: parsed.data.mission },
      }),
    ]);

    revalidatePath('/');
    revalidatePath('/admin/clinic-profile');

    return {
      success: true,
      message: 'Visi dan misi klinik berhasil disimpan.',
    };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Gagal menyimpan visi dan misi.';
    return { success: false, message: msg, error: msg };
  }
}
