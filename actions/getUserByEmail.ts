'use server';

import db from '@/drizzle/seed';

async function getUserByEmail(email: string) {
  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, email),
  });

  return user;
}

export default getUserByEmail;
