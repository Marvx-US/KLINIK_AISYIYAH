import { describe, it, expect, vi, beforeEach } from 'vitest';
import { revalidatePath } from 'next/cache';
import { togglePartner } from './toggle-partner';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { USER_ROLE } from '@/lib/constants';

vi.mock('@/lib/auth', () => ({
  getSession: vi.fn(),
}));

vi.mock('@/lib/db', () => ({
  db: {
    partner: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

describe('togglePartner Server Action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('1. [RBAC] harus menolak jika belum login', async () => {
    vi.mocked(getSession).mockResolvedValueOnce(null);

    const result = await togglePartner(1, true);

    expect(result.success).toBe(false);
    expect(result.message).toMatch(/akses ditolak/i);
    expect(db.partner.update).not.toHaveBeenCalled();
  });

  it('2. [VALIDATION] harus menolak jika ID tidak valid', async () => {
    vi.mocked(getSession).mockResolvedValueOnce({
      id: '1',
      username: 'admin',
      name: 'Admin',
      role: USER_ROLE.ADMIN,
    });

    const result = await togglePartner(-1, true);

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

    const result = await togglePartner(404, true);

    expect(result.success).toBe(false);
    expect(result.message).toMatch(/mitra tidak ditemukan/i);
  });

  it('4. [HAPPY PATH] harus mengubah status mitra dan merevalidate cache', async () => {
    vi.mocked(getSession).mockResolvedValueOnce({
      id: '1',
      username: 'admin',
      name: 'Admin',
      role: USER_ROLE.ADMIN,
    });
    vi.mocked(db.partner.findUnique).mockResolvedValueOnce({
      id: 1,
      name: 'Kimia Farma',
      logoUrl: '/kimia.png',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    vi.mocked(db.partner.update).mockResolvedValueOnce({
      id: 1,
      name: 'Kimia Farma',
      logoUrl: '/kimia.png',
      isActive: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await togglePartner(1, true);

    expect(result.success).toBe(true);
    expect(result.message).toMatch(/dinonaktifkan/i);
    expect(db.partner.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { isActive: false },
    });
    expect(revalidatePath).toHaveBeenCalledWith('/admin/partners');
  });
});
