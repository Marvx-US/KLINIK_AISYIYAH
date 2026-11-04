import { z } from 'zod';
import {
  EDUCATION_OPTIONS,
  OCCUPATION_OPTIONS,
} from '../constants';

export const SurveySubmissionSchema = z.object({
  respondentName: z
    .string()
    .trim()
    .min(2, 'Nama minimal 2 karakter')
    .max(100, 'Nama maksimal 100 karakter'),
  contactNumber: z
    .string()
    .trim()
    .min(8, 'Nomor kontak minimal 8 digit')
    .max(20, 'Nomor kontak maksimal 20 digit')
    .regex(/^[0-9+\-\s()]+$/, 'Format nomor kontak tidak valid'),
  gender: z.enum(['L', 'P'], {
    error: 'Pilih jenis kelamin',
  }),
  age: z.coerce
    .number({
      error: 'Umur harus berupa angka',
    })
    .int('Umur harus bilangan bulat')
    .min(10, 'Umur minimal 10 tahun')
    .max(120, 'Umur tidak valid'),
  education: z.enum(EDUCATION_OPTIONS, {
    error: 'Pilih jenjang pendidikan',
  }),
  occupation: z.enum(OCCUPATION_OPTIONS, {
    error: 'Pilih pekerjaan',
  }),
  occupationOther: z.string().trim().max(100).optional(),
  serviceReceived: z
    .string()
    .trim()
    .min(2, 'Pilih atau sebutkan layanan yang diterima')
    .max(100, 'Nama layanan maksimal 100 karakter'),
  q1: z.coerce.number().int().min(1).max(4),
  q2: z.coerce.number().int().min(1).max(4),
  q3: z.coerce.number().int().min(1).max(4),
  q4: z.coerce.number().int().min(1).max(4),
  q5: z.coerce.number().int().min(1).max(4),
  q6: z.coerce.number().int().min(1).max(4),
  q7: z.coerce.number().int().min(1).max(4),
  q8: z.coerce.number().int().min(1).max(4),
  q9: z.coerce.number().int().min(1).max(4),
  feedback: z.string().trim().max(1000).optional(),
});

export type SurveySubmissionInput = z.infer<typeof SurveySubmissionSchema>;

