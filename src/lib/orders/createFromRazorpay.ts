import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { orders, orderItems, couponUsage, users } from '@/lib/db/schema';
import { writeClient } from '@/lib/sanity/client';

async function decrementSanityStock(
  items: Array<{ productId: string; quantity: number }>
) {
  if (!process.env.SANITY_API_TOKEN) {
    return; // no write token configured; skip silently
  }
  // Made-to-order pieces have no stock to decrement.
  const ids = items.map((i) => i.productId);
  const flags = await writeClient.fetch<{ _id: string; madeToOrder: boolean }[]>(
    `*[_type == "product" && _id in $ids]{ _id, madeToOrder }`,
    { ids }
  );
  const mto = new Set(flags.filter((f) => f.madeToOrder).map((f) => f._id));

  for (const item of items) {
    if (mto.has(item.productId)) continue;
    try {
      await writeClient
        .patch(item.productId)
        .dec({ stockQuantity: item.quantity })
        .commit();
    } catch (err) {
      console.error(
        `[createFromRazorpay] stock decrement failed for ${item.productId}:`,
        err
      );
    }
  }
}

export interface ConfirmOrderResult {
  ok: boolean;
  alreadyConfirmed?: boolean;
  orderId?: string;
  orderNumber?: string;
  error?: string;
}

/**
 * Idempotent: flips a pending order to "confirmed" after a successful payment.
 *
 * Safe to call from both /api/payment/verify (immediately after the modal
 * succeeds) and /api/webhooks/razorpay (safety net if the browser closes
 * before the verify call lands). The first caller does the flip + side
 * effects; subsequent calls are a no-op.
 *
 * Side effects (only on the first confirmation):
 *   - Records coupon usage (if a coupon was applied)
 *   - Flips users.is_first_purchase to false
 *   - Best-effort decrement of Sanity stockQuantity per product
 */
export async function createOrderFromRazorpay(params: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
}): Promise<ConfirmOrderResult> {
  const { razorpayOrderId, razorpayPaymentId } = params;

  const [existing] = await db
    .select({
      id: orders.id,
      orderNumber: orders.orderNumber,
      status: orders.status,
      userId: orders.userId,
      couponCode: orders.couponCode,
      razorpayPaymentId: orders.razorpayPaymentId,
    })
    .from(orders)
    .where(eq(orders.razorpayOrderId, razorpayOrderId))
    .limit(1);

  if (!existing) {
    // The pending row should have been inserted by /api/checkout. If we
    // can't find it, something went wrong upstream — log loudly and bail.
    console.error(
      `[createFromRazorpay] no DB row for razorpayOrderId=${razorpayOrderId}`
    );
    return { ok: false, error: 'Order record not found' };
  }

  if (existing.status === 'confirmed') {
    // Already processed by an earlier verify or webhook call.
    if (!existing.razorpayPaymentId) {
      await db
        .update(orders)
        .set({ razorpayPaymentId, updatedAt: new Date() })
        .where(eq(orders.id, existing.id));
    }
    return {
      ok: true,
      alreadyConfirmed: true,
      orderId: existing.id,
      orderNumber: existing.orderNumber,
    };
  }

  // Flip pending → confirmed atomically. The WHERE on status='pending'
  // makes this safe under concurrent verify+webhook calls — exactly one
  // wins and runs the side effects below.
  const updated = await db
    .update(orders)
    .set({
      status: 'confirmed',
      razorpayPaymentId,
      updatedAt: new Date(),
    })
    .where(eq(orders.id, existing.id))
    .returning({ id: orders.id, status: orders.status });

  if (updated.length === 0 || updated[0].status !== 'confirmed') {
    return {
      ok: true,
      alreadyConfirmed: true,
      orderId: existing.id,
      orderNumber: existing.orderNumber,
    };
  }

  // Run side effects only on the winning flip.
  if (existing.couponCode && existing.userId) {
    await db
      .insert(couponUsage)
      .values({
        userId: existing.userId,
        couponCode: existing.couponCode,
        orderId: existing.id,
      })
      .onConflictDoNothing();
  }

  if (existing.userId) {
    await db
      .update(users)
      .set({ isFirstPurchase: false, updatedAt: new Date() })
      .where(eq(users.id, existing.userId));
  }

  // Best-effort stock decrement (won't roll back the order if it fails).
  const lineItems = await db
    .select({
      productId: orderItems.productId,
      quantity: orderItems.quantity,
    })
    .from(orderItems)
    .where(eq(orderItems.orderId, existing.id));

  await decrementSanityStock(lineItems);

  console.log('[createFromRazorpay] order confirmed:', {
    orderNumber: existing.orderNumber,
    razorpayOrderId,
    razorpayPaymentId,
    userId: existing.userId,
  });

  // Best-effort order confirmation email (won't roll back the order).
  try {
    const { sendOrderConfirmationEmail } = await import('@/lib/email/order-confirmation');
    await sendOrderConfirmationEmail(existing.id);
  } catch (err) {
    console.error('[createFromRazorpay] confirmation email failed:', err);
  }

  return {
    ok: true,
    alreadyConfirmed: false,
    orderId: existing.id,
    orderNumber: existing.orderNumber,
  };
}
