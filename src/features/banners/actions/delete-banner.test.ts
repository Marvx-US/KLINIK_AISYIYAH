import { describe, it, expect, vi, beforeEach } from 'vitest';
import { revalidatePath } from 'next/cache';
import { deleteBanner } from './delete-banner';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { deleteFile } from '@/lib/upload';
import { USER_ROLE } from '@/lib/constants';

vi.mock('@/lib/auth', () => ({
  getSession: vi.fn(),
}));

vi.mock('@/lib/db', () => ({
  db: {
    banner: {
      findUnique: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

vi.mock('@/lib/upload', () => ({
  deleteFile: vi.fn().mockResolvedValue(true),
}));

describe('deleteBanner Server Action (Bab 4.3 Integration Testing)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('1. [RBAC] harus menolak jika sesi tidak ada atau bukan ADMIN', async () => {
    vi.mocked(getSession).mockResolvedValueOnce(null);

    const result = await deleteBanner(1);

    expect(result.success).toBe(false);
    expect(result.message).toMatch(/akses ditolak/i);
    expect(db.banner.delete).not.toHaveBeenCalled();
  });

  it('2. [VALIDATION] harus menolak jika ID tidak valid (<= 0 atau NaN)', async () => {
    vi.mocked(getSession).mockResolvedValueOnce({
      id: '1',
      username: 'admin',
      name: 'Admin',
      role: USER_ROLE.ADMIN,
    });

    const result = await deleteBanner(0);

    expect(result.success).toBe(false);
    expect(result.message).toMatch(/id banner tidak valid/i);
    expect(db.banner.delete).not.toHaveBeenCalled();
  });

  it('3. [NOT FOUND] harus menolak jika banner tidak ditemukan', async () => {
    vi.mocked(getSession).mockResolvedValueOnce({
      id: '1',
      username: 'admin',
      name: 'Admin',
      role: USER_ROLE.ADMIN,
    });
    vi.mocked(db.banner.findUnique).mockResolvedValueOnce(null);

    const result = await deleteBanner(999);

    expect(result.success).toBe(false);
    expect(result.message).toMatch(/banner tidak ditemukan/i);
    expect(db.banner.delete).not.toHaveBeenCalled();
  });

  it('4. [HAPPY PATH] harus menghapus banner beserta file gambarnya dan merevalidate cache', async () => {
    vi.mocked(getSession).mockResolvedValueOnce({
      id: '1',
      username: 'admin',
      name: 'Admin',
      role: USER_ROLE.ADMIN,
    });
    vi.mocked(db.banner.findUnique).mockResolvedValueOnce({
      id: 1,
      title: 'Banner Promosi',
      imageUrl: '/uploads/banners/promo.png',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    vi.mocked(db.banner.delete).mockResolvedValueOnce({
      id: 1,
      title: 'Banner Promosi',
      imageUrl: '/uploads/banners/promo.png',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await deleteBanner(1);

    expect(result.success).toBe(true);
    expect(deleteFile).toHaveBeenCalledWith('/uploads/banners/promo.png');
    expect(db.banner.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(revalidatePath).toHaveBeenCalledWith('/');
    expect(revalidatePath).toHaveBeenCalledWith('/admin/banners');
  });

  it('5. [ERROR HANDLING] harus menangani error database secara terukur', async () => {
    vi.mocked(getSession).mockResolvedValueOnce({
      id: '1',
      username: 'admin',
      name: 'Admin',
      role: USER_ROLE.ADMIN,
    });
    vi.mocked(db.banner.findUnique).mockResolvedValueOnce({
      id: 1,
      title: 'Banner',
      imageUrl: '/uploads/banners/promo.png',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    vi.mocked(db.banner.delete).mockRejectedValueOnce(new Error('Foreign key constraint'));

    const result = await deleteBanner(1);

    expect(result.success).toBe(false);
    expect(result.message).toMatch(/foreign key constraint/i);
  });
});
