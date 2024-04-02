'use server';

import { cookies } from 'next/headers';
import { signJWT } from './signJWT';

export async function setJWT(id: string, expiresIn: number) {
  const jwt = await signJWT(id, expiresIn);
  cookies().set('jwt', jwt, {
    httpOnly: true,
    maxAge: expiresIn * 1000, // in ms
  });
}
