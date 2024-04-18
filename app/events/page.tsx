import Events from '@/components/Events';
import db from '@/drizzle';
import React from 'react';

async function EventsPage() {
  const events = await db.query.events.findMany({
    orderBy: (events, { desc }) => desc(events.createdAt),
    with: {
      options: true,
      tickets: true,
    },
  });

  return (
    <div>
      <Events data={events} />
    </div>
  );
}

export default EventsPage;
