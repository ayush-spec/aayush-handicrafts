import { NextRequest, NextResponse } from 'next/server';
import { getRazorpay } from '@/lib/razorpay';
import { getSession } from '@/lib/auth/session';
import { validateCoupon } from '@/lib/coupons/validate';
import { client } from '@/lib/sanity/client';
import { db } from '@/lib/db';
import { users, orders, orderItems } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getEffectiveRate, computePriceBreakdown } from '@/lib/pricing';
import { siteConfig } from '@/config/site.config';
import type { CartItem } from '@/types/cart';

function generateOrderNumber(): string {
  const now = new Date();
  const yy = now.getFullYear().toString().slice(-2);
  const mm = (now.getMonth() + 1).toString().padStart(2, '0');
  const dd = now.getDate().toString().padStart(2, '0');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `AAH-${yy}${mm}${dd}-${rand}`;
}

/** Normalize Indian phone numbers to Razorpay's preferred +91XXXXXXXXXX. */
function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  const local = digits.length > 10 ? digits.slice(-10) : digits;
  return local.length === 10 ? `+91${local}` : phone;
}

interface ShippingAddress {
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
}

interface SanityProductSnapshot {
  _id: string;
  title: string;
  weightGrams: number;
  purity: '925' | '999';
  makingType: 'flat' | 'per_gram' | 'percentage';
  makingValue: number;
  madeToOrder: boolean;
  stockQuantity: number;
  variants?: Array<{
    sku: string;
    priceModifier: number;
    stockQuantity: number;
  }>;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, couponCode, shippingAddress } = body as {
      items: CartItem[];
      couponCode?: string;
      shippingAddress: ShippingAddress;
    };

    if (!items || items.length === 0) {
      return NextResponse.json({ message: 'Cart is empty' }, { status: 400 });
    }

    if (
      !shippingAddress ||
      !shippingAddress.name ||
      !shippingAddress.phone ||
      !shippingAddress.line1 ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.pincode
    ) {
      return NextResponse.json(
        { message: 'Shipping address is required' },
        { status: 400 }
      );
    }

    const { user } = await getSession();
    if (!user) {
      return NextResponse.json(
        { message: 'Please log in to checkout', requiresLogin: true },
        { status: 401 }
      );
    }

    const [dbUser] = await db
      .select({ email: users.email, name: users.name, phone: users.phone })
      .from(users)
      .where(eq(users.id, user.userId))
      .limit(1);

    // Resolve the silver rate ONCE per checkout — this is the price lock.
    // The rate captured here is stored on each order item and is what the
    // customer pays, regardless of later rate movements.
    const rate = await getEffectiveRate();

    // Re-fetch authoritative product data from Sanity. Never trust the
    // client-supplied price or quantity — a tampered request could
    // otherwise pay ₹1 for a ₹50,000 product.
    const productIds = Array.from(new Set(items.map((i) => i.productId)));
    const sanityProducts = await client.fetch<SanityProductSnapshot[]>(
      `*[_type == "product" && _id in $ids]{
        _id, title, weightGrams, purity, makingType, makingValue,
        madeToOrder, stockQuantity,
        variants[]{ sku, priceModifier, stockQuantity }
      }`,
      { ids: productIds }
    );
    const productMap = new Map(sanityProducts.map((p) => [p._id, p]));

    interface SanitizedItem {
      productId: string;
      cartItemId: string;
      title: string;
      quantity: number;
      image: string;
      variantSku: string;
      variantDesc: string;
      breakdown: ReturnType<typeof computePriceBreakdown>;
      /** Variant price modifier (₹, applied to making charge). */
      variantModifier: number;
    }
    const sanitizedItems: SanitizedItem[] = [];

    for (const item of items) {
      const product = productMap.get(item.productId);
      if (!product) {
        return NextResponse.json(
          {
            message: `"${item.title}" is no longer available. Please remove it and try again.`,
          },
          { status: 400 }
        );
      }

      const breakdown = computePriceBreakdown(product, rate);
      let variantModifier = 0;
      let availableStock = product.stockQuantity;

      if (item.variantSku) {
        const variant = product.variants?.find(
          (v) => v.sku === item.variantSku
        );
        if (!variant) {
          return NextResponse.json(
            {
              message: `The selected variant of "${product.title}" is no longer available.`,
            },
            { status: 400 }
          );
        }
        variantModifier = variant.priceModifier || 0;
        availableStock = variant.stockQuantity;
      }

      // Made-to-order pieces skip the stock gate.
      if (!product.madeToOrder && item.quantity > availableStock) {
        return NextResponse.json(
          {
            message:
              availableStock === 0
                ? `"${product.title}" is sold out.`
                : `Only ${availableStock} of "${product.title}" left in stock.`,
          },
          { status: 400 }
        );
      }

      sanitizedItems.push({
        productId: item.productId,
        cartItemId: item.cartItemId,
        title: product.title,
        quantity: item.quantity,
        image: item.image,
        variantSku: item.variantSku || '',
        variantDesc:
          item.selectedVariants
            ?.map((v) => `${v.variantType}: ${v.name}`)
            .join(', ') || '',
        breakdown,
        variantModifier,
      });
    }

    // Order-level totals (₹). Variant modifiers count as making charges.
    const metalTotal = sanitizedItems.reduce(
      (sum, i) => sum + i.breakdown.metalValue * i.quantity,
      0
    );
    const makingTotal =
      sanitizedItems.reduce(
        (sum, i) => sum + i.breakdown.makingCharge * i.quantity,
        0
      ) +
      sanitizedItems.reduce((sum, i) => sum + i.variantModifier * i.quantity, 0);

    // Coupons discount the MAKING CHARGE ONLY — never the metal value.
    // The coupon validator receives the making total as its base.
    let discountAmount = 0;
    let validatedCouponCode: string | undefined;

    if (couponCode) {
      const couponResult = await validateCoupon(
        couponCode,
        user.userId,
        Math.round(makingTotal)
      );

      if (!couponResult.valid) {
        return NextResponse.json(
          { message: couponResult.error || 'Invalid coupon' },
          { status: 400 }
        );
      }

      if (couponResult.coupon && couponResult.discountAmount) {
        discountAmount = Math.min(couponResult.discountAmount, makingTotal);
        validatedCouponCode = couponResult.coupon.code;
      }
    }

    const taxable = metalTotal + makingTotal - discountAmount;
    const tax = taxable * siteConfig.legal.taxRate;
    const finalAmountInr = Math.max(0, Math.round(taxable + tax));
    const amountInPaisa = finalAmountInr * 100;

    const keyId = process.env.RAZORPAY_KEY_ID;
    if (!keyId) {
      console.error('RAZORPAY_KEY_ID not set');
      return NextResponse.json(
        { message: 'Payment gateway not configured' },
        { status: 500 }
      );
    }

    // Create the Razorpay order first so we have its id to pin our DB row to.
    const rpOrder = await getRazorpay().orders.create({
      amount: amountInPaisa,
      currency: 'INR',
      receipt: `aah_${Date.now()}`,
      notes: {
        userId: user.userId,
        couponCode: validatedCouponCode || '',
      },
    });

    // Persist a pending order row + items NOW so /api/payment/verify and
    // the webhook can flip status to "confirmed" instead of having to
    // reconstruct the whole order from the gateway. This is the source of
    // truth for everything after payment.
    try {
      const [orderRow] = await db
        .insert(orders)
        .values({
          userId: user.userId,
          razorpayOrderId: rpOrder.id,
          orderNumber: generateOrderNumber(),
          status: 'pending',
          subtotal: Math.round((metalTotal + makingTotal) * 100),
          metalTotal: Math.round(metalTotal * 100),
          makingTotal: Math.round(makingTotal * 100),
          tax: Math.round(tax * 100),
          shipping: 0,
          discount: Math.round(discountAmount * 100),
          total: amountInPaisa,
          couponCode: validatedCouponCode || null,
          shippingAddress,
          billingAddress: shippingAddress,
          customerEmail: dbUser?.email || 'unknown@email.com',
          customerPhone: shippingAddress.phone || dbUser?.phone || null,
        })
        .returning({ id: orders.id });

      if (sanitizedItems.length > 0) {
        await db.insert(orderItems).values(
          sanitizedItems.map((i) => {
            const unitMetal = i.breakdown.metalValue;
            const unitMaking = i.breakdown.makingCharge + i.variantModifier;
            const unitTaxable = unitMetal + unitMaking;
            const unitTax = unitTaxable * siteConfig.legal.taxRate;
            return {
              orderId: orderRow.id,
              productId: i.productId,
              productTitle: i.title,
              variantSku: i.variantSku || null,
              variantDesc: i.variantDesc || null,
              quantity: i.quantity,
              unitPrice: Math.round((unitTaxable + unitTax) * 100),
              metalValue: Math.round(unitMetal * 100),
              makingCharge: Math.round(unitMaking * 100),
              taxAmount: Math.round(unitTax * 100),
              ratePerGram: Math.round(i.breakdown.effectiveRatePerGram * 100),
              imageUrl: i.image || null,
            };
          })
        );
      }
    } catch (dbErr) {
      // Razorpay order is orphaned but harmless (it'll expire unused).
      console.error('Pending order persistence failed:', dbErr);
      return NextResponse.json(
        { message: 'Could not start checkout. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      orderId: rpOrder.id,
      amount: amountInPaisa,
      currency: 'INR',
      key: keyId,
      prefill: {
        name: shippingAddress.name || dbUser?.name || '',
        email: dbUser?.email || '',
        contact: normalizePhone(shippingAddress.phone || dbUser?.phone || ''),
      },
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { message: 'Failed to create order' },
      { status: 500 }
    );
  }
}
