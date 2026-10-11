/**
 * LAYER 2 - SERVICE
 * Business logic untuk pengaturan situs (SiteSetting).
 */

import { uploadFile } from '@/lib/upload';
import * as settingRepo from '@/core/repositories/siteSettingRepository';

// Konstanta untuk key-key yang digunakan
export const SETTING_KEYS = {
  ABOUT_IMAGE_URL: 'about_image_url',
} as const;

/** Ambil URL foto "Tentang Klinik" dari database (dengan cache) */
export async function getAboutImageUrl(): Promise<string | null> {
  const setting = await settingRepo.findSettingByKey(SETTING_KEYS.ABOUT_IMAGE_URL);
  return setting?.value ?? null;
}

/**
 * Simpan/update foto "Tentang Klinik" dengan upload file baru.
 * Jika tidak ada file baru, tidak ada perubahan.
 */
export async function updateAboutImage(imageFile: File | null): Promise<string> {
  if (!imageFile || imageFile.size === 0) {
    throw new Error('Tidak ada file gambar yang diunggah.');
  }

  const imageUrl = await uploadFile(imageFile);
  if (!imageUrl) throw new Error('Gagal mengunggah gambar.');

  await settingRepo.upsertSetting(SETTING_KEYS.ABOUT_IMAGE_URL, imageUrl);
  return imageUrl;
}
