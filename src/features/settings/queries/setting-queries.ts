import 'server-only';
import { db } from '@/lib/db';
import { SETTING_KEYS } from '../constants/setting-keys';

/**
 * DATA ACCESS LAYER (READ) — Pengaturan Profil Klinik & Situs
 * Wajib `server-only` (Bab 6.1 HANDBOOK_CLEANCODE.md)
 */

export async function getSettingByKey(key: string): Promise<string | null> {
  const setting = await db.siteSetting.findUnique({ where: { key } });
  return setting?.value ?? null;
}

export async function getAllSettings() {
  return db.siteSetting.findMany({ orderBy: { key: 'asc' } });
}

export async function getAboutImageUrl(): Promise<string | null> {
  return getSettingByKey(SETTING_KEYS.ABOUT_IMAGE_URL);
}

export async function getAboutDescription(): Promise<string | null> {
  return getSettingByKey(SETTING_KEYS.ABOUT_DESCRIPTION);
}

export async function getClinicVision(): Promise<string | null> {
  return getSettingByKey(SETTING_KEYS.VISION);
}

export async function getClinicMission(): Promise<string | null> {
  return getSettingByKey(SETTING_KEYS.MISSION);
}
