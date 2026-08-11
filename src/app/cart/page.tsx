'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import CartItem from '@/components/cart/CartItem';
import { Button } from '@/components/ui';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils/currency';
import { ShoppingCart, Loader2, Tag, X } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { useAuth } from '@/hooks/useAuth';

export default function CartPage() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, totalPrice, clearCart, isHydrated } = useCart();
  const { user } = useAuth();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponInput, setCouponInput] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isValidating, setIsValidating] = useState(false);
  const { showToast } = useToast();

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setIsValidating(true);
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            code: couponInput.trim(),
            items: items.map((i) => ({
              productId: i.productId,
              quantity: i.quantity,
              variantSku: i.variantSku,
            })),
          }),
      });
      const data = await res.json();
      if (res.ok && data.valid) {
        setCouponCode(data.code);
        setDiscount(data.discountAmount);
        showToast(`Coupon applied! You save ${formatPrice(data.discountAmount)}`, 'success');
      } else {
        showToast(data.message || 'Invalid coupon', 'error');
      }
    } catch {
      showToast('Failed to validate coupon', 'error');
    } finally {
      setIsValidating(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode('');
    setCouponInput('');
    setDiscount(0);
  };

  const handleCheckout = () => {
    if (isCheckingOut) return;
    const target = couponCode
      ? `/checkout?coupon=${encodeURIComponent(couponCode)}`
      : '/checkout';
    if (!user) {
      window.location.href = `/login?redirect=${encodeURIComponent(target)}`;
      return;
    }
    setIsCheckingOut(true);
    router.push(target);
  };

  if (!isHydrated) {
    return (
      <div className="container mx-auto px-4 pt-header-lg md:py-16">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-[12px]">
            <div className="h-[90px] bg-secondary rounded-sm" />
            <div className="h-[90px] bg-secondary rounded-sm" />
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 pt-header-lg md:py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-secondary rounded-sm p-[24px] md:p-12">
            <svg
              className="w-16 h-16 md:w-24 md:h-24 mx-auto text-ivory/35 mb-[16px] md:mb-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <h2 className="type-h5 text-ivory mb-2">
              Your cart is empty
            </h2>
            <p className="text-ivory/55 mb-6">
              Looks like you haven&apos;t added any pieces yet.
            </p>
            <Link
              href="/shop"
              className="text-primary hover:text-ivory transition-colors text-sm md:text-base tracking-widest uppercase"
            >
              Browse Collection &rarr;
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const shipping: number = 0;
  const total: number = totalPrice - discount + shipping;

  return (
    <>
      <div className="container mx-auto px-[8px] md:px-4 pt-header-lg pb-[200px] md:pb-8">
        <div className="max-w-6xl mx-auto">
          {/* Mobile: item count + clear */}
          <div className="md:hidden flex items-center justify-between mb-[8px]">
            <p className="text-[12px] uppercase tracking-widest text-ivory/35 font-medium">
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </p>
            <button
              onClick={clearCart}
              className="text-[12px] uppercase tracking-widest text-ivory/35 hover:text-red-500 transition-colors"
            >
              Clear all
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              {/* Mobile: clean card list */}
              <div className="md:hidden divide-y divide-ivory/5">
                {items.map((item) => (
                  <CartItem
                    key={item.cartItemId}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeItem}
                  />
                ))}
              </div>

              {/* Mobile: coupon input */}
              <div className="md:hidden mt-3 px-1">
                {couponCode ? (
                  <div className="flex items-center gap-2">
                    <Tag className="w-3 h-3 text-green-600" />
                    <span className="text-[12px] font-medium text-green-700 uppercase tracking-wider">{couponCode}</span>
                    <span className="text-[11px] text-green-600">-{formatPrice(discount)}</span>
                    <button onClick={handleRemoveCoupon} className="ml-auto text-green-400 hover:text-green-600">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Tag className="w-3 h-3 text-primary/40" />
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      placeholder="Have a coupon?"
                      className="flex-1 bg-transparent text-[12px] text-ivory uppercase tracking-wider outline-none border-b border-primary/20 focus:border-primary pb-1 placeholder:text-primary/30 placeholder:normal-case placeholder:tracking-normal"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      disabled={isValidating || !couponInput.trim()}
                      className="text-[10px] uppercase tracking-widest text-primary font-medium disabled:text-primary/30"
                    >
                      {isValidating ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Apply'}
                    </button>
                  </div>
                )}
                {(!user || user.isFirstPurchase) && !couponCode && (
                  <p className="text-[10px] text-ivory/35 mt-1.5 pl-5">
                    Try <button onClick={() => setCouponInput('WELCOME10')} className="text-primary font-medium">WELCOME10</button> for 10% off
                  </p>
                )}
              </div>

              {/* Desktop: bordered card */}
              <div className="hidden md:block bg-secondary rounded-sm border border-ivory/10 p-6">
                <div className="divide-y divide-ivory/10">
                  {items.map((item) => (
                    <CartItem
                      key={item.cartItemId}
                      item={item}
                      onUpdateQuantity={updateQuantity}
                      onRemove={removeItem}
                    />
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-ivory/10">
                  <Link
                    href="/shop"
                    className="text-sm text-tertiary hover:text-tertiary-dark transition-colors"
                  >
                    &larr; Continue Shopping
                  </Link>
                </div>
              </div>
            </div>

            {/* Desktop Order Summary */}
            <div className="hidden lg:block lg:col-span-1">
              <div className="bg-secondary rounded-sm p-6 sticky top-24">
                <h2 className="type-h5 text-ivory mb-4">
                  Order Summary
                </h2>

                {/* Coupon Input */}
                <div className="mb-5">
                  {couponCode ? (
                    <div className="flex items-end gap-3">
                      <Tag className="w-3.5 h-3.5 text-green-600 mb-3" />
                      <div className="flex-1 relative">
                        <span className="text-[10px] tracking-widest uppercase text-green-600 block">
                          Coupon Applied
                        </span>
                        <div className="flex items-center justify-between pt-1 pb-3 border-b border-green-300">
                          <span className="text-sm font-medium text-green-700 uppercase tracking-wider">{couponCode}</span>
                          <button onClick={handleRemoveCoupon} className="text-green-400 hover:text-green-600 transition-colors">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-end gap-3">
                      <Tag className="w-3.5 h-3.5 text-primary mb-3" />
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                          placeholder="Have a coupon?"
                          className="w-full bg-transparent pt-1 pb-3 text-sm text-ivory uppercase tracking-wider outline-none border-b border-primary/30 focus:border-primary transition-colors duration-300 placeholder:text-primary/40 placeholder:normal-case placeholder:tracking-normal"
                        />
                        <button
                          onClick={handleApplyCoupon}
                          disabled={isValidating || !couponInput.trim()}
                          className="absolute right-0 bottom-3 text-[10px] uppercase tracking-widest text-primary hover:text-primary/80 font-medium disabled:text-primary/30 transition-colors"
                        >
                          {isValidating ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Apply'}
                        </button>
                      </div>
                    </div>
                  )}
                  {/* First purchase hint */}
                  {(!user || user.isFirstPurchase) && !couponCode && (
                    <p className="text-[10px] text-ivory/35 mt-2 pl-[26px]">
                      Try <button onClick={() => setCouponInput('WELCOME10')} className="text-primary font-medium">WELCOME10</button> for 10% off your first order
                    </p>
                  )}
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-ivory/55">Subtotal</span>
                    <span className="text-ivory font-medium">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600">Discount ({couponCode})</span>
                      <span className="text-green-600 font-medium">
                        -{formatPrice(discount)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-ivory/55">Shipping</span>
                    <span className="text-ivory font-medium">
                      {shipping === 0 ? 'Free' : formatPrice(shipping)}
                    </span>
                  </div>
                  <div className="pt-3 border-t border-ivory/15">
                    <div className="flex justify-between">
                      <span className="text-base font-semibold text-ivory">
                        Total
                      </span>
                      <span className="text-xl font-bold text-tertiary">
                        {formatPrice(total)}
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  fullWidth
                  size="lg"
                  className="mb-3"
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                >
                  {isCheckingOut ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    'Proceed to Checkout'
                  )}
                </Button>

                <p className="text-xs text-center text-ivory/45">
                  Secure checkout powered by Razorpay
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Mobile sticky checkout bar */}
      <div className="fixed bottom-0 left-0 right-0 z-[60] bg-primary pb-safe md:hidden">
        <div className="px-[16px] pt-[12px] pb-[12px]">
          {/* Summary row */}
          <div className="flex items-center justify-between mb-[10px]">
            <div className="flex items-center gap-[8px]">
              <span className="text-[12px] uppercase tracking-widest text-white/60 font-medium">
                Total
              </span>
              {discount > 0 && (
                <span className="text-[10px] text-white/40">
                  (-{formatPrice(discount)})
                </span>
              )}
            </div>
            <span className="text-[18px] font-bold text-white">
              {formatPrice(total)}
            </span>
          </div>

          {/* Checkout button */}
          <button
            onClick={handleCheckout}
            disabled={isCheckingOut}
            className="w-full flex items-center justify-center gap-[10px] bg-secondary hover:bg-secondary/90 active:scale-[0.98] text-primary font-semibold uppercase tracking-wider text-[13px] h-[50px] rounded-sm transition-all duration-200 disabled:opacity-70 disabled:active:scale-100"
          >
            {isCheckingOut ? (
              <>
                <Loader2 className="w-[16px] h-[16px] animate-spin" strokeWidth={2} />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-[16px] h-[16px]" strokeWidth={2} />
                <span>Checkout</span>
              </>
            )}
          </button>

          {/* Continue shopping */}
          <Link
            href="/shop"
            className="block text-center text-[11px] uppercase tracking-widest text-white/60 mt-[8px]"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </>
  );
}
