import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { verifyAccessToken, verifyRefreshToken, signAccessToken, type JwtPayload } from './jwt';
import { db } from '@/lib/db';
import { users, sessions } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

const ACCESS_COOKIE = 'mm_access';
const REFRESH_COOKIE = 'mm_refresh';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
};

/**
 * Get the current authenticated user from cookies (server-side only).
 * Attempts silent refresh if access token is expired but refresh token is valid.
 */
export async function getSession(): Promise<{
  user: JwtPayload | null;
  needsRefresh: boolean;
  newAccessToken?: string;
}> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_COOKIE)?.value;
  const refreshToken = cookieStore.get(REFRESH_COOKIE)?.value;

  // Try access token first
  if (accessToken) {
    const payload = await verifyAccessToken(accessToken);
    if (payload) {
      return { user: payload, needsRefresh: false };
    }
  }

  // Access token expired/missing — try refresh
  if (refreshToken) {
    const refreshPayload = await verifyRefreshToken(refreshToken);
    if (refreshPayload) {
      // Verify refresh token exists in DB (not revoked)
      const [session] = await db
        .select()
        .from(sessions)
        .where(eq(sessions.refreshToken, refreshToken))
        .limit(1);

      if (session && session.expiresAt > new Date()) {
        // Get user data for new access token
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.id, refreshPayload.userId))
          .limit(1);

        if (user) {
          const newAccessToken = await signAccessToken({
            userId: user.id,
            email: user.email ?? undefined,
            phone: user.phone ?? undefined,
          });

          return {
            user: {
              userId: user.id,
              email: user.email ?? undefined,
              phone: user.phone ?? undefined,
            },
            needsRefresh: true,
            newAccessToken,
          };
        }
      }
    }
  }

  return { user: null, needsRefresh: false };
}

/**
 * Set auth cookies on a NextResponse.
 */
export function setAuthCookies(
  response: NextResponse,
  accessToken: string,
  refreshToken: string
): NextResponse {
  response.cookies.set(ACCESS_COOKIE, accessToken, {
    ...COOKIE_OPTIONS,
    maxAge: 15 * 60, // 15 minutes
  });

  response.cookies.set(REFRESH_COOKIE, refreshToken, {
    ...COOKIE_OPTIONS,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  });

  return response;
}

/**
 * Clear auth cookies on a NextResponse.
 */
export function clearAuthCookies(response: NextResponse): NextResponse {
  response.cookies.set(ACCESS_COOKIE, '', {
    ...COOKIE_OPTIONS,
    maxAge: 0,
  });

  response.cookies.set(REFRESH_COOKIE, '', {
    ...COOKIE_OPTIONS,
    maxAge: 0,
  });

  return response;
}
