'use server';

import db from '@/drizzle';
import { eventOptions, events } from '@/drizzle/schema';
import { eq, min } from 'drizzle-orm';

export async function getMinPrice(eventId: string) {
  const result = await db
    .select({
      minPrice: min(eventOptions.price),
    })
    .from(eventOptions)
    .where(eq(eventOptions.eventId, eventId));

  return result[0].minPrice;
}
