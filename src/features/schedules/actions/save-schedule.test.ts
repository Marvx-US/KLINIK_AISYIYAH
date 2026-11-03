import { describe, it, expect, vi, beforeEach } from 'vitest';
import { revalidatePath } from 'next/cache';
import { saveSchedule } from './save-schedule';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { USER_ROLE } from '@/lib/constants';

vi.mock('@/lib/auth', () => ({ getSession: vi.fn() }));
vi.mock('@/lib/db', () => ({
  db: {
    doctorSchedule: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
  },
}));

const adminSession = { id: 'admin-1', username: 'admin', name: 'Admin', role: USER_ROLE.ADMIN };

describe('saveSchedule Server Action (Bab 4.3 Integration Testing)', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('1. [RBAC] harus menolak jika sesi kosong atau bukan ADMIN', async () => {
    // Arrange
    vi.mocked(getSession).mockResolvedValueOnce(null);
    const formData = new FormData();
    formData.append('poli', 'Poli Umum');

    // Act
    const result = await saveSchedule(null, formData);

    // Assert
    expect(result.success).toBe(false);
    expect(result.message).toMatch(/akses ditolak/i);
    expect(db.doctorSchedule.create).not.toHaveBeenCalled();
  });

  it('2. [ZOD] harus mengembalikan fieldErrors jika nama dokter dan poli tidak diisi', async () => {
    // Arrange
    vi.mocked(getSession).mockResolvedValueOnce(adminSession);
    const formData = new FormData();
    formData.append('poli', '');
    formData.append('doctorName', '');
    formData.append('scheduleInfo', '');

    // Act
    const result = await saveSchedule(null, formData);

    // Assert
    expect(result.success).toBe(false);
    expect(result.fieldErrors).toBeDefined();
    expect(db.doctorSchedule.create).not.toHaveBeenCalled();
  });

  it('3. [ATURAN BISNIS] harus menolak update jika jadwal ID tidak ditemukan', async () => {
    // Arrange
    vi.mocked(getSession).mockResolvedValueOnce(adminSession);
    vi.mocked(db.doctorSchedule.findUnique).mockResolvedValueOnce(null);
    const formData = new FormData();
    formData.append('id', '999');
    formData.append('poli', 'Poli Umum');
    formData.append('doctorName', 'dr. Budi Santoso');
    formData.append('scheduleInfo', 'Senin - Jumat: 08:00 - 14:00');

    // Act
    const result = await saveSchedule(null, formData);

    // Assert
    expect(result.success).toBe(false);
    expect(result.message).toMatch(/tidak ditemukan/i);
    expect(db.doctorSchedule.update).not.toHaveBeenCalled();
  });

  it('4. [HAPPY PATH] harus berhasil membuat jadwal baru dan me-revalidate cache', async () => {
    // Arrange
    vi.mocked(getSession).mockResolvedValueOnce(adminSession);
    vi.mocked(db.doctorSchedule.create).mockResolvedValueOnce({
      id: 7, poli: 'Poli Anak', doctorName: 'dr. Sari Ayu, Sp.A',
      scheduleInfo: 'Senin, Rabu, Jumat: 09:00 - 13:00', isActive: true,
      createdAt: new Date(), updatedAt: new Date(),
    });

    const formData = new FormData();
    formData.append('poli', 'Poli Anak');
    formData.append('doctorName', 'dr. Sari Ayu, Sp.A');
    formData.append('scheduleInfo', 'Senin, Rabu, Jumat: 09:00 - 13:00');

    // Act
    const result = await saveSchedule(null, formData);

    // Assert
    expect(result.success).toBe(true);
    expect(result.data?.id).toBe(7);
    expect(db.doctorSchedule.create).toHaveBeenCalled();
    expect(revalidatePath).toHaveBeenCalledWith('/');
    expect(revalidatePath).toHaveBeenCalledWith('/admin/schedules');
  });
});
