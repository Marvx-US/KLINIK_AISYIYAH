import { describe, it, expect } from 'vitest';
import { EventSchema } from './event-schema';

// =============================================================
// Unit Tests — EventSchema (Zod)
// Sesuai Lapis 2 HANDBOOK_TESTING.MD
// Mencakup: Happy Path, Boundary Values, Edge Cases eventDate
// =============================================================

describe('EventSchema — validasi kegiatan klinik', () => {
  // ─── HAPPY PATH ─────────────────────────────────────────────
  describe('Happy Path — payload valid', () => {
    it('harus meluluskan payload kegiatan lengkap dengan semua field opsional', () => {
      // Arrange
      const validPayload = {
        title: 'Seminar Kesehatan Ibu dan Anak 2026',
        content: '<p>Deskripsi kegiatan seminar yang cukup panjang untuk lolos validasi minimal 10 karakter.</p>',
        location: 'Aula Utama Klinik Aisyiyah Pangkajene',
        status: 'PUBLISHED',
        eventDate: '2026-12-25T08:00:00Z',
      };

      // Act
      const result = EventSchema.safeParse(validPayload);

      // Assert
      expect(result.success).toBe(true);
    });

    it('harus meluluskan payload tanpa location dan eventDate (keduanya opsional)', () => {
      const result = EventSchema.safeParse({
        title: 'Kegiatan Imunisasi Rutin',
        content: '<p>Kegiatan imunisasi rutin yang cukup panjang untuk lolos validasi.</p>',
        status: 'DRAFT',
      });

      expect(result.success).toBe(true);
    });

    it('harus menerima eventDate berupa objek Date langsung', () => {
      const result = EventSchema.safeParse({
        title: 'Pemeriksaan Kesehatan Gratis',
        content: '<p>Pemeriksaan kesehatan gratis untuk warga sekitar klinik.</p>',
        eventDate: new Date('2026-06-15'),
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.eventDate).toBeInstanceOf(Date);
      }
    });

    it('harus mengubah eventDate string ISO menjadi objek Date', () => {
      const result = EventSchema.safeParse({
        title: 'Workshop Kesehatan Mental',
        content: '<p>Workshop kesehatan mental untuk karyawan klinik.</p>',
        eventDate: '2026-09-01T09:00:00Z',
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.eventDate).toBeInstanceOf(Date);
      }
    });

    it('harus mengubah eventDate string kosong menjadi null', () => {
      const result = EventSchema.safeParse({
        title: 'Judul Kegiatan Valid',
        content: '<p>Konten kegiatan yang cukup panjang untuk lolos validasi.</p>',
        eventDate: '',
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.eventDate).toBeNull();
      }
    });
  });

  // ─── BOUNDARY VALUES ────────────────────────────────────────
  describe('Boundary Values — nilai batas', () => {
    it('harus menolak title yang terlalu pendek (< 3 karakter)', () => {
      const result = EventSchema.safeParse({
        title: 'AB',
        content: '<p>Konten kegiatan yang cukup panjang untuk lolos validasi.</p>',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.title).toBeDefined();
      }
    });

    it('harus meluluskan title dengan tepat 3 karakter (batas minimum)', () => {
      const result = EventSchema.safeParse({
        title: 'KIA',
        content: '<p>Konten kegiatan KIA yang cukup panjang untuk lolos validasi.</p>',
      });

      expect(result.success).toBe(true);
    });

    it('harus menolak title melebihi 200 karakter', () => {
      const result = EventSchema.safeParse({
        title: 'X'.repeat(201),
        content: '<p>Konten kegiatan yang cukup panjang untuk lolos validasi.</p>',
      });

      expect(result.success).toBe(false);
    });

    it('harus menolak content yang terlalu pendek (< 10 karakter)', () => {
      const result = EventSchema.safeParse({
        title: 'Judul Valid',
        content: 'Pendek',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.content).toBeDefined();
      }
    });

    it('harus menolak location yang melebihi 300 karakter', () => {
      const result = EventSchema.safeParse({
        title: 'Judul Kegiatan Valid',
        content: '<p>Konten kegiatan yang cukup panjang untuk lolos validasi.</p>',
        location: 'L'.repeat(301),
      });

      expect(result.success).toBe(false);
    });
  });

  // ─── INPUT TIDAK VALID ───────────────────────────────────────
  describe('Input Tidak Valid — edge cases', () => {
    it('harus menolak title berupa string kosong', () => {
      const result = EventSchema.safeParse({
        title: '',
        content: '<p>Konten valid yang cukup panjang untuk lolos validasi.</p>',
      });

      expect(result.success).toBe(false);
    });

    it('harus menolak title berupa spasi saja karena .trim()', () => {
      const result = EventSchema.safeParse({
        title: '     ',
        content: '<p>Konten valid yang cukup panjang untuk lolos validasi.</p>',
      });

      expect(result.success).toBe(false);
    });

    it('harus menolak status yang tidak valid', () => {
      const result = EventSchema.safeParse({
        title: 'Judul Valid',
        content: '<p>Konten valid yang cukup panjang untuk lolos validasi.</p>',
        status: 'CANCELLED',
      });

      expect(result.success).toBe(false);
    });

    it('harus menangani eventDate string yang bukan tanggal valid dengan mengubahnya ke null', () => {
      const result = EventSchema.safeParse({
        title: 'Judul Valid',
        content: '<p>Konten valid yang cukup panjang untuk lolos validasi.</p>',
        eventDate: 'bukan-tanggal-valid',
      });

      // Preprocessor mengubah invalid date string menjadi null
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.eventDate).toBeNull();
      }
    });

    it('harus menolak payload kosong tanpa required fields', () => {
      const result = EventSchema.safeParse({});

      expect(result.success).toBe(false);
      if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
        expect(errors.title).toBeDefined();
        expect(errors.content).toBeDefined();
      }
    });
  });
});
