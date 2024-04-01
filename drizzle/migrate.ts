import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { migrate } from 'drizzle-orm/neon-http/migrator';

const sql = neon(process.env.POSTGRES_URL!);
const db = drizzle(sql);

const main = async () => {
  try {
    await migrate(db, {
      migrationsFolder: 'drizzle/migrations',
    });
    console.log('migration successfull');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

main();
