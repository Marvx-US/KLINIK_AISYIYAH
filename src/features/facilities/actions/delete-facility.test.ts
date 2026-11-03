import { describe, it, expect, vi, beforeEach } from 'vitest';
import { revalidatePath } from 'next/cache';
import { deleteFacility } from './delete-facility';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { deleteFile } from '@/lib/upload';
import { USER_ROLE } from '@/lib/constants';

vi.mock('@/lib/auth', () => ({
  getSession: vi.fn(),
}));

vi.mock('@/lib/db', () => ({
  db: {
    facility: {
      findUnique: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

vi.mock('@/lib/upload', () => ({
  deleteFile: vi.fn().mockResolvedValue(true),
}));

describe('deleteFacility Server Action (Bab 4.3 Integration Testing)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('1. [RBAC] harus menolak jika belum login', async () => {
    vi.mocked(getSession).mockResolvedValueOnce(null);

    const result = await deleteFacility(1);

    expect(result.success).toBe(false);
    expect(result.message).toMatch(/akses ditolak/i);
    expect(db.facility.delete).not.toHaveBeenCalled();
  });

  it('2. [VALIDATION] harus menolak jika ID tidak valid', async () => {
    vi.mocked(getSession).mockResolvedValueOnce({
      id: '1',
      username: 'admin',
      name: 'Admin',
      role: USER_ROLE.ADMIN,
    });

    const result = await deleteFacility(-2);

    expect(result.success).toBe(false);
    expect(result.message).toMatch(/id fasilitas tidak valid/i);
  });

  it('3. [NOT FOUND] harus menolak jika fasilitas tidak ditemukan', async () => {
    vi.mocked(getSession).mockResolvedValueOnce({
      id: '1',
      username: 'admin',
      name: 'Admin',
      role: USER_ROLE.ADMIN,
    });
    vi.mocked(db.facility.findUnique).mockResolvedValueOnce(null);

    const result = await deleteFacility(99);

    expect(result.success).toBe(false);
    expect(result.message).toMatch(/fasilitas tidak ditemukan/i);
  });

  it('4. [HAPPY PATH] harus menghapus fasilitas dan gambarnya', async () => {
    vi.mocked(getSession).mockResolvedValueOnce({
      id: '1',
      username: 'admin',
      name: 'Admin',
      role: USER_ROLE.ADMIN,
    });
    vi.mocked(db.facility.findUnique).mockResolvedValueOnce({
      id: 1,
      name: 'Ruang Rawat Inap',
      description: 'Lengkap AC',
      imageUrl: '/uploads/facilities/room.png',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    vi.mocked(db.facility.delete).mockResolvedValueOnce({
      id: 1,
      name: 'Ruang Rawat Inap',
      description: 'Lengkap AC',
      imageUrl: '/uploads/facilities/room.png',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await deleteFacility(1);

    expect(result.success).toBe(true);
    expect(deleteFile).toHaveBeenCalledWith('/uploads/facilities/room.png');
    expect(db.facility.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(revalidatePath).toHaveBeenCalledWith('/admin/facilities');
  });
});
