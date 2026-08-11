import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { validateCoupon } from '@/lib/coupons/validate';
import { client } from '@/lib/sanity/client';
import { getEffectiveRate, computePriceBreakdown } from '@/lib/pricing';

interface CartSnapshotItem {
  productId: string;
  quantity: number;
  variantSku?: string;
}

/**
 * Coupons discount the MAKING CHARGE ONLY (never the metal value), so the
 * validation base is the cart's making-charge total — recomputed
 * server-side from the live silver rate, never trusted from the client.
 */
async function computeMakingTotal(items: CartSnapshotItem[]): Promise<number> {
  const ids = Array.from(new Set(items.map((i) => i.productId)));
  const [products, rate] = await Promise.all([
    client.fetch<
      {
        _id: string;
        weightGrams: number;
        purity: '925' | '999';
        makingType: 'flat' | 'per_gram' | 'percentage';
        makingValue: number;
        variants?: { sku: string; priceModifier: number }[];
      }[]
    >(
      `*[_type == "product" && _id in $ids]{
        _id, weightGrams, purity, makingType, makingValue,
        variants[]{ sku, priceModifier }
      }`,
      { ids }
    ),
    getEffectiveRate(),
  ]);
  const map = new Map(products.map((p) => [p._id, p]));

  let makingTotal = 0;
  for (const item of items) {
    const product = map.get(item.productId);
    if (!product) continue;
    const breakdown = computePriceBreakdown(product, rate);
    const variantModifier =
      product.variants?.find((v) => v.sku === item.variantSku)?.priceModifier || 0;
    makingTotal += (breakdown.makingCharge + variantModifier) * item.quantity;
  }
  return makingTotal;
}

export async function POST(request: NextRequest) {
  try {
    const { code, items } = (await request.json()) as {
      code: string;
      items: CartSnapshotItem[];
    };

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { message: 'Coupon code is required' },
        { status: 400 }
      );
    }

    if (!items || items.length === 0) {
      return NextResponse.json(
        { message: 'Cart is empty' },
        { status: 400 }
      );
    }

    const makingTotal = await computeMakingTotal(items);
    if (makingTotal <= 0) {
      return NextResponse.json(
        { message: 'Invalid cart total' },
        { status: 400 }
      );
    }

    const { user } = await getSession();
    const result = await validateCoupon(
      code,
      user?.userId || null,
      Math.round(makingTotal)
    );

    if (!result.valid) {
      return NextResponse.json(
        { valid: false, message: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      valid: true,
      discountAmount: result.discountAmount,
      code: result.coupon?.code,
      discountType: result.coupon?.discountType,
      discountValue: result.coupon?.discountValue,
    });
  } catch (error) {
    console.error('Coupon validation error:', error);
    return NextResponse.json(
      { message: 'Failed to validate coupon' },
      { status: 500 }
    );
  }
}
