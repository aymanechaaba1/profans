'use server';

import db from '@/drizzle';

export async function getEvent(eventId?: string, ticketId?: string) {
  const event = await db.query.events.findFirst({
    ...(eventId && { where: (events, { eq }) => eq(events.id, eventId) }),
    with: {
      tickets: {
        ...(ticketId && {
          where: (tickets, { eq }) => eq(tickets.id, ticketId),
        }),
      },
      options: true,
    },
  });
  return event;
}
