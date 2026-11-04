import { describe, it, expect, vi } from 'vitest';
import { exportSurveysToExcel } from './export-excel';
import type { SurveyResponseItem } from '../types';

describe('exportSurveysToExcel (Unit Test)', () => {
  const mockResponses: SurveyResponseItem[] = [
    {
      id: 1,
      respondentName: 'Hj. Fatimah',
      contactNumber: '081234567890',
      gender: 'P',
      age: 48,
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
      feedback: 'Sangat memuaskan dan cepat.',
      createdAt: new Date('2026-11-04T08:30:00Z'),
    },
    {
      id: 2,
      respondentName: 'Ahmad Faisal',
      contactNumber: '085211223344',
      gender: 'L',
      age: 32,
      education: 'SMA',
      occupation: 'LAINNYA',
      occupationOther: 'Petani Modern',
      serviceReceived: 'Laboratorium Klinis',
      q1: 3,
      q2: 3,
      q3: 3,
      q4: 3,
      q5: 3,
      q6: 3,
      q7: 4,
      q8: 3,
      q9: 3,
      feedback: 'Pelayanan lab sangat ramah.',
      createdAt: new Date('2026-11-04T09:15:00Z'),
    },
  ];

  it('1. harus menangani kondisi array kosong tanpa crash dan memanggil alert', () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    exportSurveysToExcel({ responses: [] });
    expect(alertSpy).toHaveBeenCalledWith('Tidak ada data survei pada rentang waktu yang dipilih.');
    alertSpy.mockRestore();
  });

  it('2. harus membuat blob XLSX dan memicu link download saat ada data', () => {
    const appendSpy = vi.spyOn(document.body, 'appendChild');
    const removeSpy = vi.spyOn(document.body, 'removeChild');
    const revokeSpy = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});

    global.URL.createObjectURL = vi.fn().mockReturnValue('blob:mock-xlsx-url');

    exportSurveysToExcel({
      responses: mockResponses,
      startDate: '2026-11-01',
      endDate: '2026-11-04',
      serviceFilter: 'Poli Umum',
    });

    expect(global.URL.createObjectURL).toHaveBeenCalled();
    expect(appendSpy).toHaveBeenCalled();
    expect(removeSpy).toHaveBeenCalled();
    expect(revokeSpy).toHaveBeenCalled();

    appendSpy.mockRestore();
    removeSpy.mockRestore();
    revokeSpy.mockRestore();
  });
});
