import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJWT } from './actions/verifyJWT';
import { Ratelimit } from '@upstash/ratelimit';
import { kv } from '@vercel/kv';
import db from './drizzle';
import { cookies } from 'next/headers';

const authRoutes = ['/login', '/register'];
const publicRoutes = ['/', '/events'];

const ratelimit = new Ratelimit({
  redis: kv,
  // 5 requests from the same IP in 10 seconds
  limiter: Ratelimit.slidingWindow(5, '10 s'),
});

export async function middleware(request: NextRequest) {
  // if (request.method === 'POST') {
  //   const ip = request.ip ?? '127.0.0.1';
  //   const { success, pending, limit, reset, remaining } = await ratelimit.limit(
  //     ip
  //   );
  //   console.log(success, remaining);
  //   if (!remaining) return null;
  // }

  const url = request.nextUrl;
  const token = request.cookies.get('jwt')?.value;
  const payload = await verifyJWT(token!);
  if (!payload) return null;

  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, payload.id),
  });

  const loggedIn = !!token && !!payload && !!user;

  let isApiRoute = url.pathname.startsWith('/api');
  let isAuthRoute = authRoutes.includes(url.pathname);
  let isPublicRoute = publicRoutes.includes(url.pathname);

  if (isApiRoute) return null;

  if (isAuthRoute) {
    if (loggedIn) return NextResponse.redirect(new URL(`/`, request.url));
    return null;
  }

  if (!loggedIn && !isPublicRoute)
    return NextResponse.redirect(new URL(`/login`, request.url));

  return null;
}

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
