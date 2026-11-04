import { describe, it, expect, vi, beforeEach } from 'vitest';
import { submitSurvey } from './submit-survey';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

vi.mock('@/lib/db', () => ({
  db: {
    surveyResponse: {
      create: vi.fn(),
    },
  },
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

describe('submitSurvey Server Action (Integration Test)', () => {
  const validInput = {
    respondentName: 'Siti Rahma',
    contactNumber: '085211223344',
    gender: 'P',
    age: 29,
    education: 'D3',
    occupation: 'WIRAUSAHA',
    serviceReceived: 'Poli KIA & KB',
    q1: 4,
    q2: 4,
    q3: 3,
    q4: 4,
    q5: 4,
    q6: 4,
    q7: 4,
    q8: 4,
    q9: 4,
    feedback: 'Pelayanan bidan sangat cekatan dan ramah.',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('1. [Zod Validation Failure] harus menolak jika data masukan tidak lengkap atau salah tipe', async () => {
    const invalidInput = { ...validInput, respondentName: '' };
    const res = await submitSurvey(invalidInput);

    expect(res.success).toBe(false);
    expect(res.fieldErrors?.respondentName).toBeDefined();
    expect(db.surveyResponse.create).not.toHaveBeenCalled();
  });

  it('2. [Happy Path] harus berhasil menyimpan tanggapan survei dan me-revalidate path admin', async () => {
    vi.mocked(db.surveyResponse.create).mockResolvedValueOnce({
      id: 101,
    } as unknown as Awaited<ReturnType<typeof db.surveyResponse.create>>);

    const res = await submitSurvey(validInput);

    expect(res.success).toBe(true);
    expect(res.data?.id).toBe(101);
    expect(db.surveyResponse.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          respondentName: 'Siti Rahma',
          contactNumber: '085211223344',
          q1: 4,
        }),
      })
    );
    expect(revalidatePath).toHaveBeenCalledWith('/admin/surveys');
  });

  it('3. [DB Exception] harus menangani kegagalan database secara elegan tanpa unhandled exception', async () => {
    vi.mocked(db.surveyResponse.create).mockRejectedValueOnce(new Error('DB Connection Timeout'));

    const res = await submitSurvey(validInput);

    expect(res.success).toBe(false);
    expect(res.message).toContain('kesalahan');
  });
});

