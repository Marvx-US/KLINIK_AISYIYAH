import { describe, it, expect, vi, beforeEach } from 'vitest';
import { revalidatePath } from 'next/cache';
import { saveEvent } from './save-event';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { getEventById } from '../queries/event-queries';
import { USER_ROLE } from '@/lib/constants';

vi.mock('@/lib/auth', () => ({ getSession: vi.fn() }));
vi.mock('@/lib/db', () => ({
  db: {
    event: { create: vi.fn(), update: vi.fn() },
  },
}));
vi.mock('@/lib/upload', () => ({ uploadFile: vi.fn().mockResolvedValue(null) }));
vi.mock('../queries/event-queries', () => ({ getEventById: vi.fn() }));

const adminSession = { id: 'admin-1', username: 'admin', name: 'Admin', role: USER_ROLE.ADMIN };

describe('saveEvent Server Action (Bab 4.3 Integration Testing)', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('1. [RBAC] harus menolak aksi jika user tidak terautentikasi', async () => {
    // Arrange
    vi.mocked(getSession).mockResolvedValueOnce(null);
    const formData = new FormData();
    formData.append('title', 'Seminar Kesehatan');

    // Act
    const result = await saveEvent(null, formData);

    // Assert
    expect(result.success).toBe(false);
    expect(result.message).toMatch(/akses ditolak/i);
    expect(db.event.create).not.toHaveBeenCalled();
  });

  it('2. [ZOD] harus mengembalikan error jika judul dan konten tidak diisi', async () => {
    // Arrange
    vi.mocked(getSession).mockResolvedValueOnce(adminSession);
    const formData = new FormData();
    formData.append('title', '');
    formData.append('content', '');

    // Act
    const result = await saveEvent(null, formData);

    // Assert
    expect(result.success).toBe(false);
    expect(result.fieldErrors ?? result.message).toBeTruthy();
    expect(db.event.create).not.toHaveBeenCalled();
  });

  it('3. [ATURAN BISNIS] harus menolak update jika event ID tidak ditemukan', async () => {
    // Arrange
    vi.mocked(getSession).mockResolvedValueOnce(adminSession);
    vi.mocked(getEventById).mockResolvedValueOnce(null);
    const formData = new FormData();
    formData.append('id', '999');
    formData.append('title', 'Seminar Hipertensi 2026');
    formData.append('content', '<p>Konten lengkap seminar hipertensi.</p>');
    formData.append('status', 'PUBLISHED');

    // Act
    const result = await saveEvent(null, formData);

    // Assert
    expect(result.success).toBe(false);
    expect(result.message).toMatch(/tidak ditemukan/i);
    expect(db.event.update).not.toHaveBeenCalled();
  });

  it('4. [HAPPY PATH] harus berhasil membuat event baru dan me-revalidate cache', async () => {
    // Arrange
    vi.mocked(getSession).mockResolvedValueOnce(adminSession);
    vi.mocked(db.event.create).mockResolvedValueOnce({
      id: 20, title: 'Seminar Hipertensi', slug: 'seminar-hipertensi-12345',
      content: '<p>Konten.</p>', coverImage: null, eventDate: null, location: null,
      status: 'PUBLISHED', createdAt: new Date(), updatedAt: new Date(),
    });

    const formData = new FormData();
    formData.append('title', 'Seminar Hipertensi');
    formData.append('content', '<p>Konten lengkap acara seminar kesehatan hipertensi.</p>');
    formData.append('status', 'PUBLISHED');

    // Act
    const result = await saveEvent(null, formData);

    // Assert
    expect(result.success).toBe(true);
    expect(result.data?.id).toBe(20);
    expect(db.event.create).toHaveBeenCalled();
    expect(revalidatePath).toHaveBeenCalledWith('/events');
    expect(revalidatePath).toHaveBeenCalledWith('/admin/events');
  });
});
