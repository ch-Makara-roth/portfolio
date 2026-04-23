import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
  runtime: 'nodejs', // Use Node.js runtime to support JWT verification
};

export function middleware(request: NextRequest) {
  // Check if the request is for an admin route
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Check for authentication token in cookies or headers
    const token = request.cookies.get('admin-token')?.value ||
                  request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      // Redirect to login page
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      // Verify JWT token
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        console.error('JWT_SECRET is not configured');
        return NextResponse.redirect(new URL('/login', request.url));
      }

      jwt.verify(token, secret);
      // Token is valid, allow request
    } catch (error) {
      // Token verification failed, redirect to login
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Check if the request is for admin API routes
  if (request.nextUrl.pathname.startsWith('/api/admin')) {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');

    try {
      // Verify JWT token
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        console.error('JWT_SECRET is not configured');
        return NextResponse.json(
          { error: 'Server configuration error' },
          { status: 500 }
        );
      }

      jwt.verify(token, secret);
      // Token is valid, allow request
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}
