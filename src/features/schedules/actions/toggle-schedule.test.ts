import { describe, it, expect, vi, beforeEach } from 'vitest';
import { revalidatePath } from 'next/cache';
import { toggleSchedule } from './toggle-schedule';
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
      update: vi.fn(),
    },
  },
}));

describe('toggleSchedule Server Action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('1. [RBAC] harus menolak jika belum login', async () => {
    vi.mocked(getSession).mockResolvedValueOnce(null);

    const result = await toggleSchedule(1, true);

    expect(result.success).toBe(false);
    expect(result.message).toMatch(/akses ditolak/i);
    expect(db.doctorSchedule.update).not.toHaveBeenCalled();
  });

  it('2. [VALIDATION] harus menolak jika ID tidak valid', async () => {
    vi.mocked(getSession).mockResolvedValueOnce({
      id: '1',
      username: 'admin',
      name: 'Admin',
      role: USER_ROLE.ADMIN,
    });

    const result = await toggleSchedule(-1, true);

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

    const result = await toggleSchedule(404, true);

    expect(result.success).toBe(false);
    expect(result.message).toMatch(/jadwal dokter tidak ditemukan/i);
  });

  it('4. [HAPPY PATH] harus mengubah status jadwal dokter dan merevalidate cache', async () => {
    vi.mocked(getSession).mockResolvedValueOnce({
      id: '1',
      username: 'admin',
      name: 'Admin',
      role: USER_ROLE.ADMIN,
    });
    vi.mocked(db.doctorSchedule.findUnique).mockResolvedValueOnce({
      id: 1,
      poli: 'Poli Gigi',
      doctorName: 'dr. Siti',
      scheduleInfo: '09:00 - 13:00',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    vi.mocked(db.doctorSchedule.update).mockResolvedValueOnce({
      id: 1,
      poli: 'Poli Gigi',
      doctorName: 'dr. Siti',
      scheduleInfo: '09:00 - 13:00',
      isActive: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await toggleSchedule(1, true);

    expect(result.success).toBe(true);
    expect(result.message).toMatch(/dinonaktifkan/i);
    expect(db.doctorSchedule.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { isActive: false },
    });
    expect(revalidatePath).toHaveBeenCalledWith('/admin/schedules');
  });
});
