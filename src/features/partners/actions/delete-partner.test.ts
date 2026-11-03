import { describe, it, expect, vi, beforeEach } from 'vitest';
import { revalidatePath } from 'next/cache';
import { deletePartner } from './delete-partner';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { deleteFile } from '@/lib/upload';
import { USER_ROLE } from '@/lib/constants';

vi.mock('@/lib/auth', () => ({
  getSession: vi.fn(),
}));

vi.mock('@/lib/db', () => ({
  db: {
    partner: {
      findUnique: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

vi.mock('@/lib/upload', () => ({
  deleteFile: vi.fn().mockResolvedValue(true),
}));

describe('deletePartner Server Action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('1. [RBAC] harus menolak jika belum login', async () => {
    vi.mocked(getSession).mockResolvedValueOnce(null);

    const result = await deletePartner(1);

    expect(result.success).toBe(false);
    expect(result.message).toMatch(/akses ditolak/i);
    expect(db.partner.delete).not.toHaveBeenCalled();
  });

  it('2. [VALIDATION] harus menolak jika ID tidak valid', async () => {
    vi.mocked(getSession).mockResolvedValueOnce({
      id: '1',
      username: 'admin',
      name: 'Admin',
      role: USER_ROLE.ADMIN,
    });

    const result = await deletePartner(0);

    expect(result.success).toBe(false);
    expect(result.message).toMatch(/id mitra tidak valid/i);
  });

  it('3. [NOT FOUND] harus menolak jika mitra tidak ditemukan', async () => {
    vi.mocked(getSession).mockResolvedValueOnce({
      id: '1',
      username: 'admin',
      name: 'Admin',
      role: USER_ROLE.ADMIN,
    });
    vi.mocked(db.partner.findUnique).mockResolvedValueOnce(null);

    const result = await deletePartner(99);

    expect(result.success).toBe(false);
    expect(result.message).toMatch(/mitra tidak ditemukan/i);
  });

  it('4. [HAPPY PATH] harus menghapus mitra dan file logo', async () => {
    vi.mocked(getSession).mockResolvedValueOnce({
      id: '1',
      username: 'admin',
      name: 'Admin',
      role: USER_ROLE.ADMIN,
    });
    vi.mocked(db.partner.findUnique).mockResolvedValueOnce({
      id: 1,
      name: 'BPJS Kesehatan',
      logoUrl: '/uploads/partners/bpjs.png',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    vi.mocked(db.partner.delete).mockResolvedValueOnce({
      id: 1,
      name: 'BPJS Kesehatan',
      logoUrl: '/uploads/partners/bpjs.png',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await deletePartner(1);

    expect(result.success).toBe(true);
    expect(deleteFile).toHaveBeenCalledWith('/uploads/partners/bpjs.png');
    expect(db.partner.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(revalidatePath).toHaveBeenCalledWith('/admin/partners');
  });
});
