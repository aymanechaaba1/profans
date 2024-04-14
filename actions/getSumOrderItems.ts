'use server';

import db from '@/drizzle';
import { orderItems } from '@/drizzle/schema';
import { eq, sum } from 'drizzle-orm';

export async function getSumOrderItems(ticketId: string) {
  const result = await db
    .select({
      sum: sum(orderItems.quantity),
    })
    .from(orderItems)
    .where(eq(orderItems.ticketId, ticketId));

  return result[0].sum;
}
