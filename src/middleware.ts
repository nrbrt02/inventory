import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const user = request.cookies.get('user')?.value;
  
  // Allow access to login page
  if (request.nextUrl.pathname === '/') {
    return NextResponse.next();
  }

  if (!user) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  try {
    const userData = JSON.parse(user);
    const path = request.nextUrl.pathname.toLowerCase();

    // Define role-based access
    if (path.startsWith('/cashier') && userData.role !== 'cashier') {
      return NextResponse.redirect(new URL('/', request.url));
    }
    if (path.startsWith('/admin') && userData.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }
    if (path.startsWith('/production') && userData.role !== 'production') {
      return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL('/', request.url));
  }
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};