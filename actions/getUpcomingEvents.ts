'use server';

import db from '@/drizzle';
import { sql } from 'drizzle-orm';

export async function getUpcomingEvents() {
  const upcomingEvents = await db.query.events.findMany({
    where: (events, { gt }) => gt(events.time, sql`CURRENT_TIMESTAMP`),
    orderBy: (events, { desc }) => desc(events.createdAt),
    with: {
      options: true,
      tickets: true,
    },
  });
  return upcomingEvents;
}
