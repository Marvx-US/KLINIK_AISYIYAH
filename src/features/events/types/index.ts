import type { Event } from '@prisma/client';

export type { Event };

export interface EventCardData {
  id: number;
  title: string;
  slug: string;
  summary?: string | null;
  content?: string;
  eventDate?: Date | string | null;
  location?: string | null;
  coverImage?: string | null;
}
