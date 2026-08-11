import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createOrderFromRazorpay } from '@/lib/orders/createFromRazorpay';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      body as {
        razorpay_order_id?: string;
        razorpay_payment_id?: string;
        razorpay_signature?: string;
      };

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { verified: false, message: 'Missing payment fields' },
        { status: 400 }
      );
    }

    const expected = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    const valid =
      expected.length === razorpay_signature.length &&
      crypto.timingSafeEqual(
        Buffer.from(expected),
        Buffer.from(razorpay_signature)
      );

    if (!valid) {
      return NextResponse.json(
        { verified: false, message: 'Signature mismatch' },
        { status: 400 }
      );
    }

    // Persist the order immediately so it appears in /account/orders without
    // waiting on the webhook (which won't reach localhost in dev, and races
    // with the redirect in prod). The webhook is still the safety net for
    // cases where the browser closes before this call lands.
    try {
      await createOrderFromRazorpay({
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
      });
    } catch (err) {
      // Don't fail the user-facing response — the webhook will still run.
      console.error('[payment/verify] order persistence failed:', err);
    }

    return NextResponse.json({ verified: true });
  } catch (error) {
    console.error('Payment verify error:', error);
    return NextResponse.json(
      { verified: false, message: 'Verification failed' },
      { status: 500 }
    );
  }
}
