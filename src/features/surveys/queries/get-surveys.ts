import 'server-only';
import { db } from '@/lib/db';
import { SURVEY_QUESTIONS } from '../constants';
import type {
  SurveyAnalyticsSummary,
  SurveyResponseItem,
  PublicSurveyResultsPayload,
  MonthlySurveyStat,
  QuestionAverageItem,
} from '../types';

function calculateGrade(ikmScore: number): {
  grade: 'A' | 'B' | 'C' | 'D';
  category: string;
} {
  if (ikmScore >= 88.31) {
    return { grade: 'A', category: 'Sangat Baik' };
  }
  if (ikmScore >= 76.61) {
    return { grade: 'B', category: 'Baik' };
  }
  if (ikmScore >= 65.0) {
    return { grade: 'C', category: 'Kurang Baik' };
  }
  return { grade: 'D', category: 'Tidak Baik' };
}

function calculateUnsurGrade(score: number): 'A' | 'B' | 'C' | 'D' {
  if (score >= 3.5324) return 'A';
  if (score >= 3.0644) return 'B';
  if (score >= 2.6) return 'C';
  return 'D';
}

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

    const totalScore = Object.values(sums).reduce((a, b) => a + b, 0);
    const nrr = totalScore / (9 * totalRespondents);
    const ikmScore = Number((nrr * 25).toFixed(2));
    const { grade, category } = calculateGrade(ikmScore);

    return {
      totalRespondents,
      ikmScore,
      ikmGrade: grade,
      ikmCategory: category,
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

export async function getMonthlySurveyStats(): Promise<PublicSurveyResultsPayload> {
  try {
    const responses = await db.surveyResponse.findMany({
      select: {
        q1: true,
        q2: true,
        q3: true,
        q4: true,
        q5: true,
        q6: true,
        q7: true,
        q8: true,
        q9: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (responses.length === 0) {
      return {
        availableMonths: [],
        selectedMonth: '',
        monthlyStats: {},
        allTimeSummary: {
          totalRespondents: 0,
          ikmScore: 0,
          ikmGrade: 'D',
          ikmCategory: 'Belum Ada Data',
          questionAverages: [],
        },
      };
    }

    // Kelompokkan per bulan "YYYY-MM"
    type MonthGroup = {
      year: number;
      month: number;
      responses: typeof responses;
    };
    const groups: Record<string, MonthGroup> = {};

    responses.forEach((r) => {
      const d = new Date(r.createdAt);
      const year = d.getFullYear();
      const month = d.getMonth() + 1;
      const key = `${year}-${String(month).padStart(2, '0')}`;

      if (!groups[key]) {
        groups[key] = { year, month, responses: [] };
      }
      groups[key].responses.push(r);
    });

    const sortedMonthKeys = Object.keys(groups).sort().reverse();
    const monthlyStats: Record<string, MonthlySurveyStat> = {};
    const availableMonths: { monthKey: string; monthLabel: string }[] = [];

    sortedMonthKeys.forEach((key) => {
      const { year, month, responses: monthResp } = groups[key];
      const dateObj = new Date(year, month - 1, 1);
      const monthLabel = dateObj.toLocaleDateString('id-ID', {
        month: 'long',
        year: 'numeric',
      });

      availableMonths.push({ monthKey: key, monthLabel });

      const total = monthResp.length;
      const sums = { q1: 0, q2: 0, q3: 0, q4: 0, q5: 0, q6: 0, q7: 0, q8: 0, q9: 0 };
      monthResp.forEach((r) => {
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

      const questionAverages: QuestionAverageItem[] = SURVEY_QUESTIONS.map((q) => {
        const avg = Number((sums[q.id] / total).toFixed(2));
        const percentage = Number(((avg / 4) * 100).toFixed(1));
        return {
          questionId: q.id,
          title: q.title,
          shortLabel: q.shortLabel,
          unsurCode: q.unsurCode,
          averageScore: avg,
          percentage,
          grade: calculateUnsurGrade(avg),
        };
      });

      const totalScore = Object.values(sums).reduce((a, b) => a + b, 0);
      const nrrTertimbang = Number((totalScore / (9 * total)).toFixed(3));
      const ikmScore = Number((nrrTertimbang * 25).toFixed(2));
      const { grade, category } = calculateGrade(ikmScore);

      monthlyStats[key] = {
        monthKey: key,
        monthLabel,
        year,
        month,
        totalRespondents: total,
        ikmScore,
        ikmGrade: grade,
        ikmCategory: category,
        nrrTertimbang,
        questionAverages,
      };
    });

    // Hitung all time summary
    const totalAll = responses.length;
    const sumsAll = { q1: 0, q2: 0, q3: 0, q4: 0, q5: 0, q6: 0, q7: 0, q8: 0, q9: 0 };
    responses.forEach((r) => {
      sumsAll.q1 += r.q1;
      sumsAll.q2 += r.q2;
      sumsAll.q3 += r.q3;
      sumsAll.q4 += r.q4;
      sumsAll.q5 += r.q5;
      sumsAll.q6 += r.q6;
      sumsAll.q7 += r.q7;
      sumsAll.q8 += r.q8;
      sumsAll.q9 += r.q9;
    });

    const totalScoreAll = Object.values(sumsAll).reduce((a, b) => a + b, 0);
    const nrrAll = totalScoreAll / (9 * totalAll);
    const ikmScoreAll = Number((nrrAll * 25).toFixed(2));
    const { grade: gradeAll, category: categoryAll } = calculateGrade(ikmScoreAll);

    return {
      availableMonths,
      selectedMonth: sortedMonthKeys[0] || '',
      monthlyStats,
      allTimeSummary: {
        totalRespondents: totalAll,
        ikmScore: ikmScoreAll,
        ikmGrade: gradeAll,
        ikmCategory: categoryAll,
        questionAverages: SURVEY_QUESTIONS.map((q) => ({
          questionId: q.id,
          title: q.title,
          averageScore: Number((sumsAll[q.id] / totalAll).toFixed(2)),
        })),
      },
    };
  } catch (error) {
    console.error('[DAL_GET_MONTHLY_SURVEY_STATS_ERROR]:', error);
    return {
      availableMonths: [],
      selectedMonth: '',
      monthlyStats: {},
      allTimeSummary: {
        totalRespondents: 0,
        ikmScore: 0,
        ikmGrade: 'D',
        ikmCategory: 'Terjadi Kesalahan',
        questionAverages: [],
      },
    };
  }
}
