import { describe, it, expect, vi, beforeEach } from 'vitest';

// =============================================================
// Integration Tests — article-queries (Data Access Layer)
// Sesuai Lapis 3 HANDBOOK_TESTING.MD
// Skenario: paginasi, batas limit, filter status, search
// =============================================================

vi.mock('@/lib/db', () => ({
  db: {
    article: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      count: vi.fn(),
    },
  },
}));

import {
  getArticles,
  getPublishedArticles,
  getArticleBySlug,
  getArticleById,
  getArticleCount,
  getLatestArticles,
} from './article-queries';
import { db } from '@/lib/db';
import { buildMockArticle } from '../../../../tests/factories/article.factory';

describe('article-queries — Data Access Layer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ─── getArticleCount ─────────────────────────────────────
  describe('getArticleCount()', () => {
    it('harus mengembalikan jumlah total artikel', async () => {
      // Arrange
      vi.mocked(db.article.count).mockResolvedValueOnce(42);

      // Act
      const count = await getArticleCount();

      // Assert
      expect(count).toBe(42);
      expect(db.article.count).toHaveBeenCalledOnce();
    });

    it('harus mengembalikan 0 jika tidak ada artikel', async () => {
      vi.mocked(db.article.count).mockResolvedValueOnce(0);
      const count = await getArticleCount();
      expect(count).toBe(0);
    });
  });

  // ─── getLatestArticles ───────────────────────────────────
  describe('getLatestArticles(take)', () => {
    it('harus memanggil findMany dengan take yang diberikan', async () => {
      // Arrange
      const mockArticles = [buildMockArticle(), buildMockArticle({ id: 2 })];
      vi.mocked(db.article.findMany).mockResolvedValueOnce(mockArticles);

      // Act
      const articles = await getLatestArticles(5);

      // Assert
      expect(db.article.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ take: 5 })
      );
      expect(articles).toHaveLength(2);
    });
  });

  // ─── getArticles ─────────────────────────────────────────
  describe('getArticles(limit)', () => {
    it('harus menggunakan limit default 100 jika tidak diisi', async () => {
      vi.mocked(db.article.findMany).mockResolvedValueOnce([]);

      await getArticles();

      expect(db.article.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ take: 100 })
      );
    });

    it('harus membatasi limit maksimal 100 meski input lebih besar', async () => {
      // Arrange — anti-abuse: limit tidak boleh melebihi 100
      vi.mocked(db.article.findMany).mockResolvedValueOnce([]);

      // Act
      await getArticles(9999);

      // Assert — batas server harus menang
      expect(db.article.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ take: 100 })
      );
    });

    it('harus menggunakan minimal 1 meski input limit 0 atau negatif', async () => {
      vi.mocked(db.article.findMany).mockResolvedValueOnce([]);

      await getArticles(0);

      expect(db.article.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ take: 1 })
      );
    });
  });

  // ─── getPublishedArticles ────────────────────────────────
  describe('getPublishedArticles()', () => {
    it('harus selalu memfilter dengan status PUBLISHED', async () => {
      // Arrange
      vi.mocked(db.article.findMany).mockResolvedValueOnce([]);

      // Act
      await getPublishedArticles();

      // Assert — tidak boleh ada artikel DRAFT yang bocor
      expect(db.article.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ status: 'PUBLISHED' }),
        })
      );
    });

    it('harus membatasi take maksimal 100 meski permintaan lebih besar', async () => {
      vi.mocked(db.article.findMany).mockResolvedValueOnce([]);

      await getPublishedArticles({ take: 500 });

      expect(db.article.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ take: 100 })
      );
    });

    it('harus menggunakan minimal take 1 meski input 0 atau negatif', async () => {
      vi.mocked(db.article.findMany).mockResolvedValueOnce([]);

      await getPublishedArticles({ take: 0 });

      expect(db.article.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ take: 1 })
      );
    });

    it('harus menerapkan filter kategori jika disediakan', async () => {
      vi.mocked(db.article.findMany).mockResolvedValueOnce([]);

      await getPublishedArticles({ category: 'Gaya Hidup' });

      expect(db.article.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            status: 'PUBLISHED',
            category: 'Gaya Hidup',
          }),
        })
      );
    });

    it('harus TIDAK menerapkan filter kategori jika "Semua" dipilih', async () => {
      vi.mocked(db.article.findMany).mockResolvedValueOnce([]);

      await getPublishedArticles({ category: 'Semua' });

      const callArgs = vi.mocked(db.article.findMany).mock.calls[0][0] as {
        where?: Record<string, unknown>;
      };
      expect(callArgs.where).not.toHaveProperty('category');
    });

    it('harus menerapkan pencarian ke title dan summary sekaligus (OR query)', async () => {
      vi.mocked(db.article.findMany).mockResolvedValueOnce([]);

      await getPublishedArticles({ search: 'diabetes' });

      expect(db.article.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.arrayContaining([
              expect.objectContaining({ title: expect.anything() }),
              expect.objectContaining({ summary: expect.anything() }),
            ]),
          }),
        })
      );
    });

    it('harus menerapkan skip (offset) untuk paginasi', async () => {
      vi.mocked(db.article.findMany).mockResolvedValueOnce([]);

      await getPublishedArticles({ skip: 20 });

      expect(db.article.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 20 })
      );
    });
  });

  // ─── getArticleBySlug ────────────────────────────────────
  describe('getArticleBySlug(slug)', () => {
    it('harus mengembalikan artikel yang ditemukan berdasarkan slug', async () => {
      // Arrange
      const mockArticle = buildMockArticle({ slug: 'artikel-kesehatan-test' });
      vi.mocked(db.article.findUnique).mockResolvedValueOnce(mockArticle);

      // Act
      const result = await getArticleBySlug('artikel-kesehatan-test');

      // Assert
      expect(result).not.toBeNull();
      expect(result?.slug).toBe('artikel-kesehatan-test');
      expect(db.article.findUnique).toHaveBeenCalledWith({
        where: { slug: 'artikel-kesehatan-test' },
      });
    });

    it('harus mengembalikan null jika slug tidak ditemukan', async () => {
      vi.mocked(db.article.findUnique).mockResolvedValueOnce(null);

      const result = await getArticleBySlug('slug-tidak-ada');

      expect(result).toBeNull();
    });
  });

  // ─── getArticleById ──────────────────────────────────────
  describe('getArticleById(id)', () => {
    it('harus mengembalikan artikel berdasarkan id', async () => {
      // Arrange
      const mockArticle = buildMockArticle({ id: 99 });
      vi.mocked(db.article.findUnique).mockResolvedValueOnce(mockArticle);

      // Act
      const result = await getArticleById(99);

      // Assert
      expect(result?.id).toBe(99);
      expect(db.article.findUnique).toHaveBeenCalledWith({ where: { id: 99 } });
    });

    it('harus mengembalikan null jika id tidak ditemukan', async () => {
      vi.mocked(db.article.findUnique).mockResolvedValueOnce(null);

      const result = await getArticleById(0);

      expect(result).toBeNull();
    });
  });
});
