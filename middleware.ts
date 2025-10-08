import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if the request is for an admin route
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Check for authentication token in cookies or headers
    const token = request.cookies.get('admin-token')?.value ||
                  request.headers.get('authorization')?.replace('Bearer ', '');

    // In production, you would verify the JWT token here
    // For now, we'll use a simple check
    const isAuthenticated = token === 'admin-token';

    if (!isAuthenticated) {
      // Redirect to login page
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Check if the request is for admin API routes
  if (request.nextUrl.pathname.startsWith('/api/admin')) {
    const authHeader = request.headers.get('authorization');
    const isAuthenticated = authHeader === 'Bearer admin-token';

    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }
  }



  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*']
};
