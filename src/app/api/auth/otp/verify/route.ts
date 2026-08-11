import { NextRequest, NextResponse } from 'next/server';
import { verifyOtp } from '@/lib/auth/otp';
import { signAccessToken, signRefreshToken } from '@/lib/auth/jwt';
import { setAuthCookies } from '@/lib/auth/session';
import { db } from '@/lib/db';
import { users, sessions } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const { phone, otp } = await request.json();

    if (!phone || !otp) {
      return NextResponse.json(
        { message: 'Phone and OTP are required' },
        { status: 400 }
      );
    }

    const cleaned = phone.startsWith('+91') ? phone : `+91${phone}`;
    const result = await verifyOtp(cleaned, otp);

    if (!result.valid) {
      return NextResponse.json(
        { message: result.error },
        { status: 400 }
      );
    }

    // Upsert user by phone
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.phone, cleaned))
      .limit(1);

    let userId: string;

    if (existingUser) {
      userId = existingUser.id;
    } else {
      const [newUser] = await db
        .insert(users)
        .values({ phone: cleaned })
        .returning({ id: users.id });
      userId = newUser.id;
    }

    // Generate tokens
    const accessToken = await signAccessToken({ userId, phone: cleaned });
    const refreshToken = await signRefreshToken(userId);

    // Store refresh token
    await db.insert(sessions).values({
      userId,
      refreshToken,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      userAgent: request.headers.get('user-agent') || undefined,
      ipAddress: request.headers.get('x-forwarded-for')?.split(',')[0] || undefined,
    });

    // Set cookies and return success
    const response = NextResponse.json({ message: 'Logged in' });
    return setAuthCookies(response, accessToken, refreshToken);
  } catch (error) {
    console.error('OTP verify error:', error);
    return NextResponse.json(
      { message: 'Verification failed' },
      { status: 500 }
    );
  }
}
