'use server';

import db from '@/drizzle/seed';
import { validJWT } from '@/middleware';
import { cookies } from 'next/headers';

export async function getSession() {
  const token = cookies().get('jwt')?.value;

  try {
    const payload = await validJWT(token!);

    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, payload!.id),
    });

    return { user };
  } catch (err) {
    console.log(err);
  }
}
