import { describe, it, expect, vi, beforeEach } from 'vitest';
import { revalidatePath } from 'next/cache';
import { toggleFacility } from './toggle-facility';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { USER_ROLE } from '@/lib/constants';

vi.mock('@/lib/auth', () => ({
  getSession: vi.fn(),
}));

vi.mock('@/lib/db', () => ({
  db: {
    facility: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

describe('toggleFacility Server Action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('1. [RBAC] harus menolak jika bukan admin', async () => {
    vi.mocked(getSession).mockResolvedValueOnce(null);

    const result = await toggleFacility(1, true);

    expect(result.success).toBe(false);
    expect(result.message).toMatch(/akses ditolak/i);
    expect(db.facility.update).not.toHaveBeenCalled();
  });

  it('2. [VALIDATION] harus menolak jika ID tidak valid', async () => {
    vi.mocked(getSession).mockResolvedValueOnce({
      id: '1',
      username: 'admin',
      name: 'Admin',
      role: USER_ROLE.ADMIN,
    });

    const result = await toggleFacility(0, true);

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

    const result = await toggleFacility(404, true);

    expect(result.success).toBe(false);
    expect(result.message).toMatch(/fasilitas tidak ditemukan/i);
  });

  it('4. [HAPPY PATH] harus mengubah status fasilitas dan merevalidate cache', async () => {
    vi.mocked(getSession).mockResolvedValueOnce({
      id: '1',
      username: 'admin',
      name: 'Admin',
      role: USER_ROLE.ADMIN,
    });
    vi.mocked(db.facility.findUnique).mockResolvedValueOnce({
      id: 1,
      name: 'Ambulans',
      description: '24 Jam',
      imageUrl: '/ambulance.png',
      isActive: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    vi.mocked(db.facility.update).mockResolvedValueOnce({
      id: 1,
      name: 'Ambulans',
      description: '24 Jam',
      imageUrl: '/ambulance.png',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await toggleFacility(1, false);

    expect(result.success).toBe(true);
    expect(result.message).toMatch(/diaktifkan/i);
    expect(db.facility.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { isActive: true },
    });
    expect(revalidatePath).toHaveBeenCalledWith('/admin/facilities');
  });
});
