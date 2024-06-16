import { sql } from '@vercel/postgres';
import 'dotenv/config';
import db from '.';
import { events, eventOptions, tickets } from './schema';

async function main() {
  console.log('seeding starts');

  let event: typeof events.$inferInsert = {
    name: 'Nicki Minaj Mawazine 2024',
    description:
      "Nicki Minaj has risen to the rank of “Queen of rap” in less than eight years of career. She has sold more than 150 million records worldwide. She is the most followed male and female rapper in the world on social networks with 228 million subscribers on Instagram as of December 2023. Her fifth album, Pink Friday 2, was released on December 8, 2023. Time named her one of the 100 most influential people in the world. In April 2017, Nicki Minaj became the highest-charting female artist in the history of the Billboard Hot 100 surpassing Aretha Franklin's previous record (73). To date, she has 123 songs ranked on the Hot 100, making her the fourth artist with the most entries on the chart. She also has four American Music Awards, eight BET Awards, two MTV Music Awards, two MTV Europe Music Awards and five Billboard Music Awards.",
    time: new Date(1719614700000),
    location: 'OLM Souissi',
    thumbnail:
      'https://firebasestorage.googleapis.com/v0/b/tadakirnet-clone-ae832.appspot.com/o/thumbnails%2Ffestival-mawazine-2024-nicki-minaj-1.jpeg?alt=media&token=371951fa-4b46-4761-925f-81e3094e3b21',
  };

  try {
    const newEvent = await db.insert(events).values(event).returning();

    let options: (typeof eventOptions.$inferInsert)[] = [
      {
        name: 'TICKET',
        price: '140',
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
