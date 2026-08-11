import { client } from '@/lib/sanity/client';
import { db } from '@/lib/db';
import { users, couponUsage } from '@/lib/db/schema';
import { eq, and, count } from 'drizzle-orm';

export interface SanityCoupon {
  _id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount: number;
  maxUsageTotal: number;
  maxUsagePerUser: number;
  isFirstPurchaseOnly: boolean;
  isActive: boolean;
  validFrom: string | null;
  validUntil: string | null;
}

export interface CouponValidationResult {
  valid: boolean;
  error?: string;
  discountAmount?: number; // in INR
  coupon?: SanityCoupon;
}

export async function validateCoupon(
  code: string,
  userId: string | null,
  cartTotal: number // in INR
): Promise<CouponValidationResult> {
  // 1. Fetch coupon from Sanity
  const coupon = await client.fetch<SanityCoupon | null>(
    `*[_type == "coupon" && code == $code][0]{
      _id, code, description, discountType, discountValue,
      minOrderAmount, maxDiscountAmount, maxUsageTotal,
      maxUsagePerUser, isFirstPurchaseOnly, isActive,
      validFrom, validUntil
    }`,
    { code: code.toUpperCase() }
  );

  if (!coupon) {
    return { valid: false, error: 'Invalid coupon code' };
  }

  // 2. Check active
  if (!coupon.isActive) {
    return { valid: false, error: 'This coupon is no longer active' };
  }

  // 3. Check date range
  const now = new Date();
  if (coupon.validFrom && new Date(coupon.validFrom) > now) {
    return { valid: false, error: 'This coupon is not yet valid' };
  }
  if (coupon.validUntil && new Date(coupon.validUntil) < now) {
    return { valid: false, error: 'This coupon has expired' };
  }

  // 4. Check minimum order amount
  if (coupon.minOrderAmount && cartTotal < coupon.minOrderAmount) {
    return {
      valid: false,
      error: `Minimum order of ₹${coupon.minOrderAmount} required`,
    };
  }

  // 5. Check first purchase only
  if (coupon.isFirstPurchaseOnly && userId) {
    const [user] = await db
      .select({ isFirstPurchase: users.isFirstPurchase })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (user && !user.isFirstPurchase) {
      return { valid: false, error: 'This coupon is for first-time customers only' };
    }
  }

  // Require login for first-purchase coupons
  if (coupon.isFirstPurchaseOnly && !userId) {
    return { valid: false, error: 'Please log in to use this coupon' };
  }

  // 6. Check per-user usage
  if (userId && coupon.maxUsagePerUser > 0) {
    const [usage] = await db
      .select({ total: count() })
      .from(couponUsage)
      .where(
        and(
          eq(couponUsage.userId, userId),
          eq(couponUsage.couponCode, coupon.code)
        )
      );

    if (usage && usage.total >= coupon.maxUsagePerUser) {
      return { valid: false, error: 'You have already used this coupon' };
    }
  }

  // 7. Check total usage
  if (coupon.maxUsageTotal > 0) {
    const [usage] = await db
      .select({ total: count() })
      .from(couponUsage)
      .where(eq(couponUsage.couponCode, coupon.code));

    if (usage && usage.total >= coupon.maxUsageTotal) {
      return { valid: false, error: 'This coupon has reached its usage limit' };
    }
  }

  // 8. Calculate discount
  let discountAmount: number;
  if (coupon.discountType === 'percentage') {
    discountAmount = Math.round(cartTotal * (coupon.discountValue / 100));
    if (coupon.maxDiscountAmount > 0) {
      discountAmount = Math.min(discountAmount, coupon.maxDiscountAmount);
    }
  } else {
    discountAmount = coupon.discountValue;
  }

  // Don't allow discount greater than cart total
  discountAmount = Math.min(discountAmount, cartTotal);

  return { valid: true, discountAmount, coupon };
}
