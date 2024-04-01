'use server';

import db from '@/drizzle/seed';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { validJWT } from './validJWT';

export async function getSession() {
  const token = cookies().get('jwt')?.value;

  try {
    const payload = await validJWT(token!);
    if (!payload) return redirect('/login');

    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, payload.id),
    });

    return { user };
  } catch (err) {
    console.log(err);
  }
}
