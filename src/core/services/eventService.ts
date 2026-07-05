/**
 * LAYER 2 - SERVICE
 */

import { uploadFile } from '@/lib/upload';
import * as eventRepo from '@/core/repositories/eventRepository';

function generateSlug(title: string): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `${base}-${Date.now()}`;
}

export async function createEvent(data: {
  title: string;
  content: string;
  location: string | null;
  eventDate: Date | null;
  status: string;
  coverImageFile: File | null;
}) {
  const slug = generateSlug(data.title);
  const coverImage = await uploadFile(data.coverImageFile);

  return eventRepo.createEvent({
    title: data.title,
    slug,
    content: data.content,
    location: data.location,
    eventDate: data.eventDate,
    status: data.status,
    coverImage,
  });
}

export async function updateEvent(
  id: number,
  data: {
    title: string;
    content: string;
    location: string | null;
    eventDate: Date | null;
    status: string;
    coverImageFile: File | null;
  }
) {
  const existing = await eventRepo.findEventById(id);
  if (!existing) throw new Error('Event tidak ditemukan.');

  let coverImage = existing.coverImage;
  if (data.coverImageFile) {
    const uploaded = await uploadFile(data.coverImageFile);
    if (uploaded) coverImage = uploaded;
  }

  return eventRepo.updateEvent(id, {
    title: data.title,
    content: data.content,
    location: data.location,
    eventDate: data.eventDate,
    status: data.status,
    coverImage,
  });
}

export async function deleteEvent(id: number) {
  const existing = await eventRepo.findEventById(id);
  if (!existing) throw new Error('Event tidak ditemukan.');
  return eventRepo.deleteEvent(id);
}

export const getAllEvents = eventRepo.findAllEvents;
export const getPublishedEvents = eventRepo.findPublishedEvents;
export const getEventBySlug = eventRepo.findEventBySlug;
