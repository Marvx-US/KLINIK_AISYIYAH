import { describe, it, expect, vi, beforeEach } from 'vitest';
import { db } from '@/lib/db';
import { getAllBanners, getActiveBanners, getBannerById } from './banner-queries';

vi.mock('@/lib/db', () => ({
  db: {
    banner: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}));

describe('banner-queries DAL Integration Tests (Bab 2 Lapis 3)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAllBanners', () => {
    it('harus membatasi batas paginasi ke batas aman (safeLimit) maksimal 50', async () => {
      vi.mocked(db.banner.findMany).mockResolvedValueOnce([]);

      await getAllBanners(100);

      expect(db.banner.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 50,
          orderBy: { createdAt: 'desc' },
        })
      );
    });

    it('harus memastikan batas minimum take adalah 1 jika input <= 0', async () => {
      vi.mocked(db.banner.findMany).mockResolvedValueOnce([]);

      await getAllBanners(-5);

      expect(db.banner.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 1,
        })
      );
    });
  });

  describe('getActiveBanners', () => {
    it('harus memfilter hanya banner aktif (isActive: true)', async () => {
      vi.mocked(db.banner.findMany).mockResolvedValueOnce([]);

      await getActiveBanners(10);

      expect(db.banner.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { isActive: true },
          take: 10,
          orderBy: { createdAt: 'desc' },
        })
      );
    });
  });

  describe('getBannerById', () => {
    it('harus mengambil banner unik berdasarkan ID', async () => {
      const mockBanner = {
        id: 1,
        title: 'Promo Spesial',
        imageUrl: '/img.jpg',
        linkUrl: null,
        isActive: true,
        order: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      vi.mocked(db.banner.findUnique).mockResolvedValueOnce(mockBanner);

      const result = await getBannerById(1);

      expect(result).toEqual(mockBanner);
      expect(db.banner.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });
});
