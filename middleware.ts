import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
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
