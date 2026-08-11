import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { db } from '@/lib/db';
import { addresses } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

export async function PUT(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { user } = await getSession();
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Unset all defaults for this user
    await db
      .update(addresses)
      .set({ isDefault: false })
      .where(eq(addresses.userId, user.userId));

    // Set the selected one as default
    await db
      .update(addresses)
      .set({ isDefault: true })
      .where(and(eq(addresses.id, id), eq(addresses.userId, user.userId)));

    return NextResponse.json({ message: 'Default address updated' });
  } catch (error) {
    console.error('Set default address error:', error);
    return NextResponse.json(
      { message: 'Failed to update default address' },
      { status: 500 }
    );
  }
}
