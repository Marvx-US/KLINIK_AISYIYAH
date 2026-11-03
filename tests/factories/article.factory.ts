import { type Article } from '@prisma/client';

/**
 * Factory untuk membangun data dummy Artikel
 * Sesuai Bab 3.3 HANDBOOK_TESTING.MD — Test Data Factory Pattern
 */
export function buildMockArticle(overrides: Partial<Article> = {}): Article {
  return {
    id: 1,
    title: 'Artikel Kesehatan Test',
    slug: 'artikel-kesehatan-test-1234567890',
    summary: 'Ringkasan artikel kesehatan untuk keperluan pengujian unit dan integrasi.',
    content: '<p>Konten artikel lengkap untuk keperluan pengujian.</p>',
    coverImage: null,
    category: 'Gaya Hidup',
    status: 'DRAFT',
    createdAt: new Date('2026-01-01T00:00:00Z'),
    updatedAt: new Date('2026-01-01T00:00:00Z'),
    ...overrides,
  };
}
