import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getSurveyResponses, getSurveyAnalytics, getMonthlySurveyStats } from './get-surveys';
import { db } from '@/lib/db';

vi.mock('@/lib/db', () => ({
  db: {
    surveyResponse: {
      findMany: vi.fn(),
    },
  },
}));

describe('get-surveys DAL (Unit Test)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockDbData = [
    {
      id: 1,
      respondentName: 'Ahmad',
      contactNumber: '08123456789',
      gender: 'L',
      age: 30,
      education: 'S1',
      occupation: 'PNS',
      serviceReceived: 'Poli Umum',
      q1: 4,
      q2: 4,
      q3: 4,
      q4: 4,
      q5: 4,
      q6: 4,
      q7: 4,
      q8: 4,
      q9: 4,
      feedback: 'Mantap',
      createdAt: new Date('2026-11-01T10:00:00Z'),
    },
    {
      id: 2,
      respondentName: 'Siti',
      contactNumber: '08987654321',
      gender: 'P',
      age: 28,
      education: 'SMA',
      occupation: 'SWASTA',
      serviceReceived: 'Poli Gigi & Mulut',
      q1: 3,
      q2: 3,
      q3: 3,
      q4: 3,
      q5: 3,
      q6: 3,
      q7: 3,
      q8: 3,
      q9: 3,
      feedback: 'Bagus',
      createdAt: new Date('2026-10-15T08:00:00Z'),
    },
  ];

  it('1. getSurveyResponses harus mengembalikan data respon', async () => {
    vi.mocked(db.surveyResponse.findMany).mockResolvedValueOnce(mockDbData as never);

    const result = await getSurveyResponses(10);
    expect(result).toHaveLength(2);
    expect(result[0].respondentName).toBe('Ahmad');
  });

  it('2. getSurveyAnalytics harus menghitung IKM & mutu dengan benar', async () => {
    vi.mocked(db.surveyResponse.findMany).mockResolvedValueOnce(mockDbData as never);

    const analytics = await getSurveyAnalytics();
    expect(analytics.totalRespondents).toBe(2);
    // Rata-rata skor: (4*9 + 3*9) / 18 = 3.5
    // IKM = 3.5 * 25 = 87.5
    expect(analytics.ikmScore).toBe(87.5);
    expect(analytics.ikmGrade).toBe('B');
    expect(analytics.ikmCategory).toBe('Baik');
  });

  it('3. getMonthlySurveyStats harus mengelompokkan data per bulan dengan akurat', async () => {
    vi.mocked(db.surveyResponse.findMany).mockResolvedValueOnce(mockDbData as never);

    const result = await getMonthlySurveyStats();
    expect(result.availableMonths).toHaveLength(2);
    expect(result.availableMonths[0].monthKey).toBe('2026-11');
    expect(result.availableMonths[1].monthKey).toBe('2026-10');

    const novStat = result.monthlyStats['2026-11'];
    expect(novStat).toBeDefined();
    expect(novStat.totalRespondents).toBe(1);
    expect(novStat.ikmScore).toBe(100);
    expect(novStat.ikmGrade).toBe('A');
    expect(novStat.questionAverages).toHaveLength(9);
    expect(novStat.questionAverages[0].unsurCode).toBe('U1');
  });

  it('4. getMonthlySurveyStats harus menangani kondisi tanpa data secara aman', async () => {
    vi.mocked(db.surveyResponse.findMany).mockResolvedValueOnce([] as never);

    const result = await getMonthlySurveyStats();
    expect(result.availableMonths).toHaveLength(0);
    expect(result.allTimeSummary.totalRespondents).toBe(0);
  });
});

