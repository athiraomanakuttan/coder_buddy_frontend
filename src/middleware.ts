import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check for access token and googleSignIn in cookies
  const accessToken = request.cookies.get('accessToken')?.value;
  const googleSignIn = request.cookies.get('googleSignIn')?.value === 'true';

  // Protected routes
  if (pathname.startsWith('/expert/')) {
    // Skip protection for dashboard if googleSignIn is true
    if (pathname === '/expert/dashboard' && googleSignIn) {
      return NextResponse.next();
    }
    
    // Check access token for all other expert routes
    if (!accessToken) {
      return NextResponse.redirect(new URL('/expert/login', request.url));
    }
  }
  else if (pathname.startsWith('/admin/')) {
    if (!accessToken) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }
  else if (pathname.startsWith('/')) {
    console.log("inside of this")
    // Skip protection for dashboard if googleSignIn is true
    if (pathname === '/dashboard' && googleSignIn) {
      return NextResponse.next();
    }
    if (!accessToken) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/expert/dashboard', 
    '/expert/profile/:path*',
    '/dashboard'
  ]
}