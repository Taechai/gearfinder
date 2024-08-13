import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  console.log(request.url)
  if (!token) {
    console.log("\nNo token found\n")
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
      console.log("\nToken expired\n")
      return response
    }
  }

  // Redirecting to /create when it's the user's first connection
  if (!request.nextUrl.pathname.includes("/create-new")) {
    const userId = token.id
    const apiUrl = new URL(`api/check-first-connection?userId=${userId}`, request.nextUrl.origin)
    const response = await (await fetch(apiUrl, { method: "GET" })).json();

    if (!response.error) {
      if (!response.hasProjects) {
        return NextResponse.redirect(new URL('/create-new', request.nextUrl.origin))
      }
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
    '/create-new/:path*',
    '/create-project/:path*',
  ],
};
