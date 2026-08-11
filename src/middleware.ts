import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const PROTECTED_ROUTES = ['/account'];
const AUTH_ROUTES = ['/login'];

async function isTokenValid(token: string | undefined, secret: string): Promise<boolean> {
  if (!token) return false;
  try {
    await jwtVerify(token, new TextEncoder().encode(secret));
    return true;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('mm_access')?.value;
  const refreshToken = request.cookies.get('mm_refresh')?.value;
  const pathname = request.nextUrl.pathname;

  // Check if either token is actually valid (not just present)
  const accessValid = await isTokenValid(accessToken, process.env.JWT_ACCESS_SECRET || '');
  const refreshValid = await isTokenValid(refreshToken, process.env.JWT_REFRESH_SECRET || '');
  const hasAuth = accessValid || refreshValid;

  // Protected routes: redirect to /login if not authenticated
  if (PROTECTED_ROUTES.some((r) => pathname.startsWith(r))) {
    if (!hasAuth) {
      // Clear stale cookies
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.set('mm_access', '', { maxAge: 0, path: '/' });
      response.cookies.set('mm_refresh', '', { maxAge: 0, path: '/' });
      return response;
    }
  }

  // Auth routes: redirect to /account if already logged in
  if (AUTH_ROUTES.some((r) => pathname === r)) {
    if (hasAuth) {
      return NextResponse.redirect(new URL('/account', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/account/:path*', '/login'],
};
