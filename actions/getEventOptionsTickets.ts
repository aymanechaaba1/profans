'use server';

import db from '@/drizzle';
import { eventOptions, events, tickets } from '@/drizzle/schema';
import { and, eq } from 'drizzle-orm';

export async function getEventOptionsTickets(eventId: string) {
  const data = await db
    .select({
      optionId: eventOptions.id,
      optionName: eventOptions.name,
      optionPrice: eventOptions.price,
      ticketStock: tickets.stock,
    })
    .from(eventOptions)
    .fullJoin(tickets, eq(eventOptions.id, tickets.optionId))
    .fullJoin(events, eq(events.id, tickets.eventId))
    .where(and(eq(events.id, eventId)));

  return data;
}
