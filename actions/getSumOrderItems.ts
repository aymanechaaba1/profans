'use server';

import db from '@/drizzle';
import { orderItems, orders, users } from '@/drizzle/schema';
import { getUser } from '@/lib/utils';
import { and, eq, sum } from 'drizzle-orm';

export async function getSumOrderItems(userId: string, ticketId: string) {
  const result = await db
    .select({
      sum: sum(orderItems.quantity),
    })
    .from(orderItems)
    .fullJoin(orders, eq(orders.id, orderItems.orderId))
    .fullJoin(users, eq(users.id, orders.userId))
    .where(and(eq(orderItems.ticketId, ticketId), eq(users.id, userId)));

  return result[0].sum;
}
