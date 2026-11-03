import { describe, it, expect, vi, beforeEach } from 'vitest';
import { revalidatePath } from 'next/cache';
import { toggleBanner } from './toggle-banner';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { USER_ROLE } from '@/lib/constants';

vi.mock('@/lib/auth', () => ({
  getSession: vi.fn(),
}));

vi.mock('@/lib/db', () => ({
  db: {
    banner: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

describe('toggleBanner Server Action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('1. [RBAC] harus menolak jika bukan admin', async () => {
    vi.mocked(getSession).mockResolvedValueOnce(null);

    const result = await toggleBanner(1, true);

    expect(result.success).toBe(false);
    expect(result.message).toMatch(/akses ditolak/i);
    expect(db.banner.update).not.toHaveBeenCalled();
  });

  it('2. [VALIDATION] harus menolak jika ID tidak valid', async () => {
    vi.mocked(getSession).mockResolvedValueOnce({
      id: '1',
      username: 'admin',
      name: 'Admin',
      role: USER_ROLE.ADMIN,
    });

    const result = await toggleBanner(-5, true);

    expect(result.success).toBe(false);
    expect(result.message).toMatch(/id banner tidak valid/i);
    expect(db.banner.update).not.toHaveBeenCalled();
  });

  it('3. [NOT FOUND] harus menolak jika banner tidak ditemukan', async () => {
    vi.mocked(getSession).mockResolvedValueOnce({
      id: '1',
      username: 'admin',
      name: 'Admin',
      role: USER_ROLE.ADMIN,
    });
    vi.mocked(db.banner.findUnique).mockResolvedValueOnce(null);

    const result = await toggleBanner(404, true);

    expect(result.success).toBe(false);
    expect(result.message).toMatch(/banner tidak ditemukan/i);
    expect(db.banner.update).not.toHaveBeenCalled();
  });

  it('4. [HAPPY PATH] harus mengubah status banner dan merevalidate cache', async () => {
    vi.mocked(getSession).mockResolvedValueOnce({
      id: '1',
      username: 'admin',
      name: 'Admin',
      role: USER_ROLE.ADMIN,
    });
    vi.mocked(db.banner.findUnique).mockResolvedValueOnce({
      id: 1,
      title: 'Banner 1',
      imageUrl: '/img.png',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    vi.mocked(db.banner.update).mockResolvedValueOnce({
      id: 1,
      title: 'Banner 1',
      imageUrl: '/img.png',
      isActive: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await toggleBanner(1, true);

    expect(result.success).toBe(true);
    expect(result.message).toMatch(/dinonaktifkan/i);
    expect(db.banner.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { isActive: false },
    });
    expect(revalidatePath).toHaveBeenCalledWith('/');
    expect(revalidatePath).toHaveBeenCalledWith('/admin/banners');
  });
});
