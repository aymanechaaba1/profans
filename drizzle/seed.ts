import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const sql = neon(
  process.env.DRIZZLE_DATABASE_URL ||
    'postgresql://db_owner:Lw8r5yhatvdB@ep-wild-union-a59z0x0u.us-east-2.aws.neon.tech/db?sslmode=require'
);
const db = drizzle(sql, { schema });

export default db;
