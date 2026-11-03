import { describe, it, expect, vi, beforeEach } from 'vitest';
import { db } from '@/lib/db';
import {
  getEventCount,
  getLatestEvents,
  getEvents,
  getPublishedEvents,
  getEventBySlug,
  getEventById,
} from './event-queries';

vi.mock('@/lib/db', () => ({
  db: {
    event: {
      count: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}));

describe('event-queries DAL Integration Tests (Bab 2 Lapis 3)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getEventCount harus memanggil db.event.count()', async () => {
    vi.mocked(db.event.count).mockResolvedValueOnce(42);

    const count = await getEventCount();

    expect(count).toBe(42);
    expect(db.event.count).toHaveBeenCalledTimes(1);
  });

  it('getLatestEvents harus mengambil event dengan take yang ditentukan', async () => {
    vi.mocked(db.event.findMany).mockResolvedValueOnce([]);

    await getLatestEvents(5);

    expect(db.event.findMany).toHaveBeenCalledWith({
      orderBy: { createdAt: 'desc' },
      take: 5,
    });
  });

  it('getEvents harus membatasi limit maksimal 100 dan minimal 1', async () => {
    vi.mocked(db.event.findMany).mockResolvedValueOnce([]);

    await getEvents(200);

    expect(db.event.findMany).toHaveBeenCalledWith({
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  });

  it('getPublishedEvents harus memfilter dengan status PUBLISHED', async () => {
    vi.mocked(db.event.findMany).mockResolvedValueOnce([]);

    await getPublishedEvents({ search: 'khitan', take: 10, skip: 0 });

    expect(db.event.findMany).toHaveBeenCalledWith({
      where: {
        status: 'PUBLISHED',
        OR: [
          { title: { contains: 'khitan' } },
          { content: { contains: 'khitan' } },
        ],
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
      skip: 0,
    });
  });

  it('getEventBySlug harus mencari berdasarkan slug unik', async () => {
    vi.mocked(db.event.findUnique).mockResolvedValueOnce(null);

    await getEventBySlug('donor-darah');

    expect(db.event.findUnique).toHaveBeenCalledWith({
      where: { slug: 'donor-darah' },
    });
  });

  it('getEventById harus mencari berdasarkan ID unik', async () => {
    vi.mocked(db.event.findUnique).mockResolvedValueOnce(null);

    await getEventById(5);

    expect(db.event.findUnique).toHaveBeenCalledWith({
      where: { id: 5 },
    });
  });
});
