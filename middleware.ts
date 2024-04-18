import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJWT } from './actions/verifyJWT';

const authRoutes = ['/login', '/register'];
const publicRoutes = ['/', '/events'];

export async function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const token = request.cookies.get('jwt')?.value;

  const payload = await verifyJWT(token!);
  const loggedIn = !!token && !!payload;

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
