import { describe, it, expect, vi, beforeEach } from 'vitest';
import { revalidatePath } from 'next/cache';

// =============================================================
// Integration Tests — saveArticle Server Action
// Sesuai Lapis 3 HANDBOOK_TESTING.MD
// 5 Skenario Wajib: RBAC, Zod, Business Rule, Happy Path, Side Effects
// =============================================================

// --- Mock seluruh dependensi eksternal ---
vi.mock('@/lib/auth', () => ({
  getSession: vi.fn(),
}));

vi.mock('@/lib/db', () => ({
  db: {
    article: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
  },
}));

vi.mock('@/lib/upload', () => ({
  uploadFile: vi.fn().mockResolvedValue(null),
}));

vi.mock('../queries/article-queries', () => ({
  getArticleById: vi.fn(),
}));

// Import SETELAH mock terdefinisi
import { saveArticle } from './save-article';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { getArticleById } from '../queries/article-queries';
import { buildMockArticle } from '../../../../tests/factories/article.factory';
import { buildMockSession } from '../../../../tests/factories/user.factory';

// ─── Helper: membuat FormData standar yang valid ────────────
function buildValidFormData(overrides: Record<string, string> = {}): FormData {
  const formData = new FormData();
  formData.append('title', overrides.title ?? 'Judul Artikel Uji Coba yang Panjang');
  formData.append('summary', overrides.summary ?? 'Ringkasan artikel untuk keperluan pengujian integrasi server action.');
  formData.append('content', overrides.content ?? '<p>Konten artikel yang cukup panjang untuk lolos validasi Zod minimal 20 karakter.</p>');
  formData.append('category', overrides.category ?? 'Gaya Hidup');
  formData.append('status', overrides.status ?? 'DRAFT');
  return formData;
}

