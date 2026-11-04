import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import SurveyResultsPublicView from './survey-results-public-view';
import type { PublicSurveyResultsPayload } from '../types';

describe('SurveyResultsPublicView (Component Test)', () => {
  const mockDataWithValues: PublicSurveyResultsPayload = {
    availableMonths: [
      { monthKey: '2026-11', monthLabel: 'November 2026' },
      { monthKey: '2026-10', monthLabel: 'Oktober 2026' },
    ],
    selectedMonth: '2026-11',
    monthlyStats: {
      '2026-11': {
        monthKey: '2026-11',
        monthLabel: 'November 2026',
        year: 2026,
        month: 11,
        totalRespondents: 15,
        ikmScore: 92.5,
        ikmGrade: 'A',
        ikmCategory: 'Sangat Baik',
        nrrTertimbang: 3.7,
        questionAverages: [
          {
            questionId: 'q1',
            title: 'Persyaratan pelayanan',
            shortLabel: 'Persyaratan Pelayanan',
            unsurCode: 'U1',
            averageScore: 3.8,
            percentage: 95,
            grade: 'A',
          },
        ],
      },
      '2026-10': {
        monthKey: '2026-10',
        monthLabel: 'Oktober 2026',
        year: 2026,
        month: 10,
        totalRespondents: 10,
        ikmScore: 80.0,
        ikmGrade: 'B',
        ikmCategory: 'Baik',
        nrrTertimbang: 3.2,
        questionAverages: [
          {
            questionId: 'q1',
            title: 'Persyaratan pelayanan',
            shortLabel: 'Persyaratan Pelayanan',
            unsurCode: 'U1',
            averageScore: 3.2,
            percentage: 80,
            grade: 'B',
          },
        ],
      },
    },
    allTimeSummary: {
      totalRespondents: 25,
      ikmScore: 86.25,
      ikmGrade: 'B',
      ikmCategory: 'Baik',
      questionAverages: [],
    },
  };

  it('1. harus menampilkan pesan empty state saat tidak ada data survei', () => {
    const emptyData: PublicSurveyResultsPayload = {
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

    render(<SurveyResultsPublicView initialData={emptyData} />);
    expect(screen.getByText('Belum Ada Data Survei')).toBeInTheDocument();
  });

  it('2. harus merender kartu nilai IKM, kategori, dan rincian unsur saat ada data', () => {
    render(<SurveyResultsPublicView initialData={mockDataWithValues} />);

    expect(screen.getByText('92.50')).toBeInTheDocument();
    expect(screen.getByText(/Mutu A • Sangat Baik/i)).toBeInTheDocument();
    expect(screen.getByText('15 Pasien')).toBeInTheDocument();
    expect(screen.getByText('Persyaratan Pelayanan')).toBeInTheDocument();
  });

  it('3. harus memperbarui tampilan data saat pengguna mengubah pilihan bulan', async () => {
    render(<SurveyResultsPublicView initialData={mockDataWithValues} />);

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: '2026-10' } });

    await waitFor(() => {
      expect(screen.getByText('80.00')).toBeInTheDocument();
      expect(screen.getByText(/Mutu B • Baik/i)).toBeInTheDocument();
      expect(screen.getByText('10 Pasien')).toBeInTheDocument();
    });
  });
});
