'use server';

import db from '@/drizzle';

export async function getTicket(eventId: string, optionId: string) {
  const ticket = await db.query.tickets.findFirst({
    where: (tickets, { eq, and }) =>
      and(eq(tickets.eventId, eventId), eq(tickets.optionId, optionId)),
  });
  return ticket;
}
