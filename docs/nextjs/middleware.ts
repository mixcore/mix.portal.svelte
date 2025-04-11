import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Log all requests for debugging
  console.log(`Middleware processing: ${pathname}`);
  
  // Special handling for dashboard/pages route
  if (pathname === '/dashboard/pages') {
    console.log('Middleware: Handling /dashboard/pages route');
    // Continue with the request
    return NextResponse.next();
  }

  // Handle root path redirect
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Configure the paths that should trigger this middleware
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
