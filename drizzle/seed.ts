import { sql } from '@vercel/postgres';
import 'dotenv/config';
import db from '.';
import { events, eventOptions, tickets } from './schema';

async function main() {
  console.log('seeding starts');

  let event: typeof events.$inferInsert = {
    name: 'Real Madrid vs Man City',
    description:
      'Quarter-Final Leg 2 of 2 Aggregate(3-3) UEFA Champions League',
    time: new Date(1713384000000),
    location: 'Etihad Stadium',
    thumbnail:
      'https://firebasestorage.googleapis.com/v0/b/tadakirnet-clone-ae832.appspot.com/o/thumbnails%2FWhy-Real-Madrid-drawing-Manchester-City-in-Champions-League-Quarterfinals-is-a-nightmare.jpg?alt=media&token=d7850d42-17ff-4233-8f80-6fe7281ca001',
  };

  try {
    const newEvent = await db.insert(events).values(event).returning();

    let options: (typeof eventOptions.$inferInsert)[] = [
      {
        name: 'basic',
        price: '75',
        eventId: newEvent[0].id,
      },
      {
        name: 'vip premium players zone',
        price: '175',
        eventId: newEvent[0].id,
      },
      {
        name: 'vip premium honor zone',
        price: '295',
        eventId: newEvent[0].id,
      },
    ];

    const newOptions = await db
      .insert(eventOptions)
      .values(options)
      .returning();

    for (const option of newOptions) {
      let ticket: typeof tickets.$inferInsert = {
        stock: 50,
        eventId: newEvent[0].id,
        optionId: option.id,
      };
      await db.insert(tickets).values(ticket);
    }

    console.log('data seeded');
  } catch (err) {
    console.log(err);
  }

  process.exit(0);
}

main()
  .then()
  .catch((err) => {
    console.log(err);
    process.exit(0);
  });
