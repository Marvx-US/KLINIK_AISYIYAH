import { describe, it, expect } from 'vitest';
import { ArticleSchema } from '@/features/articles/schemas/article-schema';
import { serviceSchema } from '@/features/services/schemas/service-schema';
import { EventSchema } from '@/features/events/schemas/event-schema';

describe('Zod Schemas (Bab 5 & 12.1 Unit Testing)', () => {
  describe('ArticleSchema', () => {
    it('should validate a correct article payload', () => {
      const validPayload = {
        title: 'Tips Menjaga Tekanan Darah Normal',
        summary: 'Ringkasan penting tentang pola hidup sehat dan pencegahan hipertensi.',
        content: '<p>Hipertensi adalah kondisi medis yang perlu dipantau secara berkala oleh tenaga kesehatan.</p>',
        category: 'Gaya Hidup',
        status: 'PUBLISHED',
      };

      const result = ArticleSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
    });

    it('should reject when title is too short (< 3 characters)', () => {
      const invalidPayload = {
        title: 'Hi',
        summary: 'Ringkasan penting tentang pola hidup sehat dan pencegahan hipertensi.',
        content: '<p>Hipertensi adalah kondisi medis yang perlu dipantau secara berkala oleh tenaga kesehatan.</p>',
        category: 'Gaya Hidup',
      };

      const result = ArticleSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.title).toBeDefined();
      }
    });

    it('should reject invalid categories not in master list', () => {
      const invalidPayload = {
        title: 'Judul Artikel Kesehatan',
        summary: 'Ringkasan penting tentang pola hidup sehat dan pencegahan hipertensi.',
        content: '<p>Hipertensi adalah kondisi medis yang perlu dipantau secara berkala oleh tenaga kesehatan.</p>',
        category: 'KategoriIlegal',
      };

      const result = ArticleSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });
  });

  describe('serviceSchema', () => {
    it('should validate a complete valid service payload', () => {
      const validPayload = {
        name: 'Poli Umum',
        description: 'Layanan pemeriksaan kesehatan umum untuk segala usia dengan dokter berpengalaman.',
        iconName: 'Stethoscope',
        isActive: true,
        operationalHours: 'Senin - Sabtu: 08:00 - 20:00',
      };

      const result = serviceSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
    });

    it('should reject empty service name or description', () => {
      const invalidPayload = {
        name: '',
        description: '',
        iconName: 'Heart',
      };

      const result = serviceSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.name).toBeDefined();
        expect(result.error.flatten().fieldErrors.description).toBeDefined();
      }
    });
  });

  describe('EventSchema', () => {
    it('should validate a proper event payload with date string parsing', () => {
      const validPayload = {
        title: 'Donor Darah Peduli Sesama',
        content: 'Kegiatan donor darah massal terbuka untuk umum bekerja sama dengan PMI.',
        location: 'Aula Utama Klinik Aisyiyah',
        status: 'PUBLISHED',
        eventDate: '2026-11-10T09:00:00.000Z',
      };

      const result = EventSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.eventDate).toBeInstanceOf(Date);
      }
    });

    it('should reject when content is shorter than 10 characters', () => {
      const invalidPayload = {
        title: 'Vaksinasi Gratis',
        content: 'Pendek',
      };

      const result = EventSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.content).toBeDefined();
      }
    });
  });
});
