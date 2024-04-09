import { sql } from '@vercel/postgres';
import 'dotenv/config';
import db from '.';
import { events, eventOptions, tickets } from './schema';

async function main() {
  console.log('seeding starts');

  let event: typeof events.$inferInsert = {
    name: 'barcelona vs psg',
    description: 'barcelona vs psg',
    time: new Date(1712775600000),
    location: 'Parc des Princes',
    thumbnail:
      'https://firebasestorage.googleapis.com/v0/b/tadakirnet-clone-ae832.appspot.com/o/thumbnails%2Fbarcelona-psg.webp?alt=media&token=ca7fe5be-081b-40fd-8a86-99bf540eed49',
  };

  try {
    const newEvent = await db.insert(events).values(event).returning();

    let options: (typeof eventOptions.$inferInsert)[] = [
      {
        name: 'public',
        price: '25',
        eventId: newEvent[0].id,
      },
      {
        name: 'atlas',
        price: '95',
        eventId: newEvent[0].id,
      },
      {
        name: 'vip',
        price: '195',
        eventId: newEvent[0].id,
      },
    ];

    const newOptions = await db
      .insert(eventOptions)
      .values(options)
      .returning();

    let ticket: typeof tickets.$inferInsert = {
      stock: 5,
      eventId: newEvent[0].id,
      optionId: newOptions[0].id,
    };

    await db.insert(tickets).values(ticket);
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
