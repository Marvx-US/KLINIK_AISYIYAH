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
  ];

  it('1. harus menangani kondisi array kosong tanpa crash', () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    exportSurveysToExcel({ responses: [] });
    expect(alertSpy).toHaveBeenCalled();
    alertSpy.mockRestore();
  });

  it('2. harus membuat blob dan memicu download link di DOM saat ada data', () => {
    const appendSpy = vi.spyOn(document.body, 'appendChild');
    const removeSpy = vi.spyOn(document.body, 'removeChild');

    // Mock URL.createObjectURL
    global.URL.createObjectURL = vi.fn().mockReturnValue('blob:dummy-url');

    exportSurveysToExcel({
      responses: mockResponses,
      startDate: '2026-11-01',
      endDate: '2026-11-04',
      serviceFilter: 'Poli Umum',
    });

    expect(global.URL.createObjectURL).toHaveBeenCalled();
    expect(appendSpy).toHaveBeenCalled();
    expect(removeSpy).toHaveBeenCalled();

    appendSpy.mockRestore();
    removeSpy.mockRestore();
  });
});
