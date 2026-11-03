import { describe, it, expect, vi, beforeEach } from 'vitest';
import { revalidatePath } from 'next/cache';
import { deleteArticle } from './delete-article';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { deleteFile } from '@/lib/upload';
import { getArticleById } from '../queries/article-queries';
import { buildMockArticle } from '../../../../tests/factories/article.factory';
import { USER_ROLE } from '@/lib/constants';

vi.mock('@/lib/auth', () => ({
  getSession: vi.fn(),
}));

vi.mock('@/lib/db', () => ({
  db: {
    article: {
      delete: vi.fn(),
    },
  },
}));

vi.mock('@/lib/upload', () => ({
  deleteFile: vi.fn(),
}));

vi.mock('../queries/article-queries', () => ({
  getArticleById: vi.fn(),
}));

describe('deleteArticle Server Action (Bab 4.3 Integration Testing)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('1. [RBAC] harus menolak aksi jika sesi pengguna tidak ada atau bukan ADMIN', async () => {
    // Arrange
    vi.mocked(getSession).mockResolvedValueOnce(null);

    // Act
    const result = await deleteArticle(1);

    // Assert
    expect(result.success).toBe(false);
    expect(result.message).toMatch(/akses ditolak/i);
    expect(db.article.delete).not.toHaveBeenCalled();
  });

  it('2. [VALIDASI] harus menolak jika id tidak valid (<= 0 atau NaN)', async () => {
    // Arrange
    vi.mocked(getSession).mockResolvedValue({
      id: 'admin-1',
      username: 'admin',
      name: 'Admin',
      role: USER_ROLE.ADMIN,
    });

    // Act
    const resultNegative = await deleteArticle(-5);
    const resultZero = await deleteArticle(0);

    // Assert
    expect(resultNegative.success).toBe(false);
    expect(resultNegative.message).toMatch(/id artikel tidak valid/i);
    expect(resultZero.success).toBe(false);
    expect(resultZero.message).toMatch(/id artikel tidak valid/i);
    expect(db.article.delete).not.toHaveBeenCalled();
  });

  it('3. [ATURAN BISNIS] harus menolak jika artikel tidak ditemukan di database', async () => {
    // Arrange
    vi.mocked(getSession).mockResolvedValueOnce({
      id: 'admin-1',
      username: 'admin',
      name: 'Admin',
      role: USER_ROLE.ADMIN,
    });
    vi.mocked(getArticleById).mockResolvedValueOnce(null);

    // Act
    const result = await deleteArticle(999);

    // Assert
    expect(result.success).toBe(false);
    expect(result.message).toMatch(/tidak ditemukan/i);
    expect(db.article.delete).not.toHaveBeenCalled();
  });

  it('4. [HAPPY PATH] harus menghapus artikel, membersihkan file cover, dan me-revalidate cache', async () => {
    // Arrange
    vi.mocked(getSession).mockResolvedValueOnce({
      id: 'admin-1',
      username: 'admin',
      name: 'Admin',
      role: USER_ROLE.ADMIN,
    });
    const mockExisting = buildMockArticle({
      id: 42,
      coverImage: '/uploads/articles/cover-to-delete.webp',
    });
    vi.mocked(getArticleById).mockResolvedValueOnce(mockExisting);
    vi.mocked(deleteFile).mockResolvedValueOnce(true);
    vi.mocked(db.article.delete).mockResolvedValueOnce(mockExisting);

    // Act
    const result = await deleteArticle(42);

    // Assert
    expect(result.success).toBe(true);
    expect(result.message).toMatch(/berhasil dihapus/i);
    expect(deleteFile).toHaveBeenCalledWith('/uploads/articles/cover-to-delete.webp');
    expect(db.article.delete).toHaveBeenCalledWith({ where: { id: 42 } });
    expect(revalidatePath).toHaveBeenCalledWith('/admin/articles');
    expect(revalidatePath).toHaveBeenCalledWith('/articles');
    expect(revalidatePath).toHaveBeenCalledWith('/');
  });

  it('5. [ERROR HANDLING] harus menangani kegagalan database secara terukur tanpa melempar crash unhandled', async () => {
    // Arrange
    vi.mocked(getSession).mockResolvedValueOnce({
      id: 'admin-1',
      username: 'admin',
      name: 'Admin',
      role: USER_ROLE.ADMIN,
    });
    const mockExisting = buildMockArticle({ id: 50, coverImage: null });
    vi.mocked(getArticleById).mockResolvedValueOnce(mockExisting);
    vi.mocked(db.article.delete).mockRejectedValueOnce(new Error('Koneksi database terputus.'));

    // Act
    const result = await deleteArticle(50);

    // Assert
    expect(result.success).toBe(false);
    expect(result.message).toMatch(/koneksi database terputus/i);
  });
});
