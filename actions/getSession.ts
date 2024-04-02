'use server';

import db from '@/drizzle/seed';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { validJWT } from './validJWT';
import { sql } from '@vercel/postgres';

export async function getSession() {
  const token = cookies().get('jwt')?.value;

  try {
    const payload = await validJWT(token!);
    if (!payload) return redirect('/login');

    const user = await sql`SELECT * FROM users WHERE users.id = ${payload.id}`;

    return { user };
  } catch (err) {
    console.log(err);
  }
}
