import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { db } from '@/lib/db';
import { addresses } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { user } = await getSession();
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { label, name, phone, line1, line2, city, state, pincode } = body;

    await db
      .update(addresses)
      .set({
        label: label || 'Home',
        name,
        phone,
        line1,
        line2: line2 || null,
        city,
        state,
        pincode,
      })
      .where(and(eq(addresses.id, id), eq(addresses.userId, user.userId)));

    return NextResponse.json({ message: 'Address updated' });
  } catch (error) {
    console.error('Address update error:', error);
    return NextResponse.json(
      { message: 'Failed to update address' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { user } = await getSession();
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await db
      .delete(addresses)
      .where(and(eq(addresses.id, id), eq(addresses.userId, user.userId)));

    return NextResponse.json({ message: 'Address deleted' });
  } catch (error) {
    console.error('Address delete error:', error);
    return NextResponse.json(
      { message: 'Failed to delete address' },
      { status: 500 }
    );
  }
}
