import { z } from 'zod';

export const bannerSchema = z.object({
  id: z.number().int().positive().optional().nullable(),
  title: z
    .string()
    .trim()
    .min(1, 'Judul banner wajib diisi')
    .max(150, 'Judul banner maksimal 150 karakter'),
  isActive: z.boolean().default(true),
});

export type BannerFormData = z.infer<typeof bannerSchema>;
