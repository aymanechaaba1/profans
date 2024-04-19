import { sql } from '@vercel/postgres';
import 'dotenv/config';
import db from '.';
import { events, eventOptions, tickets } from './schema';

async function main() {
  console.log('seeding starts');

  let event: typeof events.$inferInsert = {
    name: 'Real Madrid vs Bayern Munich',
    description: 'UEFA Champions League Semi-Finals Leg 1 of 2',
    time: new Date(1714503600000),
    location: 'Allianz Arena',
    thumbnail:
      'https://firebasestorage.googleapis.com/v0/b/tadakirnet-clone-ae832.appspot.com/o/thumbnails%2FGLZe_OKb0AArs92.jpeg?alt=media&token=53ea961d-58a8-4c59-a939-416727cc0bba',
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
        price: '129',
        eventId: newEvent[0].id,
      },
      {
        name: 'vip premium honor zone',
        price: '175',
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
