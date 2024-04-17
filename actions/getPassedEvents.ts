'use server';

import db from '@/drizzle';
import { sql } from 'drizzle-orm';

export async function getPassedEvents() {
  const passedEvents = await db.query.events.findMany({
    where: (events, { lte }) => lte(events.time, sql`CURRENT_TIMESTAMP`),
    orderBy: (events, { desc }) => desc(events.createdAt),
    with: {
      options: true,
      tickets: true,
    },
  });
  return passedEvents;
}
