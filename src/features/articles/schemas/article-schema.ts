import { z } from 'zod';
import { ARTICLE_CATEGORIES } from '@/lib/constants';

/**
 * Skema validasi Zod untuk pembuatan dan pembaruan artikel kesehatan.
 * Mengikuti Bab 5 & 6 HANDBOOK_CLEANCODE.md
 */
export const ArticleSchema = z.object({
  id: z.coerce.number().optional().nullable(),
  title: z
    .string()
    .trim()
    .min(3, 'Judul artikel minimal 3 karakter.')
    .max(200, 'Judul artikel maksimal 200 karakter.'),
  summary: z
    .string()
    .trim()
    .min(10, 'Ringkasan minimal 10 karakter.')
    .max(500, 'Ringkasan maksimal 500 karakter.'),
  content: z
    .string()
    .trim()
    .min(20, 'Isi artikel minimal 20 karakter.')
    .max(100_000, 'Isi artikel terlalu panjang.'),
  category: z.enum(ARTICLE_CATEGORIES),
  status: z.enum(['PUBLISHED', 'DRAFT']).default('DRAFT'),
});

export type ArticleFormValues = z.infer<typeof ArticleSchema>;
