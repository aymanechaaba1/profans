'use server';

import { key } from '@/utils/config';
import { jwtVerify } from 'jose';

export async function verifyJWT(token: string) {
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (err) {
    console.log(err);
  }
}
