import { NextRequest, NextResponse } from 'next/server';
import { sendOtp } from '@/lib/auth/otp';

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json();

    if (!phone) {
      return NextResponse.json(
        { message: 'Phone number is required' },
        { status: 400 }
      );
    }

    const result = await sendOtp(phone);

    if (!result.success) {
      return NextResponse.json(
        { message: result.error },
        { status: 429 }
      );
    }

    return NextResponse.json({ message: 'OTP sent' });
  } catch (error) {
    console.error('OTP send error:', error);
    return NextResponse.json(
      { message: 'Failed to send OTP' },
      { status: 500 }
    );
  }
}
