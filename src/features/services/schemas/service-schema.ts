import { z } from 'zod';

export const serviceSchema = z.object({
  id: z.number().int().positive().optional().nullable(),
  name: z
    .string()
    .trim()
    .min(1, 'Nama layanan wajib diisi')
    .max(100, 'Nama layanan maksimal 100 karakter'),
  description: z
    .string()
    .trim()
    .min(1, 'Deskripsi layanan wajib diisi')
    .max(2000, 'Deskripsi layanan maksimal 2000 karakter'),
  iconName: z
    .string()
    .trim()
    .min(1, 'Nama ikon wajib dipilih')
    .max(50, 'Nama ikon maksimal 50 karakter'),
  isActive: z.boolean().default(true),
  purpose: z.string().trim().optional().nullable(),
  benefits: z.string().trim().optional().nullable(),
  facilities: z.string().trim().optional().nullable(),
  operationalHours: z.string().trim().optional().nullable(),
  preparation: z.string().trim().optional().nullable(),
  procedures: z.string().trim().optional().nullable(),
  faq: z.string().trim().optional().nullable(),
  priceList: z.string().trim().optional().nullable(),
});

export type ServiceFormData = z.infer<typeof serviceSchema>;
