import React from 'react';
import { db } from '@/lib/db';
import { type Event } from '@prisma/client';
import EventsManager from './EventsManager';

export const revalidate = 0;

export default async function AdminEventsPage() {
  let events: Event[] = [];

  try {
    events = await db.event.findMany({
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    console.error('Error fetching events for admin:', error);
  }

  return <EventsManager initialEvents={events} />;
}
