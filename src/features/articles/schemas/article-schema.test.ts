import { describe, it, expect } from 'vitest';
import { ArticleSchema } from './article-schema';

// =============================================================
// Unit Tests — ArticleSchema (Zod)
// Sesuai Lapis 2 HANDBOOK_TESTING.MD
// Mencakup: Happy Path, Boundary Values, Input Tidak Valid
// =============================================================

describe('ArticleSchema — validasi artikel', () => {
  // ─── DATA VALID (Happy Path) ────────────────────────────────
  describe('Happy Path — payload valid', () => {
    it('harus meluluskan payload artikel baru yang lengkap dan valid', () => {
      // Arrange
      const validPayload = {
        title: 'Judul Artikel Kesehatan yang Valid',
        summary: 'Ringkasan artikel yang cukup panjang untuk lolos validasi minimal.',
        content: '<p>Isi artikel yang cukup panjang untuk lolos validasi minimal 20 karakter.</p>',
        category: 'Gaya Hidup',
        status: 'PUBLISHED',
      };

      // Act
      const result = ArticleSchema.safeParse(validPayload);

      // Assert
      expect(result.success).toBe(true);
    });

    it('harus meluluskan payload artikel dengan status DRAFT (default)', () => {
      const result = ArticleSchema.safeParse({
        title: 'Judul Artikel Draft',
        summary: 'Ringkasan yang cukup panjang untuk lolos validasi minimal.',
        content: '<p>Konten artikel draft yang cukup panjang untuk lolos validasi.</p>',
        category: 'Kesehatan Anak',
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.status).toBe('DRAFT');
      }
    });

    it('harus meluluskan payload edit artikel (dengan id angka positif)', () => {
      const result = ArticleSchema.safeParse({
        id: 42,
        title: 'Judul Artikel Diperbarui',
        summary: 'Ringkasan artikel yang diperbarui dan cukup panjang.',
        content: '<p>Konten artikel yang diperbarui dan cukup panjang untuk validasi.</p>',
        category: 'Edukasi Medis',
        status: 'PUBLISHED',
      });

      expect(result.success).toBe(true);
    });

    it('harus menerima semua kategori yang valid', () => {
      const categories = ['Gaya Hidup', 'Kesehatan Anak', 'Edukasi Medis', 'Info Klinik'] as const;
      categories.forEach((category) => {
        const result = ArticleSchema.safeParse({
          title: 'Judul untuk kategori test',
          summary: 'Ringkasan yang cukup panjang untuk lolos validasi.',
          content: '<p>Konten cukup panjang untuk lolos validasi Zod minimal.</p>',
          category,
        });
        expect(result.success, `Kategori "${category}" harus valid`).toBe(true);
      });
    });
  });

  // ─── BOUNDARY VALUES ────────────────────────────────────────
  describe('Boundary Values — nilai batas', () => {
    it('harus menolak title yang terlalu pendek (< 3 karakter)', () => {
      const result = ArticleSchema.safeParse({
        title: 'AB',
        summary: 'Ringkasan yang cukup panjang untuk lolos validasi.',
        content: '<p>Konten cukup panjang untuk lolos validasi.</p>',
        category: 'Gaya Hidup',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.title).toBeDefined();
      }
    });

    it('harus meluluskan title dengan tepat 3 karakter (batas minimum)', () => {
      const result = ArticleSchema.safeParse({
        title: 'ABC',
        summary: 'Ringkasan yang cukup panjang untuk lolos validasi.',
        content: '<p>Konten cukup panjang untuk lolos validasi minimal.</p>',
        category: 'Gaya Hidup',
      });

      expect(result.success).toBe(true);
    });

    it('harus menolak title yang melebihi 200 karakter', () => {
      const result = ArticleSchema.safeParse({
        title: 'A'.repeat(201),
        summary: 'Ringkasan yang valid.',
        content: '<p>Konten yang valid dan cukup panjang.</p>',
        category: 'Gaya Hidup',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.title).toBeDefined();
      }
    });

    it('harus menolak summary yang terlalu pendek (< 10 karakter)', () => {
      const result = ArticleSchema.safeParse({
        title: 'Judul Valid',
        summary: 'Pendek',
        content: '<p>Konten cukup panjang untuk lolos validasi.</p>',
        category: 'Gaya Hidup',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.summary).toBeDefined();
      }
    });

    it('harus menolak content yang terlalu pendek (< 20 karakter)', () => {
      const result = ArticleSchema.safeParse({
        title: 'Judul Valid',
        summary: 'Ringkasan yang cukup panjang untuk lolos.',
        content: 'Terlalu pendek',
        category: 'Gaya Hidup',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.content).toBeDefined();
      }
    });
  });

  // ─── INPUT TIDAK VALID ───────────────────────────────────────
  describe('Input Tidak Valid — edge cases & security', () => {
    it('harus menolak title berupa string kosong ""', () => {
      const result = ArticleSchema.safeParse({
        title: '',
        summary: 'Ringkasan yang cukup panjang.',
        content: '<p>Konten yang cukup panjang untuk validasi.</p>',
        category: 'Gaya Hidup',
      });

      expect(result.success).toBe(false);
    });

    it('harus menolak title berupa spasi saja (whitespace-only) karena .trim()', () => {
      const result = ArticleSchema.safeParse({
        title: '   ',
        summary: 'Ringkasan yang cukup panjang.',
        content: '<p>Konten yang cukup panjang untuk validasi.</p>',
        category: 'Gaya Hidup',
      });

      expect(result.success).toBe(false);
    });

    it('harus menolak kategori yang tidak terdaftar dalam enum', () => {
      const result = ArticleSchema.safeParse({
        title: 'Judul Valid',
        summary: 'Ringkasan yang cukup panjang.',
        content: '<p>Konten yang cukup panjang untuk validasi.</p>',
        category: 'Kategori Tidak Ada',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.category).toBeDefined();
      }
    });

    it('harus menolak status yang tidak valid (bukan PUBLISHED atau DRAFT)', () => {
      const result = ArticleSchema.safeParse({
        title: 'Judul Valid',
        summary: 'Ringkasan yang cukup panjang.',
        content: '<p>Konten yang cukup panjang untuk validasi.</p>',
        category: 'Gaya Hidup',
        status: 'ARCHIVED',
      });

      expect(result.success).toBe(false);
    });

    it('harus menolak payload yang sama sekali kosong (missing required fields)', () => {
      const result = ArticleSchema.safeParse({});

      expect(result.success).toBe(false);
      if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
        expect(errors.title).toBeDefined();
        expect(errors.summary).toBeDefined();
        expect(errors.content).toBeDefined();
        expect(errors.category).toBeDefined();
      }
    });

    it('harus menolak field title yang berisi tipe bukan string (angka)', () => {
      const result = ArticleSchema.safeParse({
        title: 12345,
        summary: 'Ringkasan yang cukup panjang.',
        content: '<p>Konten yang cukup panjang untuk validasi.</p>',
        category: 'Gaya Hidup',
      });

      expect(result.success).toBe(false);
    });
  });
});
