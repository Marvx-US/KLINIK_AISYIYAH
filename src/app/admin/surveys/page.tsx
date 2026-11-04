import React from 'react';
import type { Metadata } from 'next';
import { getSurveyAnalytics, getSurveyResponses } from '@/features/surveys/queries/get-surveys';
import SurveyDashboardView from '@/features/surveys/components/survey-dashboard-view';
import { env } from '@/lib/env';

export const metadata: Metadata = {
  title: 'Survei Kepuasan Pasien - Admin Klinik Aisyiyah',
};

export const dynamic = 'force-dynamic';

export default async function AdminSurveysPage() {
  const [analytics, responses] = await Promise.all([
    getSurveyAnalytics(),
    getSurveyResponses(200),
  ]);

  const baseUrl = env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const surveyUrl = `${baseUrl.replace(/\/+$/, '')}/survei`;

  return (
    <SurveyDashboardView
      analytics={analytics}
      responses={responses}
      surveyUrl={surveyUrl}
    />
  );
}

