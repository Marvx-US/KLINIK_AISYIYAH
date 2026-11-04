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

