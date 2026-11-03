import { z } from 'zod';

export const scheduleSchema = z.object({
  id: z.number().int().positive().optional().nullable(),
  poli: z
    .string()
    .trim()
    .min(1, 'Nama poli wajib diisi')
    .max(100, 'Nama poli maksimal 100 karakter'),
  doctorName: z
    .string()
    .trim()
    .min(1, 'Nama dokter wajib diisi')
    .max(100, 'Nama dokter maksimal 100 karakter'),
  scheduleInfo: z
    .string()
    .trim()
    .min(1, 'Informasi jadwal wajib diisi')
    .max(500, 'Informasi jadwal maksimal 500 karakter'),
});

export type ScheduleFormData = z.infer<typeof scheduleSchema>;
