import 'server-only';
import { db } from '@/lib/db';
import { SURVEY_QUESTIONS } from '../constants';
import type { SurveyAnalyticsSummary, SurveyResponseItem } from '../types';

export async function getSurveyResponses(limit = 100): Promise<SurveyResponseItem[]> {
  try {
    const responses = await db.surveyResponse.findMany({
      orderBy: { createdAt: 'desc' },
      take: Math.min(Math.max(1, limit), 200),
    });
    return responses;
  } catch (error) {
    console.error('[DAL_GET_SURVEY_RESPONSES_ERROR]:', error);
    return [];
  }
}

export async function getSurveyAnalytics(): Promise<SurveyAnalyticsSummary> {
  try {
    const responses = await db.surveyResponse.findMany();
    const totalRespondents = responses.length;

    if (totalRespondents === 0) {
      return {
        totalRespondents: 0,
        ikmScore: 0,
        ikmGrade: 'D',
        ikmCategory: 'Belum Ada Data',
        questionAverages: SURVEY_QUESTIONS.map((q) => ({
          questionId: q.id,
          title: q.title,
          averageScore: 0,
        })),
      };
    }

    // Hitung rata-rata per pertanyaan
    const sums = { q1: 0, q2: 0, q3: 0, q4: 0, q5: 0, q6: 0, q7: 0, q8: 0, q9: 0 };
    responses.forEach((r) => {
      sums.q1 += r.q1;
      sums.q2 += r.q2;
      sums.q3 += r.q3;
      sums.q4 += r.q4;
      sums.q5 += r.q5;
      sums.q6 += r.q6;
      sums.q7 += r.q7;
      sums.q8 += r.q8;
      sums.q9 += r.q9;
    });

    const questionAverages = SURVEY_QUESTIONS.map((q) => {
      const avg = Number((sums[q.id] / totalRespondents).toFixed(2));
      return {
        questionId: q.id,
        title: q.title,
        averageScore: avg,
      };
    });

    // Rumus PermenPAN-RB No. 14 Tahun 2017:
    // Nilai Rata-rata Tertimbang (NRR) = Total Skor / (9 unsur * Total Responden)
    // IKM Konversi = NRR * 25 (Skala 25.00 - 100.00)
    const totalScore = Object.values(sums).reduce((a, b) => a + b, 0);
    const nrr = totalScore / (9 * totalRespondents);
    const ikmScore = Number((nrr * 25).toFixed(2));

    let ikmGrade: 'A' | 'B' | 'C' | 'D' = 'D';
    let ikmCategory = 'Tidak Baik';

    if (ikmScore >= 88.31) {
      ikmGrade = 'A';
      ikmCategory = 'Sangat Baik';
    } else if (ikmScore >= 76.61) {
      ikmGrade = 'B';
      ikmCategory = 'Baik';
    } else if (ikmScore >= 65.0) {
      ikmGrade = 'C';
      ikmCategory = 'Kurang Baik';
    } else {
      ikmGrade = 'D';
      ikmCategory = 'Tidak Baik';
    }

    return {
      totalRespondents,
      ikmScore,
      ikmGrade,
      ikmCategory,
      questionAverages,
    };
  } catch (error) {
    console.error('[DAL_GET_SURVEY_ANALYTICS_ERROR]:', error);
    return {
      totalRespondents: 0,
      ikmScore: 0,
      ikmGrade: 'D',
      ikmCategory: 'Terjadi Kesalahan',
      questionAverages: [],
    };
  }
}

