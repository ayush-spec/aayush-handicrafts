import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { clearAuthCookies } from '@/lib/auth/session';
import { db } from '@/lib/db';
import { sessions } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('mm_refresh')?.value;

    // Invalidate refresh token in DB
    if (refreshToken) {
      await db
        .delete(sessions)
        .where(eq(sessions.refreshToken, refreshToken));
    }

    const response = NextResponse.json({ message: 'Logged out' });
    return clearAuthCookies(response);
  } catch (error) {
    console.error('Logout error:', error);
    const response = NextResponse.json({ message: 'Logged out' });
    return clearAuthCookies(response);
  }
}
