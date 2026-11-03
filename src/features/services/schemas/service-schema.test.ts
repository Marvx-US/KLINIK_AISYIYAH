import { describe, it, expect } from 'vitest';
import { serviceSchema } from './service-schema';

// =============================================================
// Unit Tests — serviceSchema (Zod)
// Sesuai Lapis 2 HANDBOOK_TESTING.MD
// Mencakup: Happy Path, Boundary Values, Field Opsional
// =============================================================

describe('serviceSchema — validasi layanan klinik', () => {
  // ─── HAPPY PATH ─────────────────────────────────────────────
  describe('Happy Path — payload valid', () => {
    it('harus meluluskan payload layanan baru dengan field wajib saja', () => {
      // Arrange
      const validPayload = {
        name: 'Poli Umum Terpadu',
        description: 'Layanan pemeriksaan kesehatan dasar oleh dokter umum berpengalaman.',
        iconName: 'Stethoscope',
        isActive: true,
      };

      // Act
      const result = serviceSchema.safeParse(validPayload);

      // Assert
      expect(result.success).toBe(true);
    });

    it('harus meluluskan payload edit layanan dengan id yang valid', () => {
      const result = serviceSchema.safeParse({
        id: 5,
        name: 'IGD 24 Jam',
        description: 'Instalasi Gawat Darurat yang beroperasi 24 jam sehari, 7 hari seminggu.',
        iconName: 'HeartPulse',
        isActive: true,
      });

      expect(result.success).toBe(true);
    });

    it('harus meluluskan payload dengan semua field opsional terisi', () => {
      const result = serviceSchema.safeParse({
        name: 'Poli Gigi',
        description: 'Layanan kesehatan gigi dan mulut komprehensif oleh dokter gigi.',
        iconName: 'Smile',
        isActive: true,
        purpose: 'Menjaga kesehatan gigi pasien.',
        benefits: 'Peralatan modern dan steril.',
        facilities: 'Dental unit terkini.',
        operationalHours: 'Senin-Sabtu 16.00-18.00',
        preparation: 'Sikat gigi sebelum datang.',
        procedures: 'Scaling, tambal, cabut.',
        faq: 'FAQ tentang perawatan gigi.',
        priceList: 'Scaling: Rp200.000',
      });

      expect(result.success).toBe(true);
    });

    it('harus default isActive menjadi true jika tidak disediakan', () => {
      const result = serviceSchema.safeParse({
        name: 'Poli KIA',
        description: 'Layanan Kesehatan Ibu dan Anak yang komprehensif.',
        iconName: 'Baby',
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.isActive).toBe(true);
      }
    });
  });

  // ─── BOUNDARY VALUES ────────────────────────────────────────
  describe('Boundary Values — nilai batas', () => {
    it('harus menolak name yang kosong (< 1 karakter)', () => {
      const result = serviceSchema.safeParse({
        name: '',
        description: 'Deskripsi yang cukup panjang.',
        iconName: 'Activity',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.name).toBeDefined();
      }
    });

    it('harus meluluskan name dengan tepat 1 karakter (batas minimum)', () => {
      const result = serviceSchema.safeParse({
        name: 'A',
        description: 'Deskripsi layanan yang valid.',
        iconName: 'Activity',
      });

      expect(result.success).toBe(true);
    });

    it('harus menolak name yang melebihi 100 karakter', () => {
      const result = serviceSchema.safeParse({
        name: 'N'.repeat(101),
        description: 'Deskripsi layanan yang valid.',
        iconName: 'Activity',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.name).toBeDefined();
      }
    });

    it('harus menolak description yang kosong (< 1 karakter)', () => {
      const result = serviceSchema.safeParse({
        name: 'Nama Layanan',
        description: '',
        iconName: 'Activity',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.description).toBeDefined();
      }
    });

    it('harus menolak description yang melebihi 2000 karakter', () => {
      const result = serviceSchema.safeParse({
        name: 'Nama Layanan',
        description: 'D'.repeat(2001),
        iconName: 'Activity',
      });

      expect(result.success).toBe(false);
    });

    it('harus menolak iconName yang kosong', () => {
      const result = serviceSchema.safeParse({
        name: 'Nama Layanan',
        description: 'Deskripsi yang valid.',
        iconName: '',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.iconName).toBeDefined();
      }
    });
  });

  // ─── INPUT TIDAK VALID ───────────────────────────────────────
  describe('Input Tidak Valid — edge cases', () => {
    it('harus menolak name berupa spasi saja karena .trim()', () => {
      const result = serviceSchema.safeParse({
        name: '    ',
        description: 'Deskripsi yang valid.',
        iconName: 'Activity',
      });

      expect(result.success).toBe(false);
    });

    it('harus menolak id yang bukan angka integer positif', () => {
      const result = serviceSchema.safeParse({
        id: -1,
        name: 'Nama Layanan',
        description: 'Deskripsi layanan yang valid.',
        iconName: 'Activity',
      });

      expect(result.success).toBe(false);
    });

    it('harus menolak id angka nol', () => {
      const result = serviceSchema.safeParse({
        id: 0,
        name: 'Nama Layanan',
        description: 'Deskripsi layanan yang valid.',
        iconName: 'Activity',
      });

      expect(result.success).toBe(false);
    });

    it('harus menolak payload kosong tanpa required fields', () => {
      const result = serviceSchema.safeParse({});

      expect(result.success).toBe(false);
      if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
        expect(errors.name).toBeDefined();
        expect(errors.description).toBeDefined();
        expect(errors.iconName).toBeDefined();
      }
    });
  });
});
