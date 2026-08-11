import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/auth/session';
import { db } from '@/lib/db';
import { orders, orderItems } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { formatPrice } from '@/lib/utils/currency';

const STATUS_STEPS = ['confirmed', 'processing', 'shipped', 'delivered'];

const STATUS_COLORS: Record<string, string> = {
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-yellow-100 text-yellow-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { user } = await getSession();
  if (!user) redirect('/login?redirect=/account/orders');

  const [order] = await db
    .select()
    .from(orders)
    .where(and(eq(orders.id, id), eq(orders.userId, user.userId)))
    .limit(1);

  if (!order) notFound();

  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, order.id));

  const currentStepIndex = STATUS_STEPS.indexOf(order.status);
  const shippingAddr = order.shippingAddress as Record<string, string> | null;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link
            href="/account/orders"
            className="text-xs text-ivory/35 hover:text-ivory/55 transition-colors"
          >
            &larr; All Orders
          </Link>
          <h1 className="type-h4 text-ivory mt-1">{order.orderNumber}</h1>
        </div>
        <span
          className={`text-[10px] uppercase tracking-widest font-medium px-2 py-1 rounded-sm ${
            STATUS_COLORS[order.status] || 'bg-secondary text-ivory/55'
          }`}
        >
          {order.status}
        </span>
      </div>

      {/* Status Timeline */}
      {order.status !== 'cancelled' && (
        <div className="flex items-center gap-1 mb-8">
          {STATUS_STEPS.map((step, i) => (
            <div key={step} className="flex-1 flex flex-col items-center">
              <div
                className={`w-full h-1 rounded-full ${
                  i <= currentStepIndex ? 'bg-primary' : 'bg-gray-200'
                }`}
              />
              <span
                className={`text-[9px] uppercase tracking-widest mt-1 ${
                  i <= currentStepIndex ? 'text-primary' : 'text-gray-300'
                }`}
              >
                {step}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Tracking */}
      {order.trackingNumber && (
        <div className="bg-purple-50 rounded-sm p-4 mb-6">
          <p className="text-xs uppercase tracking-widest text-ivory/45 mb-1">
            Tracking
          </p>
          <p className="text-sm font-medium text-ivory">
            {order.trackingNumber}
          </p>
          {order.trackingUrl && (
            <a
              href={order.trackingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline mt-1 inline-block"
            >
              Track Shipment &rarr;
            </a>
          )}
        </div>
      )}

      {/* Items */}
      <div className="border border-ivory/10 rounded-sm divide-y divide-ivory/5 mb-6">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 p-4">
            {item.imageUrl && (
              <img
                src={item.imageUrl}
                alt={item.productTitle}
                className="w-16 h-16 object-cover rounded-sm bg-secondary"
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-ivory truncate">
                {item.productTitle}
              </p>
              {item.variantDesc && (
                <p className="text-xs text-ivory/35">{item.variantDesc}</p>
              )}
              <p className="text-xs text-ivory/35">Qty: {item.quantity}</p>
            </div>
            <p className="text-sm font-medium text-ivory/75">
              {formatPrice((item.unitPrice * item.quantity) / 100, false)}
            </p>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-ivory/45">Subtotal</span>
          <span className="text-ivory/75">{formatPrice(order.subtotal / 100, false)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-ivory/45">Tax</span>
          <span className="text-ivory/75">{formatPrice(order.tax / 100, false)}</span>
        </div>
        {order.discount > 0 && (
          <div className="flex justify-between">
            <span className="text-ivory/45">
              Discount{order.couponCode && ` (${order.couponCode})`}
            </span>
            <span className="text-green-600">-{formatPrice(order.discount / 100, false)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-ivory/45">Shipping</span>
          <span className="text-ivory/75">
            {order.shipping === 0 ? 'Free' : formatPrice(order.shipping / 100, false)}
          </span>
        </div>
        <div className="flex justify-between pt-2 border-t border-ivory/10">
          <span className="font-semibold text-ivory">Total</span>
          <span className="font-semibold text-ivory">
            {formatPrice(order.total / 100, false)}
          </span>
        </div>
      </div>

      {/* Shipping Address */}
      {shippingAddr && (
        <div className="mt-6 pt-6 border-t border-ivory/5">
          <p className="text-xs uppercase tracking-widest text-ivory/35 mb-2">
            Shipped To
          </p>
          <p className="text-sm text-ivory/75">
            {shippingAddr.name}
            <br />
            {shippingAddr.line1}
            {shippingAddr.line2 && (
              <>
                <br />
                {shippingAddr.line2}
              </>
            )}
            <br />
            {shippingAddr.city}, {shippingAddr.state} {shippingAddr.pincode}
          </p>
        </div>
      )}

      {/* Date */}
      <div className="mt-4 text-xs text-ivory/35">
        Ordered on{' '}
        {new Date(order.createdAt).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })}
      </div>
    </div>
  );
}
