import { NextResponse } from 'next/server';
import { getSession, setAuthCookies } from '@/lib/auth/session';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const { user, needsRefresh, newAccessToken } = await getSession();

    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    // Fetch full user profile
    const [profile] = await db
      .select({
        id: users.id,
        email: users.email,
        phone: users.phone,
        name: users.name,
        avatarUrl: users.avatarUrl,
        isFirstPurchase: users.isFirstPurchase,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, user.userId))
      .limit(1);

    if (!profile) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const response = NextResponse.json({ user: profile });

    // Silently refresh access token if needed
    if (needsRefresh && newAccessToken) {
      response.cookies.set('mm_access', newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 15 * 60,
      });
    }

    return response;
  } catch (error) {
    console.error('Session error:', error);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
