import 'dotenv/config';
import type { Config } from 'drizzle-kit';

export default {
  schema: './drizzle/schema.ts',
  out: './drizzle/migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString:
      process.env.DRIZZLE_DATABASE_URL ||
      'postgresql://db_owner:Lw8r5yhatvdB@ep-wild-union-a59z0x0u.us-east-2.aws.neon.tech/db?sslmode=require',
  },
} satisfies Config;
