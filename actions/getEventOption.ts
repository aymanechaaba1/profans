'use server';

import db from '@/drizzle';
import { cartItems, eventOptions, tickets } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';

export async function getEventOption(ticketId: string) {
  const eventOption = await db
    .select({
      name: eventOptions.name,
      price: eventOptions.price,
    })
    .from(eventOptions)
    .fullJoin(tickets, eq(eventOptions.id, tickets.optionId))
    .fullJoin(cartItems, eq(tickets.id, cartItems.ticketId))
    .where(eq(cartItems.ticketId, ticketId));

  return eventOption;
}
