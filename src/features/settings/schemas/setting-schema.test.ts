import { describe, it, expect } from 'vitest';
import {
  ClinicDescriptionSchema,
  VisionMissionSchema,
} from './setting-schema';

describe('setting schemas Validation (Bab 4.2 Unit Testing)', () => {
  describe('ClinicDescriptionSchema', () => {
    it('harus meluluskan deskripsi klinik yang valid', () => {
      const payload = {
        description: 'Klinik Pratama Aisyiyah melayani masyarakat dengan sepenuh hati.',
      };

      const result = ClinicDescriptionSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    it('harus menolak deskripsi klinik yang kosong atau melebihi 2000 karakter', () => {
      expect(ClinicDescriptionSchema.safeParse({ description: '' }).success).toBe(false);
      expect(ClinicDescriptionSchema.safeParse({ description: 'k'.repeat(2001) }).success).toBe(false);
    });
  });

  describe('VisionMissionSchema', () => {
    it('harus meluluskan visi dan misi yang valid', () => {
      const payload = {
        vision: 'Menjadi klinik pilihan utama masyarakat.',
        mission: 'Memberikan pelayanan kesehatan bermutu dan islami.',
      };

      const result = VisionMissionSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    it('harus menolak jika visi atau misi kosong atau melebihi batas', () => {
      expect(VisionMissionSchema.safeParse({ vision: '', mission: 'Misi' }).success).toBe(false);
      expect(VisionMissionSchema.safeParse({ vision: 'Visi', mission: '' }).success).toBe(false);
      expect(VisionMissionSchema.safeParse({ vision: 'v'.repeat(1001), mission: 'Misi' }).success).toBe(false);
      expect(VisionMissionSchema.safeParse({ vision: 'Visi', mission: 'm'.repeat(3001) }).success).toBe(false);
    });
  });
});
