import { describe, it, expect, vi, beforeEach } from 'vitest';
import { db } from '@/lib/db';
import {
  getAllServices,
  getActiveServices,
  getServiceById,
  getServiceBySlug,
} from './service-queries';

vi.mock('@/lib/db', () => ({
  db: {
    service: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}));

describe('service-queries DAL Integration Tests (Bab 2 Lapis 3)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getAllServices harus membatasi safeLimit maksimal 50 dan mengurutkan berdasarkan id asc', async () => {
    vi.mocked(db.service.findMany).mockResolvedValueOnce([]);

    await getAllServices(100);

    expect(db.service.findMany).toHaveBeenCalledWith({
      orderBy: { id: 'asc' },
      take: 50,
    });
  });

  it('getActiveServices harus memfilter hanya layanan aktif (isActive: true)', async () => {
    vi.mocked(db.service.findMany).mockResolvedValueOnce([]);

    await getActiveServices(20);

    expect(db.service.findMany).toHaveBeenCalledWith({
      where: { isActive: true },
      orderBy: { id: 'asc' },
      take: 20,
    });
  });

  it('getServiceById harus mencari layanan berdasarkan ID unik', async () => {
    vi.mocked(db.service.findUnique).mockResolvedValueOnce(null);

    await getServiceById(4);

    expect(db.service.findUnique).toHaveBeenCalledWith({
      where: { id: 4 },
    });
  });

  it('getServiceBySlug harus mencari layanan berdasarkan slug unik', async () => {
    vi.mocked(db.service.findUnique).mockResolvedValueOnce(null);

    await getServiceBySlug('poli-umum');

    expect(db.service.findUnique).toHaveBeenCalledWith({
      where: { slug: 'poli-umum' },
    });
  });
});
