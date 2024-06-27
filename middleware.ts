import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });

  if (!token) {
    console.log("No token found")
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const currentDate = Date.now() / 1000;
  if (!token.rememberMe && token.expires) {
    const expirationDate = token.expires
    const timeUntilExp = expirationDate - currentDate

    if (timeUntilExp < 0) {
      const response = NextResponse.redirect(new URL('/login', request.url))
      response.cookies.set('next-auth.session-token', '', { maxAge: 0 });
      response.cookies.set('next-auth.csrf-token', '', { maxAge: 0 });
      console.log("Token expired")
      return response
    }
  }
  return NextResponse.next();
}

// When the session expires, a notification should be sent to the user
// Same thing for signing in and signing up

export const config = {
  matcher: [
    '/gear-detection/:path*',
    '/ml-setup/:path*',
    '/gear-map/:path*',
    '/create/:path*'],
};
