import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for the login page in the auth route group
  if (pathname.includes('/login')) {
    return NextResponse.next();
  }
  
  // Check if the path is an admin route
  if (pathname.startsWith('/admin')) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    
    // If no token or user is not an admin, redirect to login
    if (!token || token.role !== 'ADMIN') {
      // Create the login URL with the auth route group
      const loginPath = '/login';
      const url = new URL(loginPath, request.url);
      url.searchParams.set('callbackUrl', encodeURI(request.url));
      return NextResponse.redirect(url);
    }
  }
  
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: ['/admin/:path*'],
};
