import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/auth/session';
import { db } from '@/lib/db';
import { orders } from '@/lib/db/schema';
import { eq, and, ne, desc } from 'drizzle-orm';
import { formatPrice } from '@/lib/utils/currency';

const STATUS_COLORS: Record<string, string> = {
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-yellow-100 text-yellow-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default async function OrdersPage() {
  const { user } = await getSession();
  if (!user) redirect('/login?redirect=/account/orders');

  const userOrders = await db
    .select({
      id: orders.id,
      orderNumber: orders.orderNumber,
      status: orders.status,
      total: orders.total,
      createdAt: orders.createdAt,
    })
    .from(orders)
    .where(and(eq(orders.userId, user.userId), ne(orders.status, 'pending')))
    .orderBy(desc(orders.createdAt));

  return (
    <div>
      <h1 className="type-h4 text-ivory mb-6">Orders</h1>

      {userOrders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-ivory/45 text-sm mb-4">No orders yet.</p>
          <Link
            href="/shop"
            className="text-primary text-sm uppercase tracking-widest hover:text-primary/80 transition-colors"
          >
            Browse Collection &rarr;
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {userOrders.map((order) => (
            <Link
              key={order.id}
              href={`/account/orders/${order.id}`}
              className="block border border-ivory/10 rounded-sm p-4 hover:border-ivory/15 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-ivory">
                  {order.orderNumber}
                </span>
                <span
                  className={`text-[10px] uppercase tracking-widest font-medium px-2 py-1 rounded-sm ${
                    STATUS_COLORS[order.status] || 'bg-secondary text-ivory/55'
                  }`}
                >
                  {order.status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-ivory/35">
                  {new Date(order.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
                <span className="text-sm font-medium text-ivory/75">
                  {formatPrice(order.total / 100, false)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
