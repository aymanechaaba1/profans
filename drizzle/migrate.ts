import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { migrate } from 'drizzle-orm/neon-http/migrator';

const sql = neon(
  process.env.DRIZZLE_DATABASE_URL ||
    'postgresql://db_owner:Lw8r5yhatvdB@ep-wild-union-a59z0x0u.us-east-2.aws.neon.tech/db?sslmode=require'
);
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
