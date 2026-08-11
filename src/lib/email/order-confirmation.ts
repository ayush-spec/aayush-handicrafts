import { Resend } from 'resend';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { orders, orderItems } from '@/lib/db/schema';
import { siteConfig } from '@/config/site.config';

const inr = (paisa: number) =>
  `₹${(paisa / 100).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

/**
 * Send the order confirmation email for a confirmed order.
 * Best-effort — callers should wrap in try/catch and never let this
 * roll back an order.
 */
export async function sendOrderConfirmationEmail(orderId: string): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    console.warn('[email] RESEND_API_KEY not set — skipping order confirmation');
    return;
  }

  const [order] = await db
    .select()
    .from(orders)
    .where(eq(orders.id, orderId))
    .limit(1);
  if (!order) throw new Error(`Order ${orderId} not found`);

  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, orderId));

  const addr = order.shippingAddress as {
    name?: string;
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    pincode?: string;
  } | null;

  const itemRows = items
    .map(
      (i) => `
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #333;">
          ${i.productTitle}${i.variantDesc ? `<br/><span style="color:#999;font-size:12px;">${i.variantDesc}</span>` : ''}
        </td>
        <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #333; text-align: center;">${i.quantity}</td>
        <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #333; text-align: right;">${inr(i.unitPrice * i.quantity)}</td>
      </tr>`
    )
    .join('');

  const resend = new Resend(process.env.RESEND_API_KEY);
  const fromEmail =
    process.env.ORDER_EMAIL_FROM ||
    process.env.CONTACT_EMAIL_FROM ||
    'orders@aayushhandicrafts.com';

  const { error } = await resend.emails.send({
    from: fromEmail,
    to: order.customerEmail,
    subject: `Order ${order.orderNumber} confirmed — ${siteConfig.brand.name}`,
    html: `
      <div style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #1e293b; font-size: 24px;">Thank you for your order!</h1>
        <p style="color: #555;">Order <strong>${order.orderNumber}</strong> is confirmed. We'll notify you when it ships.</p>

        <table style="width: 100%; border-collapse: collapse; margin-top: 24px;">
          <thead>
            <tr style="color: #999; font-size: 12px; text-transform: uppercase;">
              <th style="text-align: left; padding-bottom: 8px;">Item</th>
              <th style="text-align: center; padding-bottom: 8px;">Qty</th>
              <th style="text-align: right; padding-bottom: 8px;">Amount</th>
            </tr>
          </thead>
          <tbody>${itemRows}</tbody>
        </table>

        <table style="width: 100%; margin-top: 16px; border-collapse: collapse;">
          <tr><td style="padding: 4px 0; color: #777;">Metal value</td><td style="text-align: right; color: #333;">${inr(order.metalTotal)}</td></tr>
          <tr><td style="padding: 4px 0; color: #777;">Making charges</td><td style="text-align: right; color: #333;">${inr(order.makingTotal)}</td></tr>
          ${order.discount > 0 ? `<tr><td style="padding: 4px 0; color: #777;">Discount${order.couponCode ? ` (${order.couponCode})` : ''}</td><td style="text-align: right; color: #16a34a;">−${inr(order.discount)}</td></tr>` : ''}
          <tr><td style="padding: 4px 0; color: #777;">GST (${Math.round(siteConfig.legal.taxRate * 100)}%)</td><td style="text-align: right; color: #333;">${inr(order.tax)}</td></tr>
          <tr><td style="padding: 4px 0; color: #777;">Shipping</td><td style="text-align: right; color: #333;">Free</td></tr>
          <tr><td style="padding: 8px 0; font-weight: 700; color: #1e293b; border-top: 2px solid #1e293b;">Total</td><td style="text-align: right; font-weight: 700; color: #1e293b; border-top: 2px solid #1e293b;">${inr(order.total)}</td></tr>
        </table>

        ${
          addr
            ? `<div style="margin-top: 24px; padding: 16px; background: #f8fafc; border-radius: 4px;">
                <p style="margin: 0 0 4px; color: #999; font-size: 12px; text-transform: uppercase;">Shipping to</p>
                <p style="margin: 0; color: #333;">${addr.name || ''}<br/>${addr.line1 || ''}${addr.line2 ? `<br/>${addr.line2}` : ''}<br/>${addr.city || ''}, ${addr.state || ''} ${addr.pincode || ''}</p>
              </div>`
            : ''
        }

        <p style="color: #999; font-size: 12px; margin-top: 24px;">
          GSTIN: ${siteConfig.legal.gstin} · ${siteConfig.brand.name}<br/>
          Questions? Reply to this email or write to ${siteConfig.contact.email}.
        </p>
      </div>`,
  });

  if (error) {
    throw new Error(`Resend error: ${error.message}`);
  }
}
