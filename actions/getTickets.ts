'use server';

import db from '@/drizzle';

export async function getTickets() {
  const tickets = await db.query.tickets.findMany();
  return tickets;
}
