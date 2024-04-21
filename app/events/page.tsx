import { getPassedEvents } from '@/actions/getPassedEvents';
import { getUpcomingEvents } from '@/actions/getUpcomingEvents';
import Events from '@/components/Events';
import db from '@/drizzle';
import React from 'react';

async function EventsPage() {
  const [upcomingEvents, passedEvents] = await Promise.all([
    getUpcomingEvents(),
    getPassedEvents(),
  ]);

  return (
    <div className="container">
      <Events upcomingEvents={upcomingEvents} passedEvents={passedEvents} />
    </div>
  );
}

export default EventsPage;
