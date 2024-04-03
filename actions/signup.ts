'use server';

import { users } from '@/drizzle/schema';
import db from '@/drizzle/seed';
import { getCities } from '@/utils/helpers';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { signJWT } from './signJWT';
import { NextResponse } from 'next/server';

const UserSchema = z.object({
  id: z.string().optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
  gender: z.enum(['male', 'female']),
  firstname: z.string().min(2).trim(),
  lastname: z.string().min(2).trim(),
  cin: z.string().regex(new RegExp(/^[a-zA-Z].*/)),
  birthdate: z.coerce.date(),
  city: z.string(),
  calling_code: z.string().regex(new RegExp(/^\+\d{1,3}$/)),
  phone: z
    .string()
    .regex(new RegExp(/^(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/)),
  email: z.string().trim().email(),
});

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
    let expiresIn = 60 * 60; // one day in s
    const jwt = await signJWT(newUser[0].id);
    console.log(jwt);
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
