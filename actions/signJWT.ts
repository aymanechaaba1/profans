'use server';

import { alg, key } from '@/utils/config';
import { SignJWT } from 'jose';

export async function signJWT(id: string) {
  try {
    const jwt = await new SignJWT({ id })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1day')
      .sign(new TextEncoder().encode(process.env.AUTH_SECRET));

    return jwt;
  } catch (err) {
    console.log(err);
  }
}
