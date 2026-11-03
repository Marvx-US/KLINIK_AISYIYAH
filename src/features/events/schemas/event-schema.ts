import { z } from 'zod';

/**
 * Skema validasi Zod untuk pembuatan dan pembaruan agenda/kegiatan klinik.
 * Mengikuti Bab 5 & 6 HANDBOOK_CLEANCODE.md
 */
export const EventSchema = z.object({
  id: z.coerce.number().optional().nullable(),
  title: z
    .string()
    .trim()
    .min(3, 'Judul kegiatan minimal 3 karakter.')
    .max(200, 'Judul kegiatan maksimal 200 karakter.'),
  content: z
    .string()
    .trim()
    .min(10, 'Isi deskripsi kegiatan minimal 10 karakter.')
    .max(100_000, 'Isi konten terlalu panjang.'),
  location: z
    .string()
    .trim()
    .max(300, 'Lokasi maksimal 300 karakter.')
    .optional()
    .nullable(),
  status: z.enum(['PUBLISHED', 'DRAFT']).default('DRAFT'),
  eventDate: z
    .preprocess((arg) => {
      if (typeof arg === 'string' && arg.trim() !== '') {
        const d = new Date(arg);
        return isNaN(d.getTime()) ? null : d;
      }
      return arg instanceof Date ? arg : null;
    }, z.date().optional().nullable())
    .optional()
    .nullable(),
});

export type EventFormValues = z.infer<typeof EventSchema>;
