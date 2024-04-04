import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJWT } from './actions/verifyJWT';

const publicRoutes = ['/', '/login', '/register'];

export async function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const token = request.cookies.get('jwt')?.value;
  if (!token) return;

  const payload = await verifyJWT(token);

  const loggedIn = !!token && !!payload;

  // if user is logged in and tries to go to /login or /register, redirects him to / (home page)
  if (loggedIn) {
    if (url.pathname === '/login' || url.pathname === '/register')
      return NextResponse.redirect(new URL('/', request.url));
  }

  // if user is not logged in and tries to go to a non-public route, redirects him to /login
  if (!publicRoutes.includes(url.pathname)) {
    if (url.pathname !== '/login')
      return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
