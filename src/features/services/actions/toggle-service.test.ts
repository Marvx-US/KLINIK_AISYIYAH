import { describe, it, expect, vi, beforeEach } from 'vitest';
import { revalidatePath } from 'next/cache';
import { toggleService } from './toggle-service';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { USER_ROLE } from '@/lib/constants';

vi.mock('@/lib/auth', () => ({
  getSession: vi.fn(),
}));

vi.mock('@/lib/db', () => ({
  db: {
    service: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

describe('toggleService Server Action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('1. [RBAC] harus menolak jika belum login', async () => {
    vi.mocked(getSession).mockResolvedValueOnce(null);

    const result = await toggleService(1, true);

    expect(result.success).toBe(false);
    expect(result.message).toMatch(/akses ditolak/i);
    expect(db.service.update).not.toHaveBeenCalled();
  });

  it('2. [VALIDATION] harus menolak jika ID tidak valid', async () => {
    vi.mocked(getSession).mockResolvedValueOnce({
      id: '1',
      username: 'admin',
      name: 'Admin',
      role: USER_ROLE.ADMIN,
    });

    const result = await toggleService(0, true);

    expect(result.success).toBe(false);
    expect(result.message).toMatch(/id layanan tidak valid/i);
  });

  it('3. [NOT FOUND] harus menolak jika layanan tidak ditemukan', async () => {
    vi.mocked(getSession).mockResolvedValueOnce({
      id: '1',
      username: 'admin',
      name: 'Admin',
      role: USER_ROLE.ADMIN,
    });
    vi.mocked(db.service.findUnique).mockResolvedValueOnce(null);

    const result = await toggleService(404, true);

    expect(result.success).toBe(false);
    expect(result.message).toMatch(/layanan tidak ditemukan/i);
  });

  it('4. [HAPPY PATH] harus mengubah status layanan dan merevalidate cache', async () => {
    vi.mocked(getSession).mockResolvedValueOnce({
      id: '1',
      username: 'admin',
      name: 'Admin',
      role: USER_ROLE.ADMIN,
    });
    const mockService = {
      id: 1,
      name: 'Poli Umum',
      slug: 'poli-umum',
      description: 'Umum',
      iconName: 'Activity',
      isActive: false,
      roomImage: null,
      bannerImage: null,
      gallery: null,
      priceList: null,
      purpose: null,
      benefits: null,
      facilities: null,
      operationalHours: null,
      preparation: null,
      procedures: null,
      faq: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    vi.mocked(db.service.findUnique).mockResolvedValueOnce(mockService);
    vi.mocked(db.service.update).mockResolvedValueOnce({
      ...mockService,
      isActive: true,
    });

    const result = await toggleService(1, false);

    expect(result.success).toBe(true);
    expect(result.message).toMatch(/diaktifkan/i);
    expect(db.service.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { isActive: true },
    });
    expect(revalidatePath).toHaveBeenCalledWith('/services');
    expect(revalidatePath).toHaveBeenCalledWith('/admin/services');
  });
});
