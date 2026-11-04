import { describe, it, expect } from 'vitest';
import { SurveySubmissionSchema } from './survey-schema';

describe('SurveySubmissionSchema Validation (Unit Test)', () => {
  const validPayload = {
    respondentName: 'Ahmad Dahlan',
    contactNumber: '081234567890',
    gender: 'L',
    age: 35,
    education: 'S1',
    occupation: 'PNS',
    serviceReceived: 'Poli Umum',
    q1: 4,
    q2: 3,
    q3: 4,
    q4: 4,
    q5: 4,
    q6: 3,
    q7: 4,
    q8: 4,
    q9: 4,
    feedback: 'Pelayanan sangat ramah dan memuaskan.',
  };

  it('1. [Happy Path] harus meloloskan data survei yang lengkap dan valid', () => {
    const result = SurveySubmissionSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
  });

  it('2. [Boundary & Edge Case] harus menolak jika nama terlalu pendek (< 2 karakter)', () => {
    const invalid = { ...validPayload, respondentName: 'A' };
    const result = SurveySubmissionSchema.safeParse(invalid);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.respondentName).toBeDefined();
    }
  });

  it('3. [Edge Case] harus menolak nomor kontak dengan format non-digit/karakter tidak valid', () => {
    const invalid = { ...validPayload, contactNumber: 'bukan-nomor-hp' };
    const result = SurveySubmissionSchema.safeParse(invalid);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.contactNumber).toBeDefined();
    }
  });

  it('4. [Boundary] harus menolak jika usia di luar batas wajar (< 10 atau > 120)', () => {
    const tooYoung = { ...validPayload, age: 5 };
    const tooOld = { ...validPayload, age: 150 };

    expect(SurveySubmissionSchema.safeParse(tooYoung).success).toBe(false);
    expect(SurveySubmissionSchema.safeParse(tooOld).success).toBe(false);
  });

  it('5. [Scoring Boundary] harus menolak jika salah satu skor survei di luar rentang 1 - 4', () => {
    const invalidScoreMin = { ...validPayload, q1: 0 };
    const invalidScoreMax = { ...validPayload, q9: 5 };

    expect(SurveySubmissionSchema.safeParse(invalidScoreMin).success).toBe(false);
    expect(SurveySubmissionSchema.safeParse(invalidScoreMax).success).toBe(false);
  });

  it('6. [Enum Validation] harus menolak jika gender atau pendidikan tidak sesuai opsi yang tersedia', () => {
    const invalidGender = { ...validPayload, gender: 'X' };
    const invalidEdu = { ...validPayload, education: 'TK' };

    expect(SurveySubmissionSchema.safeParse(invalidGender).success).toBe(false);
    expect(SurveySubmissionSchema.safeParse(invalidEdu).success).toBe(false);
  });
});

