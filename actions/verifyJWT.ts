'use server';

import { jwtVerify } from 'jose';

export async function verifyJWT(token: string) {
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.AUTH_SECRET)
    );
    return payload;
  } catch (err) {
    console.log(err);
  }
}
