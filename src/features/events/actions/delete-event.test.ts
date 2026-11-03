import { describe, it, expect, vi, beforeEach } from 'vitest';
import { revalidatePath } from 'next/cache';
import { deleteEvent } from './delete-event';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { getEventById } from '../queries/event-queries';
import { deleteFile } from '@/lib/upload';
import { USER_ROLE } from '@/lib/constants';

vi.mock('@/lib/auth', () => ({
  getSession: vi.fn(),
}));

vi.mock('../queries/event-queries', () => ({
  getEventById: vi.fn(),
}));

vi.mock('@/lib/db', () => ({
  db: {
    event: {
      delete: vi.fn(),
    },
  },
}));

vi.mock('@/lib/upload', () => ({
  deleteFile: vi.fn().mockResolvedValue(true),
}));

describe('deleteEvent Server Action (Bab 4.3 Integration Testing)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('1. [RBAC] harus menolak jika belum login atau bukan admin', async () => {
    vi.mocked(getSession).mockResolvedValueOnce(null);

    const result = await deleteEvent(1);

    expect(result.success).toBe(false);
    expect(result.message).toMatch(/akses ditolak/i);
    expect(db.event.delete).not.toHaveBeenCalled();
  });

  it('2. [VALIDATION] harus menolak jika ID tidak valid', async () => {
    vi.mocked(getSession).mockResolvedValueOnce({
      id: '1',
      username: 'admin',
      name: 'Admin',
      role: USER_ROLE.ADMIN,
    });

    const result = await deleteEvent(-1);

    expect(result.success).toBe(false);
    expect(result.message).toMatch(/id kegiatan tidak valid/i);
    expect(db.event.delete).not.toHaveBeenCalled();
  });

  it('3. [NOT FOUND] harus menolak jika kegiatan tidak ditemukan', async () => {
    vi.mocked(getSession).mockResolvedValueOnce({
      id: '1',
      username: 'admin',
      name: 'Admin',
      role: USER_ROLE.ADMIN,
    });
    vi.mocked(getEventById).mockResolvedValueOnce(null);

    const result = await deleteEvent(999);

    expect(result.success).toBe(false);
    expect(result.message).toMatch(/kegiatan tidak ditemukan/i);
    expect(db.event.delete).not.toHaveBeenCalled();
  });

  it('4. [HAPPY PATH] harus menghapus kegiatan, menghapus gambar cover, dan me-revalidate path', async () => {
    vi.mocked(getSession).mockResolvedValueOnce({
      id: '1',
      username: 'admin',
      name: 'Admin',
      role: USER_ROLE.ADMIN,
    });
    vi.mocked(getEventById).mockResolvedValueOnce({
      id: 1,
      title: 'Donor Darah Akbar',
      slug: 'donor-darah-akbar',
      content: 'Deskripsi kegiatan',
      coverImage: '/uploads/events/donor.png',
      eventDate: new Date(),
      location: 'Aula Utama',
      status: 'PUBLISHED',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    vi.mocked(db.event.delete).mockResolvedValueOnce({
      id: 1,
      title: 'Donor Darah Akbar',
      slug: 'donor-darah-akbar',
      content: 'Deskripsi kegiatan',
      coverImage: '/uploads/events/donor.png',
      eventDate: new Date(),
      location: 'Aula Utama',
      status: 'PUBLISHED',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await deleteEvent(1);

    expect(result.success).toBe(true);
    expect(deleteFile).toHaveBeenCalledWith('/uploads/events/donor.png');
    expect(db.event.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(revalidatePath).toHaveBeenCalledWith('/admin/events');
    expect(revalidatePath).toHaveBeenCalledWith('/events');
  });

  it('5. [ERROR HANDLING] harus menangani exception database dengan graceful error', async () => {
    vi.mocked(getSession).mockResolvedValueOnce({
      id: '1',
      username: 'admin',
      name: 'Admin',
      role: USER_ROLE.ADMIN,
    });
    vi.mocked(getEventById).mockResolvedValueOnce({
      id: 1,
      title: 'Donor Darah',
      slug: 'donor-darah',
      content: 'Deskripsi',
      coverImage: null,
      eventDate: new Date(),
      location: 'Aula',
      status: 'PUBLISHED',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    vi.mocked(db.event.delete).mockRejectedValueOnce(new Error('Koneksi database gagal'));

    const result = await deleteEvent(1);

    expect(result.success).toBe(false);
    expect(result.message).toMatch(/koneksi database gagal/i);
  });
});
