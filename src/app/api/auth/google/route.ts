import { NextRequest, NextResponse } from 'next/server';
import { getGoogleAuthUrl } from '@/lib/auth/google';

export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin;
  const redirectUri = `${origin}/api/auth/google/callback`;

  // Pass the original redirect target as state
  const redirectTo = request.nextUrl.searchParams.get('redirect') || '/account';
  const state = Buffer.from(JSON.stringify({ redirect: redirectTo })).toString('base64url');

  const authUrl = getGoogleAuthUrl(redirectUri, state);
  return NextResponse.redirect(authUrl);
}
