import React from 'react';
import { getAllEvents } from '@/core/services/eventService';
import EventsManager from '@/features/events/components/EventsManager';

export const revalidate = 0;

export default async function AdminEventsPage() {
  let events: Awaited<ReturnType<typeof getAllEvents>> = [];

  try {
    events = await getAllEvents();
  } catch (error) {
    console.error('Error fetching events for admin:', error);
  }

  return <EventsManager initialEvents={events} />;
}
