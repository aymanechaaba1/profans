'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyJWT } from './verifyJWT';
import { NextResponse } from 'next/server';
import db from '@/drizzle/seed';

export async function getSession() {
  const token = cookies().get('jwt')?.value;
  if (!token) return;

  try {
    const payload = await verifyJWT(token);
    if (!payload?.id) return;

    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, payload.id),
    });

    return { user };
  } catch (err) {
    NextResponse.next();
    console.log('session-error', err);
  }
}
