import { describe, it, expect, vi, beforeEach } from 'vitest';
import { db } from '@/lib/db';
import {
  getSettingByKey,
  getAllSettings,
  getAboutImageUrl,
  getAboutDescription,
  getClinicVision,
  getClinicMission,
} from './setting-queries';
import { SETTING_KEYS } from '../constants/setting-keys';

vi.mock('@/lib/db', () => ({
  db: {
    siteSetting: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
    },
  },
}));

describe('setting-queries DAL Integration Tests (Bab 2 Lapis 3)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getSettingByKey harus mengembalikan string value atau null jika tidak ada', async () => {
    vi.mocked(db.siteSetting.findUnique).mockResolvedValueOnce({
      id: 1,
      key: 'test_key',
      value: 'sample value',
      updatedAt: new Date(),
    });

    const val = await getSettingByKey('test_key');
    expect(val).toBe('sample value');

    vi.mocked(db.siteSetting.findUnique).mockResolvedValueOnce(null);
    const nullVal = await getSettingByKey('unknown_key');
    expect(nullVal).toBeNull();
  });

  it('getAllSettings harus mengurutkan berdasarkan key asc', async () => {
    vi.mocked(db.siteSetting.findMany).mockResolvedValueOnce([]);

    await getAllSettings();

    expect(db.siteSetting.findMany).toHaveBeenCalledWith({
      orderBy: { key: 'asc' },
    });
  });

  it('helper getters harus memanggil key yang benar', async () => {
    vi.mocked(db.siteSetting.findUnique).mockResolvedValue({
      id: 1,
      key: 'any',
      value: 'value',
      updatedAt: new Date(),
    });

    await getAboutImageUrl();
    expect(db.siteSetting.findUnique).toHaveBeenCalledWith({
      where: { key: SETTING_KEYS.ABOUT_IMAGE_URL },
    });

    await getAboutDescription();
    expect(db.siteSetting.findUnique).toHaveBeenCalledWith({
      where: { key: SETTING_KEYS.ABOUT_DESCRIPTION },
    });

    await getClinicVision();
    expect(db.siteSetting.findUnique).toHaveBeenCalledWith({
      where: { key: SETTING_KEYS.VISION },
    });

    await getClinicMission();
    expect(db.siteSetting.findUnique).toHaveBeenCalledWith({
      where: { key: SETTING_KEYS.MISSION },
    });
  });
});
