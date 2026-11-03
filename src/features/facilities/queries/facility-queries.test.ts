import { describe, it, expect, vi, beforeEach } from 'vitest';
import { db } from '@/lib/db';
import { getAllFacilities, getActiveFacilities, getFacilityById } from './facility-queries';

vi.mock('@/lib/db', () => ({
  db: {
    facility: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}));

describe('facility-queries DAL Integration Tests (Bab 2 Lapis 3)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getAllFacilities harus membatasi safeLimit maksimal 50', async () => {
    vi.mocked(db.facility.findMany).mockResolvedValueOnce([]);

    await getAllFacilities(999);

    expect(db.facility.findMany).toHaveBeenCalledWith({
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  });

  it('getActiveFacilities harus memfilter isActive: true', async () => {
    vi.mocked(db.facility.findMany).mockResolvedValueOnce([]);

    await getActiveFacilities(25);

    expect(db.facility.findMany).toHaveBeenCalledWith({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
      take: 25,
    });
  });

  it('getFacilityById harus mencari berdasarkan ID', async () => {
    vi.mocked(db.facility.findUnique).mockResolvedValueOnce(null);

    await getFacilityById(3);

    expect(db.facility.findUnique).toHaveBeenCalledWith({
      where: { id: 3 },
    });
  });
});
