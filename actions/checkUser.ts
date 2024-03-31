'use server';

import db from '@/drizzle/seed';

export async function checkUser(email: string) {
  try {
    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    });

    return user;
  } catch (err) {
    console.log(err);
  }
}
