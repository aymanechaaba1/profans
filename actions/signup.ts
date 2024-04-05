'use server';

import { users } from '@/drizzle/schema';
import db from '@/drizzle/seed';
import { getCities } from '@/utils/helpers';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { signJWT } from './signJWT';
import { NextResponse } from 'next/server';
import { UserSchema } from '@/schemas/userSchema';

export async function signup(
  currentState: any,
  formData: FormData,
  email: string
) {
  // validate city
  const { results: cities } = await getCities();
  const selectedCity = formData.get('city') as string;

  if (!cities.map((city) => city.name.toLowerCase()).includes(selectedCity)) {
    return {
      ok: false,
      errors: {
        city: ['invalid city'],
      },
    };
  }

  let data = {
    ...Object.fromEntries(formData.entries()),
    email,
  };
  const result = UserSchema.safeParse(data);

  if (!result.success) {
    console.log(result.error.flatten().fieldErrors);
    return {
      ok: false,
      errors: result.error.flatten().fieldErrors,
    };
  }

  try {
    // make sure it's a new user
    const { email } = result.data;

    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    });

    if (user?.email || user?.cin || user?.phone) {
      return {
        ok: false,
        message: 'user already exists',
      };
    }

    // add new user to db
    const newUser = await db
      .insert(users)
      .values({
        ...result.data,
        phone: `${result.data.calling_code}${result.data.phone}`,
      })
      .returning();

    // generate jwt
    let expiresIn = 24 * 60 * 60; // one day in s
    const jwt = await signJWT(newUser[0].id);
    if (!jwt) return;

    cookies().set('jwt', jwt, {
      httpOnly: true,
      maxAge: expiresIn * 1000, // one day in ms
    });

    return {
      ok: true,
      message: 'logged in',
    };
  } catch (err) {
    console.error(err);
    return {
      ok: false,
    };
  }
}
