import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if the route is under /admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Check for a role cookie
    const role = request.cookies.get('role')?.value;

    // If there is no user logged in or the user is not an admin,
    // redirect to the login page.
    if (role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Continue with the request if authorized
  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
