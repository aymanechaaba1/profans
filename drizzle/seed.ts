import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import * as schema from './schema';

export const sql = neon(process.env.POSTGRES_URL!);
const db = drizzle(sql, { schema });

export default db;
