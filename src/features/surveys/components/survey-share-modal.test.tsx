import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import SurveyShareModal from './survey-share-modal';
import type { MonthlySurveyStat } from '../types';

// html-to-image di-mock karena memerlukan DOM painting engine nyata
vi.mock('html-to-image', () => ({
  toPng: vi.fn().mockResolvedValue('data:image/png;base64,mock-png-data'),
}));

// Mock share-utils copy function untuk environment test jsdom
vi.mock('@/components/ui/share/share-utils', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/components/ui/share/share-utils')>();
  return {
    ...actual,
    copyUrlToClipboard: vi.fn().mockResolvedValue(true),
  };
});

describe('SurveyShareModal (Component Test)', () => {
  const mockStat: MonthlySurveyStat = {
    monthKey: '2026-11',
    monthLabel: 'November 2026',
    year: 2026,
    month: 11,
    totalRespondents: 20,
    ikmScore: 90.0,
    ikmGrade: 'A',
    ikmCategory: 'Sangat Baik',
    nrrTertimbang: 3.6,
    questionAverages: [],
  };

  const onCloseMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    global.URL.createObjectURL = vi.fn().mockReturnValue('blob:mock');
    global.URL.revokeObjectURL = vi.fn();
  });

  it('1. tidak merender apa pun saat isOpen = false', () => {
    render(
      <SurveyShareModal stat={mockStat} isOpen={false} onClose={onCloseMock} pageUrl="https://klinik.com/survei/hasil" />
    );
    expect(screen.queryByText('Bagikan Infografis IKM')).not.toBeInTheDocument();
  });

  it('2. merender modal dengan semua tombol aksi saat isOpen = true', () => {
    render(
      <SurveyShareModal stat={mockStat} isOpen={true} onClose={onCloseMock} pageUrl="https://klinik.com/survei/hasil" />
    );
    expect(screen.getByText('Bagikan Infografis IKM')).toBeInTheDocument();
    expect(screen.getByText(/Download Gambar/i)).toBeInTheDocument();
    expect(screen.getByText(/Bagikan via WhatsApp/i)).toBeInTheDocument();
    expect(screen.getByText(/Salin Tautan/i)).toBeInTheDocument();
  });

  it('3. memanggil onClose saat tombol X ditekan', () => {
    render(
      <SurveyShareModal stat={mockStat} isOpen={true} onClose={onCloseMock} pageUrl="https://klinik.com/survei/hasil" />
    );
    const closeBtn = screen.getByTitle(/close|tutup/i);
    fireEvent.click(closeBtn);
    expect(onCloseMock).toHaveBeenCalled();
  });

  it('4. tombol Salin Tautan menampilkan konfirmasi setelah diklik', async () => {
    render(
      <SurveyShareModal stat={mockStat} isOpen={true} onClose={onCloseMock} pageUrl="https://klinik.com/survei/hasil" />
    );
    const copyBtn = screen.getByText(/Salin Tautan/i);
    fireEvent.click(copyBtn);

    await waitFor(() => {
      expect(screen.getByText(/berhasil disalin/i)).toBeInTheDocument();
    });
  });
});
