import { describe, it, expect, vi, beforeEach } from 'vitest';
import { db } from '@/lib/db';
import { getAllPartners, getActivePartners, getPartnerById } from './partner-queries';

vi.mock('@/lib/db', () => ({
  db: {
    partner: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}));

describe('partner-queries DAL Integration Tests (Bab 2 Lapis 3)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getAllPartners harus membatasi safeLimit maksimal 50', async () => {
    vi.mocked(db.partner.findMany).mockResolvedValueOnce([]);

    await getAllPartners(150);

    expect(db.partner.findMany).toHaveBeenCalledWith({
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  });

  it('getActivePartners harus memfilter isActive: true', async () => {
    vi.mocked(db.partner.findMany).mockResolvedValueOnce([]);

    await getActivePartners(10);

    expect(db.partner.findMany).toHaveBeenCalledWith({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });
  });

  it('getPartnerById harus mengambil data mitra berdasarkan ID', async () => {
    vi.mocked(db.partner.findUnique).mockResolvedValueOnce(null);

    await getPartnerById(7);

    expect(db.partner.findUnique).toHaveBeenCalledWith({
      where: { id: 7 },
    });
  });
});
