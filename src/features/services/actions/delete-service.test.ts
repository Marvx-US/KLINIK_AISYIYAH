import { describe, it, expect, vi, beforeEach } from 'vitest';
import { revalidatePath } from 'next/cache';
import { deleteService } from './delete-service';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { cleanupServiceMedia } from '../utils/service-media';
import { USER_ROLE } from '@/lib/constants';

vi.mock('@/lib/auth', () => ({
  getSession: vi.fn(),
}));

vi.mock('@/lib/db', () => ({
  db: {
    service: {
      findUnique: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

vi.mock('../utils/service-media', () => ({
  cleanupServiceMedia: vi.fn().mockResolvedValue(undefined),
}));

describe('deleteService Server Action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('1. [RBAC] harus menolak jika belum login', async () => {
    vi.mocked(getSession).mockResolvedValueOnce(null);

    const result = await deleteService(1);

    expect(result.success).toBe(false);
    expect(result.message).toMatch(/akses ditolak/i);
    expect(db.service.delete).not.toHaveBeenCalled();
  });

  it('2. [VALIDATION] harus menolak jika ID tidak valid', async () => {
    vi.mocked(getSession).mockResolvedValueOnce({
      id: '1',
      username: 'admin',
      name: 'Admin',
      role: USER_ROLE.ADMIN,
    });

    const result = await deleteService(0);

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

    const result = await deleteService(99);

    expect(result.success).toBe(false);
    expect(result.message).toMatch(/layanan tidak ditemukan/i);
  });

  it('4. [HAPPY PATH] harus menghapus layanan, membersihkan file media, dan merevalidate cache', async () => {
    vi.mocked(getSession).mockResolvedValueOnce({
      id: '1',
      username: 'admin',
      name: 'Admin',
      role: USER_ROLE.ADMIN,
    });
    const mockService = {
      id: 1,
      name: 'Poli Gigi',
      slug: 'poli-gigi',
      description: 'Perawatan gigi',
      iconName: 'Activity',
      isActive: true,
      roomImage: '/room.png',
      bannerImage: '/banner.png',
      gallery: '[]',
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
    vi.mocked(db.service.delete).mockResolvedValueOnce(mockService);

    const result = await deleteService(1);

    expect(result.success).toBe(true);
    expect(cleanupServiceMedia).toHaveBeenCalledWith(mockService);
    expect(db.service.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(revalidatePath).toHaveBeenCalledWith('/services');
    expect(revalidatePath).toHaveBeenCalledWith('/admin/services');
  });
});
