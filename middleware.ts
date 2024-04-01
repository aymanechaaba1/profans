import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const publicRoutes = ['/', '/login', '/register'];

export async function validJWT(token: string) {
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

export async function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const token = request.cookies.get('jwt')?.value;
  const payload = await validJWT(token!);

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
