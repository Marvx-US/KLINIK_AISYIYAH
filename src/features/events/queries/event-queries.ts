import 'server-only';
import { db } from '@/lib/db';

/**
 * DATA ACCESS LAYER (READ) — Modul Kegiatan & Agenda Klinik
 * Sesuai Bab 6.1 HANDBOOK_CLEANCODE.md
 * Wajib `server-only` agar tidak pernah terbundel ke client.
 */

export async function getEventCount(): Promise<number> {
  return db.event.count();
}

export async function getLatestEvents(take: number) {
  return db.event.findMany({
    orderBy: { createdAt: 'desc' },
    take,
  });
}

export async function getEvents(limit = 100) {
  const safeLimit = Math.max(1, Math.min(limit, 100));
  return db.event.findMany({
    orderBy: { createdAt: 'desc' },
    take: safeLimit,
  });
}

interface PublishedEventFilter {
  search?: string;
  take?: number;
  skip?: number;
}

export async function getPublishedEvents({
  search = '',
  take = 50,
  skip = 0,
}: PublishedEventFilter = {}) {
  const safeTake = Math.min(Math.max(1, take), 100);
  const where = {
    status: 'PUBLISHED',
    ...(search
      ? {
          OR: [
            { title: { contains: search } },
            { content: { contains: search } },
          ],
        }
      : {}),
  };

  return db.event.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: safeTake,
    skip,
  });
}

export async function getEventBySlug(slug: string) {
  return db.event.findUnique({ where: { slug } });
}

export async function getEventById(id: number) {
  return db.event.findUnique({ where: { id } });
}
