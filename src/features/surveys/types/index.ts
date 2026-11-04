export interface SurveyResponseItem {
  id: number;
  respondentName: string;
  contactNumber: string;
  gender: string;
  age: number;
  education: string;
  occupation: string;
  occupationOther?: string | null;
  serviceReceived: string;
  q1: number;
  q2: number;
  q3: number;
  q4: number;
  q5: number;
  q6: number;
  q7: number;
  q8: number;
  q9: number;
  feedback?: string | null;
  createdAt: Date;
}

export interface QuestionAverageItem {
  questionId: string;
  title: string;
  shortLabel: string;
  unsurCode: string;
  averageScore: number; // 1.00 - 4.00
  percentage: number;   // 25 - 100%
  grade: 'A' | 'B' | 'C' | 'D';
}

export interface SurveyAnalyticsSummary {
  totalRespondents: number;
  ikmScore: number; // Nilai IKM (Skala 25 - 100)
  ikmGrade: 'A' | 'B' | 'C' | 'D';
  ikmCategory: string; // 'Sangat Baik' | 'Baik' | 'Kurang Baik' | 'Tidak Baik'
  questionAverages: {
    questionId: string;
    title: string;
    averageScore: number; // 1.00 - 4.00
  }[];
}

export interface MonthlySurveyStat {
  monthKey: string;      // e.g. "2026-11"
  monthLabel: string;    // e.g. "November 2026"
  year: number;
  month: number;
  totalRespondents: number;
  ikmScore: number;
  ikmGrade: 'A' | 'B' | 'C' | 'D';
  ikmCategory: string;
  nrrTertimbang: number;
  questionAverages: QuestionAverageItem[];
}

export interface PublicSurveyResultsPayload {
  availableMonths: { monthKey: string; monthLabel: string }[];
  selectedMonth: string;
  monthlyStats: Record<string, MonthlySurveyStat>;
  allTimeSummary: SurveyAnalyticsSummary;
}
