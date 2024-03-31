'use server';

import { generateJWT } from '@/utils/helpers';
import { cookies } from 'next/headers';

export async function setJWT(id: string, expiresIn: number) {
  const jwt = generateJWT(id, expiresIn);
  cookies().set('jwt', jwt, {
    httpOnly: true,
    maxAge: expiresIn * 1000, // in ms
  });
}
