import { z } from 'zod';

export const facilitySchema = z.object({
  id: z.number().int().positive().optional().nullable(),
  name: z
    .string()
    .trim()
    .min(1, 'Nama fasilitas wajib diisi')
    .max(100, 'Nama fasilitas maksimal 100 karakter'),
  description: z
    .string()
    .trim()
    .min(1, 'Deskripsi fasilitas wajib diisi')
    .max(500, 'Deskripsi fasilitas maksimal 500 karakter'),
  isActive: z.boolean().default(true),
});

export type FacilityFormData = z.infer<typeof facilitySchema>;
