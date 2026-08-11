import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { createOrderFromRazorpay } from '@/lib/orders/createFromRazorpay';

interface RazorpayPaymentEntity {
  id: string;
  order_id: string;
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get('x-razorpay-signature');

  if (!signature) {
    return NextResponse.json(
      { message: 'Missing x-razorpay-signature header' },
      { status: 400 }
    );
  }

  const valid = Razorpay.validateWebhookSignature(
    rawBody,
    signature,
    process.env.RAZORPAY_WEBHOOK_SECRET!
  );

  if (!valid) {
    return NextResponse.json({ message: 'Invalid signature' }, { status: 400 });
  }

  let event: {
    event: string;
    payload: { payment?: { entity: RazorpayPaymentEntity } };
  };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ message: 'Invalid JSON' }, { status: 400 });
  }

  if (event.event !== 'payment.captured') {
    return NextResponse.json({ received: true });
  }

  const payment = event.payload.payment?.entity;
  if (!payment || !payment.order_id) {
    return NextResponse.json({ received: true });
  }

  try {
    await createOrderFromRazorpay({
      razorpayOrderId: payment.order_id,
      razorpayPaymentId: payment.id,
    });
  } catch (err) {
    console.error('[webhook] order persistence failed:', err);
    // Still return 200 so Razorpay doesn't retry on non-transient errors.
  }

  return NextResponse.json({ received: true });
}
