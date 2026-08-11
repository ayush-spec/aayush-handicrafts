import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { db } from '@/lib/db';
import { addresses } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const { user } = await getSession();
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userAddresses = await db
      .select()
      .from(addresses)
      .where(eq(addresses.userId, user.userId))
      .orderBy(addresses.createdAt);

    return NextResponse.json({ addresses: userAddresses });
  } catch (error) {
    console.error('Addresses fetch error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch addresses' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user } = await getSession();
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { label, name, phone, line1, line2, city, state, pincode } = body;

    if (!name || !phone || !line1 || !city || !state || !pincode) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if this is the first address (make it default)
    const existing = await db
      .select({ id: addresses.id })
      .from(addresses)
      .where(eq(addresses.userId, user.userId))
      .limit(1);

    const [newAddress] = await db
      .insert(addresses)
      .values({
        userId: user.userId,
        label: label || 'Home',
        name,
        phone,
        line1,
        line2: line2 || null,
        city,
        state,
        pincode,
        isDefault: existing.length === 0,
      })
      .returning();

    return NextResponse.json({ address: newAddress }, { status: 201 });
  } catch (error) {
    console.error('Address create error:', error);
    return NextResponse.json(
      { message: 'Failed to create address' },
      { status: 500 }
    );
  }
}
