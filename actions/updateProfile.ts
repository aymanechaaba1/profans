'use server';

import { users } from '@/drizzle/schema';
import db from '@/drizzle';
import { UserSchema } from '@/schemas/userSchema';
import { eq } from 'drizzle-orm';
import { getSession } from './getSession';
import { revalidatePath } from 'next/cache';

export async function updateProfile(initState: any, formData: FormData) {
  let data = Object.fromEntries(formData.entries());

  const result = UserSchema.safeParse(data);

  if (!result.success)
    return {
      errors: result.error.flatten().fieldErrors,
      message: 'invalid input',
    };

  let {
    email,
    gender,
    firstname,
    lastname,
    cin,
    birthdate,
    city,
    calling_code,
    phone,
  } = result.data;

  try {
    const session = await getSession();
    if (!session || !session.id) return;

    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, session.id as string),
    });

    if (user) {
      if (
        user.email === email &&
        user.gender === gender &&
        user.firstname === firstname &&
        user.lastname === lastname &&
        user.cin === cin &&
        user.birthdate.getTime() === birthdate.getTime() &&
        user.city === city &&
        user.phone === `${calling_code}${phone}`
      )
        return {
          message: 'no data changed',
        };

      await db
        .update(users)
        .set({
          email,
          gender,
          firstname,
          lastname,
          cin,
          birthdate,
          city,
          phone: `${calling_code}${phone}`,
        })
        .where(eq(users.id, user.id));

      revalidatePath('/account/profile');
      return {
        message: 'profile updated',
      };
    }
  } catch (err) {
    console.log(err);
  }
}
