import { describe, it, expect, vi, beforeEach } from 'vitest';
import { db } from '@/lib/db';
import { getAllSchedules, getActiveSchedules, getScheduleById } from './schedule-queries';

vi.mock('@/lib/db', () => ({
  db: {
    doctorSchedule: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}));

describe('schedule-queries DAL Integration Tests (Bab 2 Lapis 3)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getAllSchedules harus mengurutkan berdasarkan poli asc dan membatasi safeLimit maksimal 50', async () => {
    vi.mocked(db.doctorSchedule.findMany).mockResolvedValueOnce([]);

    await getAllSchedules(80);

    expect(db.doctorSchedule.findMany).toHaveBeenCalledWith({
      orderBy: { poli: 'asc' },
      take: 50,
    });
  });

  it('getActiveSchedules harus memfilter jadwal aktif (isActive: true)', async () => {
    vi.mocked(db.doctorSchedule.findMany).mockResolvedValueOnce([]);

    await getActiveSchedules(30);

    expect(db.doctorSchedule.findMany).toHaveBeenCalledWith({
      where: { isActive: true },
      orderBy: { poli: 'asc' },
      take: 30,
    });
  });

  it('getScheduleById harus mengambil jadwal berdasarkan ID', async () => {
    vi.mocked(db.doctorSchedule.findUnique).mockResolvedValueOnce(null);

    await getScheduleById(12);

    expect(db.doctorSchedule.findUnique).toHaveBeenCalledWith({
      where: { id: 12 },
    });
  });
});
