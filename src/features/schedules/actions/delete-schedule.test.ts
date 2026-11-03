import { describe, it, expect, vi, beforeEach } from 'vitest';
import { revalidatePath } from 'next/cache';
import { deleteSchedule } from './delete-schedule';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { USER_ROLE } from '@/lib/constants';

vi.mock('@/lib/auth', () => ({
  getSession: vi.fn(),
}));

vi.mock('@/lib/db', () => ({
  db: {
    doctorSchedule: {
      findUnique: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

describe('deleteSchedule Server Action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('1. [RBAC] harus menolak jika belum login', async () => {
    vi.mocked(getSession).mockResolvedValueOnce(null);

    const result = await deleteSchedule(1);

    expect(result.success).toBe(false);
    expect(result.message).toMatch(/akses ditolak/i);
    expect(db.doctorSchedule.delete).not.toHaveBeenCalled();
  });

  it('2. [VALIDATION] harus menolak jika ID tidak valid', async () => {
    vi.mocked(getSession).mockResolvedValueOnce({
      id: '1',
      username: 'admin',
      name: 'Admin',
      role: USER_ROLE.ADMIN,
    });

    const result = await deleteSchedule(0);

    expect(result.success).toBe(false);
    expect(result.message).toMatch(/id jadwal tidak valid/i);
  });

  it('3. [NOT FOUND] harus menolak jika jadwal tidak ditemukan', async () => {
    vi.mocked(getSession).mockResolvedValueOnce({
      id: '1',
      username: 'admin',
      name: 'Admin',
      role: USER_ROLE.ADMIN,
    });
    vi.mocked(db.doctorSchedule.findUnique).mockResolvedValueOnce(null);

    const result = await deleteSchedule(99);

    expect(result.success).toBe(false);
    expect(result.message).toMatch(/jadwal dokter tidak ditemukan/i);
  });

  it('4. [HAPPY PATH] harus menghapus jadwal dan merevalidate cache', async () => {
    vi.mocked(getSession).mockResolvedValueOnce({
      id: '1',
      username: 'admin',
      name: 'Admin',
      role: USER_ROLE.ADMIN,
    });
    vi.mocked(db.doctorSchedule.findUnique).mockResolvedValueOnce({
      id: 1,
      poli: 'Poli Umum',
      doctorName: 'dr. Budi',
      scheduleInfo: 'Senin - Jumat 08:00 - 12:00',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    vi.mocked(db.doctorSchedule.delete).mockResolvedValueOnce({
      id: 1,
      poli: 'Poli Umum',
      doctorName: 'dr. Budi',
      scheduleInfo: 'Senin - Jumat 08:00 - 12:00',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await deleteSchedule(1);

    expect(result.success).toBe(true);
    expect(db.doctorSchedule.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(revalidatePath).toHaveBeenCalledWith('/');
    expect(revalidatePath).toHaveBeenCalledWith('/admin/schedules');
  });
});
