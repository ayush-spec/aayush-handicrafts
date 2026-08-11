import { NextRequest, NextResponse } from 'next/server';
import { handleGoogleCallback } from '@/lib/auth/google';
import { signAccessToken, signRefreshToken } from '@/lib/auth/jwt';
import { setAuthCookies } from '@/lib/auth/session';
import { db } from '@/lib/db';
import { users, sessions } from '@/lib/db/schema';
import { eq, or } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin;

  try {
    const code = request.nextUrl.searchParams.get('code');
    const state = request.nextUrl.searchParams.get('state');

    if (!code) {
      return NextResponse.redirect(`${origin}/login?error=missing_code`);
    }

    // Parse redirect target from state
    let redirectTo = '/account';
    if (state) {
      try {
        const parsed = JSON.parse(Buffer.from(state, 'base64url').toString());
        redirectTo = parsed.redirect || '/account';
      } catch {
        // ignore invalid state
      }
    }

    const redirectUri = `${origin}/api/auth/google/callback`;
    const googleUser = await handleGoogleCallback(code, redirectUri);

    // Upsert user: match by google_id or email
    const [existingUser] = await db
      .select()
      .from(users)
      .where(
        or(
          eq(users.googleId, googleUser.sub),
          eq(users.email, googleUser.email)
        )
      )
      .limit(1);

    let userId: string;

    if (existingUser) {
      // Update Google info if not already set
      await db
        .update(users)
        .set({
          googleId: googleUser.sub,
          name: existingUser.name || googleUser.name,
          avatarUrl: existingUser.avatarUrl || googleUser.picture,
          updatedAt: new Date(),
        })
        .where(eq(users.id, existingUser.id));
      userId = existingUser.id;
    } else {
      // Create new user
      const [newUser] = await db
        .insert(users)
        .values({
          email: googleUser.email,
          googleId: googleUser.sub,
          name: googleUser.name,
          avatarUrl: googleUser.picture,
        })
        .returning({ id: users.id });
      userId = newUser.id;
    }

    // Generate tokens
    const accessToken = await signAccessToken({
      userId,
      email: googleUser.email,
    });
    const refreshToken = await signRefreshToken(userId);

    // Store refresh token in DB
    await db.insert(sessions).values({
      userId,
      refreshToken,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      userAgent: request.headers.get('user-agent') || undefined,
      ipAddress: request.headers.get('x-forwarded-for')?.split(',')[0] || undefined,
    });

    // Set cookies and redirect
    const response = NextResponse.redirect(`${origin}${redirectTo}`);
    return setAuthCookies(response, accessToken, refreshToken);
  } catch (error) {
    console.error('Google auth error:', error);
    return NextResponse.redirect(`${origin}/login?error=auth_failed`);
  }
}