// ─── Test Suite ──────────────────────────────────────────────
describe('saveArticle() — Server Action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ─── SKENARIO 1: RBAC ──────────────────────────────────────
  describe('1. [RBAC] Autentikasi & Otorisasi', () => {
    it('harus menolak akses jika pengguna belum login (session null)', async () => {
      // Arrange
      vi.mocked(getSession).mockResolvedValueOnce(null);

      // Act
      const response = await saveArticle(null, buildValidFormData());

      // Assert
      expect(response.success).toBe(false);
      expect(response.message).toMatch(/akses ditolak/i);
      expect(db.article.create).not.toHaveBeenCalled();
      expect(db.article.update).not.toHaveBeenCalled();
    });

    it('harus menolak akses jika pengguna memiliki role yang bukan ADMIN', async () => {
      // Arrange — simulasi pengguna dengan role tidak berwenang
      vi.mocked(getSession).mockResolvedValueOnce(
        buildMockSession({ role: 'GUEST' })
      );

      // Act
      const response = await saveArticle(null, buildValidFormData());

      // Assert
      expect(response.success).toBe(false);
      expect(response.message).toMatch(/akses ditolak/i);
      expect(db.article.create).not.toHaveBeenCalled();
    });
  });

  // ─── SKENARIO 2: VALIDASI ZOD ─────────────────────────────
  describe('2. [ZOD] Validasi Input', () => {
    beforeEach(() => {
      vi.mocked(getSession).mockResolvedValue(buildMockSession());
    });

    it('harus mengembalikan fieldErrors jika title kosong', async () => {
      // Act
      const response = await saveArticle(null, buildValidFormData({ title: '' }));

      // Assert
      expect(response.success).toBe(false);
      expect(response.fieldErrors).toBeDefined();
      expect(response.fieldErrors?.title).toBeDefined();
      expect(db.article.create).not.toHaveBeenCalled();
    });

    it('harus mengembalikan fieldErrors jika title terlalu pendek (< 3 karakter)', async () => {
      const response = await saveArticle(null, buildValidFormData({ title: 'AB' }));

      expect(response.success).toBe(false);
      expect(response.fieldErrors?.title).toBeDefined();
      expect(db.article.create).not.toHaveBeenCalled();
    });

    it('harus mengembalikan fieldErrors jika category tidak valid', async () => {
      const response = await saveArticle(null, buildValidFormData({ category: 'Kategori Palsu' }));

      expect(response.success).toBe(false);
      expect(response.fieldErrors).toBeDefined();
      expect(db.article.create).not.toHaveBeenCalled();
    });

    it('harus mengembalikan fieldErrors untuk beberapa field sekaligus jika keduanya invalid', async () => {
      const formData = new FormData();
      formData.append('title', 'AB');       // terlalu pendek
      formData.append('summary', 'Sing');   // terlalu pendek
      formData.append('content', '');        // kosong
      formData.append('category', 'Gaya Hidup');

      const response = await saveArticle(null, formData);

      expect(response.success).toBe(false);
      expect(response.fieldErrors).toBeDefined();
      expect(db.article.create).not.toHaveBeenCalled();
    });
  });

  // ─── SKENARIO 3: ATURAN BISNIS ────────────────────────────
  describe('3. [Business Rule] Aturan Bisnis', () => {
    beforeEach(() => {
      vi.mocked(getSession).mockResolvedValue(buildMockSession());
    });

    it('harus menolak update jika artikel dengan id tersebut tidak ditemukan di database', async () => {
      // Arrange — simulasi artikel tidak ada
      vi.mocked(getArticleById).mockResolvedValueOnce(null);

      const formData = buildValidFormData();
      formData.append('id', '999');

      // Act
      const response = await saveArticle(null, formData);

      // Assert
      expect(response.success).toBe(false);
      expect(response.message).toMatch(/tidak ditemukan/i);
      expect(db.article.update).not.toHaveBeenCalled();
    });
  });

  // ─── SKENARIO 4: HAPPY PATH (CREATE) ──────────────────────
  describe('4. [Happy Path] Membuat Artikel Baru', () => {
    beforeEach(() => {
      vi.mocked(getSession).mockResolvedValue(buildMockSession());
    });

    it('harus berhasil membuat artikel baru dan mengembalikan id yang dibuat', async () => {
      // Arrange
      const mockCreatedArticle = buildMockArticle({ id: 77, status: 'DRAFT' });
      vi.mocked(db.article.create).mockResolvedValueOnce(mockCreatedArticle);

      // Act
      const response = await saveArticle(null, buildValidFormData());

      // Assert
      expect(response.success).toBe(true);
      expect(response.data?.id).toBe(77);
      expect(db.article.create).toHaveBeenCalledOnce();
    });

    it('harus membuat slug dari title secara otomatis di sisi server', async () => {
      // Arrange
      const mockCreatedArticle = buildMockArticle({ id: 1 });
      vi.mocked(db.article.create).mockResolvedValueOnce(mockCreatedArticle);

      // Act
      await saveArticle(null, buildValidFormData({ title: 'Judul Artikel Baru Saya' }));

      // Assert — pastikan create dipanggil dengan slug yang mengandung kata dari title
      expect(db.article.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            slug: expect.stringMatching(/judul-artikel-baru-saya/),
          }),
        })
      );
    });
  });

  // ─── SKENARIO 5: HAPPY PATH (UPDATE) & SIDE EFFECTS ──────
  describe('5. [Happy Path] Memperbarui Artikel & Side Effects', () => {
    beforeEach(() => {
      vi.mocked(getSession).mockResolvedValue(buildMockSession());
    });

    it('harus berhasil memperbarui artikel yang ada dan memanggil revalidatePath', async () => {
      // Arrange
      const existingArticle = buildMockArticle({ id: 10, status: 'DRAFT' });
      vi.mocked(getArticleById).mockResolvedValueOnce(existingArticle);
      vi.mocked(db.article.update).mockResolvedValueOnce({
        ...existingArticle,
        title: 'Judul Diperbarui',
        status: 'PUBLISHED',
      });

      const formData = buildValidFormData({ status: 'PUBLISHED' });
      formData.append('id', '10');

      // Act
      const response = await saveArticle(null, formData);

      // Assert
      expect(response.success).toBe(true);
      expect(db.article.update).toHaveBeenCalledOnce();
      expect(db.article.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 10 },
        })
      );
    });

    it('harus memanggil revalidatePath untuk route yang tepat setelah simpan berhasil', async () => {
      // Arrange
      const mockCreatedArticle = buildMockArticle({ id: 5 });
      vi.mocked(db.article.create).mockResolvedValueOnce(mockCreatedArticle);

      // Act
      await saveArticle(null, buildValidFormData());

      // Assert — verifikasi side effect cache invalidation
      expect(revalidatePath).toHaveBeenCalledWith('/admin/articles');
      expect(revalidatePath).toHaveBeenCalledWith('/articles');
      expect(revalidatePath).toHaveBeenCalledWith('/');
    });

    it('harus mengembalikan response gagal yang memiliki pesan jika database error', async () => {
      // Arrange — simulasi database error
      vi.mocked(db.article.create).mockRejectedValueOnce(
        new Error('Database connection lost')
      );

      // Act
      const response = await saveArticle(null, buildValidFormData());

      // Assert — save-article.ts meneruskan error.message ke response (by design)
      // yang terpenting adalah success = false dan ada pesan (tidak throw/crash)
      expect(response.success).toBe(false);
      expect(response.message).toBeTruthy();
      expect(typeof response.message).toBe('string');
      expect(response.message.length).toBeGreaterThan(0);
    });
  });
});
