'use server';

import db from '@/drizzle';
import {
  eventOptions,
  events,
  orderItems,
  orders,
  tickets,
  users,
} from '@/drizzle/schema';
import { desc, eq } from 'drizzle-orm';

export async function getOrders({ userId }: { userId: string }) {
  const userOrders = await db
    .select({
      orderId: orders.id,
      status: orders.status,
      time: orderItems.createdAt,
      eventName: events.name,
      ticketId: tickets.id,
      option: eventOptions.name,
      quantity: orderItems.quantity,
      unitPrice: eventOptions.price,
      total: orderItems.total,
    })
    .from(orders)
    .fullJoin(users, eq(orders.userId, users.id))
    .fullJoin(orderItems, eq(orders.id, orderItems.orderId))
    .fullJoin(tickets, eq(orderItems.ticketId, tickets.id))
    .fullJoin(events, eq(tickets.eventId, events.id))
    .fullJoin(eventOptions, eq(tickets.optionId, eventOptions.id))
    .where(eq(users.id, userId))
    .orderBy(desc(orderItems.createdAt));

  return userOrders;
}
