/**
 * LAYER 1 - REPOSITORY
 * Hanya berisi operasi database mentah (CRUD).
 */

import { db } from '@/lib/db';

export async function findAllEvents() {
  return db.event.findMany({ orderBy: { createdAt: 'desc' } });
}

export async function findPublishedEvents() {
  return db.event.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { eventDate: 'desc' },
  });
}

export async function findEventById(id: number) {
  return db.event.findUnique({ where: { id } });
}

export async function findEventBySlug(slug: string) {
  return db.event.findUnique({ where: { slug } });
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
