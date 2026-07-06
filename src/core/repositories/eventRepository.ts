/**
 * LAYER 1 - REPOSITORY
 * Hanya berisi operasi database mentah (CRUD).
 */

import { db } from '@/lib/db';
import { unstable_cache } from 'next/cache';

// ── READ (di-cache) ─────────────────────────────────────────────────────────

export const findAllEvents = unstable_cache(
  async () => db.event.findMany({ orderBy: { createdAt: 'desc' } }),
  ['events-all'],
  { revalidate: 60, tags: ['events'] }
);

export const findPublishedEvents = unstable_cache(
  async () =>
    db.event.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { eventDate: 'desc' },
    }),
  ['events-published'],
  { revalidate: 60, tags: ['events'] }
);

export const findEventBySlug = unstable_cache(
  async (slug: string) => db.event.findUnique({ where: { slug } }),
  ['event-by-slug'],
  { revalidate: 60, tags: ['events'] }
);

// ── WRITE (tidak di-cache) ───────────────────────────────────────────────────

export async function findEventById(id: number) {
  return db.event.findUnique({ where: { id } });
}

export async function createEvent(data: {
  title: string;
  slug: string;
  content: string;
  location: string | null;
  eventDate: Date | null;
  status: string;
  coverImage: string | null;
}) {
  return db.event.create({ data });
}

export async function updateEvent(
  id: number,
  data: {
    title?: string;
    content?: string;
    location?: string | null;
    eventDate?: Date | null;
    status?: string;
    coverImage?: string | null;
  }
) {
  return db.event.update({ where: { id }, data });
}

export async function deleteEvent(id: number) {
  return db.event.delete({ where: { id } });
}
