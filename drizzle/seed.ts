import { sql } from '@vercel/postgres';
import 'dotenv/config';
import db from '.';
import { events, eventOptions, tickets } from './schema';

async function main() {
  console.log('seeding starts');

  let event: typeof events.$inferInsert = {
    name: 'Barcelona vs PSG',
    description:
      'Quarter-Final Leg 2 of 2 Aggregate(3-2) UEFA Champions League',
    time: new Date(1713294000000),
    location: 'Estadi Olímpic Lluís Companys',
    thumbnail:
      'https://firebasestorage.googleapis.com/v0/b/tadakirnet-clone-ae832.appspot.com/o/thumbnails%2Frival-del-barcelona-cuartos.webp?alt=media&token=64d6dc18-9479-4189-a3dc-e1ef77b38245',
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
        stock: 10,
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
