/**
 * LAYER 2 - SERVICE
 * Business logic untuk pengaturan situs (SiteSetting).
 */

import { uploadFile } from '@/lib/upload';
import * as settingRepo from '@/core/repositories/siteSettingRepository';

// Konstanta untuk key-key yang digunakan
export const SETTING_KEYS = {
  ABOUT_IMAGE_URL: 'about_image_url',
  ABOUT_DESCRIPTION: 'about_description',
  VISION: 'clinic_vision',
  MISSION: 'clinic_mission',
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

/** Ambil deskripsi "Tentang Klinik" dari database */
export async function getAboutDescription(): Promise<string | null> {
  const setting = await settingRepo.findSettingByKey(SETTING_KEYS.ABOUT_DESCRIPTION);
  return setting?.value ?? null;
}

/** Simpan deskripsi "Tentang Klinik" */
export async function updateAboutDescription(description: string): Promise<void> {
  await settingRepo.upsertSetting(SETTING_KEYS.ABOUT_DESCRIPTION, description);
}

/** Ambil visi klinik dari database */
export async function getClinicVision(): Promise<string | null> {
  const setting = await settingRepo.findSettingByKey(SETTING_KEYS.VISION);
  return setting?.value ?? null;
}

/** Ambil misi klinik dari database */
export async function getClinicMission(): Promise<string | null> {
  const setting = await settingRepo.findSettingByKey(SETTING_KEYS.MISSION);
  return setting?.value ?? null;
}

/** Simpan visi & misi klinik */
export async function updateVisionMission(vision: string, mission: string): Promise<void> {
  await Promise.all([
    settingRepo.upsertSetting(SETTING_KEYS.VISION, vision),
    settingRepo.upsertSetting(SETTING_KEYS.MISSION, mission),
  ]);
}
