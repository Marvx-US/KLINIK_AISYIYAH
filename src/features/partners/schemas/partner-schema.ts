import { z } from 'zod';

export const partnerSchema = z.object({
  id: z.number().int().positive().optional().nullable(),
  name: z
    .string()
    .trim()
    .min(1, 'Nama mitra wajib diisi')
    .max(100, 'Nama mitra maksimal 100 karakter'),
});

export type PartnerFormData = z.infer<typeof partnerSchema>;
