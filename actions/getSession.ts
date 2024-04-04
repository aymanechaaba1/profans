'use server';

import { cookies } from 'next/headers';
import { verifyJWT } from './verifyJWT';

export async function getSession() {
  const token = cookies().get('jwt')?.value;
  if (!token) return null;

  try {
    const payload = await verifyJWT(token);
    return payload;
  } catch (err) {
    console.log('session-error', err);
  }
}
