import { z } from 'zod';

export const ClinicDescriptionSchema = z.object({
  description: z
    .string()
    .min(1, 'Deskripsi klinik tidak boleh kosong.')
    .max(2000, 'Deskripsi klinik maksimal 2000 karakter.'),
});

export const VisionMissionSchema = z.object({
  vision: z
    .string()
    .min(1, 'Visi klinik tidak boleh kosong.')
    .max(1000, 'Visi klinik maksimal 1000 karakter.'),
  mission: z
    .string()
    .min(1, 'Misi klinik tidak boleh kosong.')
    .max(3000, 'Misi klinik maksimal 3000 karakter.'),
});

export type ClinicDescriptionInput = z.infer<typeof ClinicDescriptionSchema>;
export type VisionMissionInput = z.infer<typeof VisionMissionSchema>;
