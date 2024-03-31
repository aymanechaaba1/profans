'use server';

import { cookies } from 'next/headers';
import { generateJWT } from './generateJWT';

export async function setJWT(id: string, expiresIn: number) {
  const jwt = await generateJWT(id, expiresIn);
  cookies().set('jwt', jwt, {
    httpOnly: true,
    maxAge: expiresIn * 1000, // in ms
  });
}
