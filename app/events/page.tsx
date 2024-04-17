import { getPassedEvents } from '@/actions/getPassedEvents';
import { getUpcomingEvents } from '@/actions/getUpcomingEvents';
import Events from '@/components/Events';
import db from '@/drizzle';
import React from 'react';

async function EventsPage() {
  const upcomingEvents = await getUpcomingEvents();
  const passedEvents = await getPassedEvents();

  return (
    <div>
      <Events upcomingEvents={upcomingEvents} passedEvents={passedEvents} />
    </div>
  );
}

export default EventsPage;
