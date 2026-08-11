import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { db } from '@/lib/db';
import { orders } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { user } = await getSession();

    if (!user?.email || user.email !== process.env.ADMIN_EMAIL) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const { trackingNumber, trackingUrl, status } = await request.json();

    const updateData: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    if (trackingNumber) updateData.trackingNumber = trackingNumber;
    if (trackingUrl) updateData.trackingUrl = trackingUrl;
    if (status) updateData.status = status;
    else updateData.status = 'shipped';

    await db.update(orders).set(updateData).where(eq(orders.id, id));

    return NextResponse.json({ message: 'Order updated' });
  } catch (error) {
    console.error('Admin order update error:', error);
    return NextResponse.json(
      { message: 'Failed to update order' },
      { status: 500 }
    );
  }
}
