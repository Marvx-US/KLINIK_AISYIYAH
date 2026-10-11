/**
 * LAYER 1 - REPOSITORY
 * Hanya berisi operasi database mentah (CRUD) untuk model SiteSetting.
 */

import { db } from '@/lib/db';
import { unstable_cache } from 'next/cache';

/** Ambil nilai setting berdasarkan key (dengan cache) */
export const findSettingByKey = unstable_cache(
  async (key: string) => {
    return (db as any).siteSetting.findUnique({ where: { key } });
  },
  ['site-setting'],
  { revalidate: 60, tags: ['site-settings'] }
);

/** Ambil semua settings (tanpa cache, untuk admin) */
export async function findAllSettings() {
  return (db as any).siteSetting.findMany({ orderBy: { key: 'asc' } });
}

/** Upsert (create or update) sebuah setting */
export async function upsertSetting(key: string, value: string) {
  return (db as any).siteSetting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
}
