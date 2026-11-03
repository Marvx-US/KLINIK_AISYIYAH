import React from 'react';
import { getEvents } from '@/features/events/queries/event-queries';
import EventsManager from '@/features/events/components/events-manager';

export const revalidate = 0;

export default async function AdminEventsPage() {
  let events: Awaited<ReturnType<typeof getEvents>> = [];

  try {
    events = await getEvents();
  } catch (error) {
    console.error('Error fetching events for admin:', error);
  }

  return <EventsManager initialEvents={events} />;
}
