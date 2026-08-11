'use client';

import { Suspense, useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { usePincodeAutofill } from '@/hooks/usePincodeAutofill';
import { formatPrice } from '@/lib/utils/currency';
import { Check, Loader2, Plus, Tag, X } from 'lucide-react';
import { Button, FloatingInput } from '@/components/ui';
import RazorpayCheckout from '@/components/checkout/RazorpayCheckout';

interface SavedAddress {
  id: string;
  label: string;
  name: string;
  phone: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

interface AddressForm {
  name: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
}

const EMPTY_FORM: AddressForm = {
  name: '',
  phone: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  pincode: '',
};

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCoupon = searchParams.get('coupon') || '';
  const { items, totalPrice, isHydrated } = useCart();
  const { user, isLoading: authLoading } = useAuth();
  const { showToast } = useToast();

  // Seed the new-address form with the logged-in user's profile so they
  // don't have to retype name/phone if it's already on file.
  const formDefaults = useMemo<AddressForm>(
    () => ({
      ...EMPTY_FORM,
      name: user?.name || '',
      phone: user?.phone || '',
    }),
    [user?.name, user?.phone]
  );

  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<AddressForm>(EMPTY_FORM);
  const [formSeeded, setFormSeeded] = useState(false);

  const pincodeStatus = usePincodeAutofill(form.pincode, ({ city, state }) =>
    setForm((prev) => ({ ...prev, city, state }))
  );

  const [couponCode, setCouponCode] = useState('');
  const [couponInput, setCouponInput] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
  const [autoCouponTried, setAutoCouponTried] = useState(false);

  // Redirect to cart if empty
  useEffect(() => {
    if (isHydrated && items.length === 0) {
      router.replace('/cart');
    }
  }, [isHydrated, items.length, router]);

  // Auto-apply coupon passed from cart via ?coupon=
  useEffect(() => {
    if (
      !autoCouponTried &&
      initialCoupon &&
      isHydrated &&
      items.length > 0 &&
      !couponCode
    ) {
      setAutoCouponTried(true);
      (async () => {
        try {
          const res = await fetch('/api/coupons/validate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              code: initialCoupon,
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
          }
        } catch {
          // ignore — user can re-enter manually
        }
      })();
    }
  }, [
    autoCouponTried,
    initialCoupon,
    isHydrated,
    items.length,
    couponCode,
    totalPrice,
  ]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login?redirect=/checkout');
    }
  }, [authLoading, user, router]);

  // Seed the form once the user profile arrives so the "new address" form
  // already has name/phone filled in. Only seeds when the user hasn't typed
  // anything yet (form is still empty).
  useEffect(() => {
    if (formSeeded) return;
    if (!user) return;
    setForm((prev) =>
      prev.name || prev.phone || prev.line1 ? prev : formDefaults
    );
    setFormSeeded(true);
  }, [user, formDefaults, formSeeded]);

  const fetchAddresses = useCallback(async () => {
    try {
      const res = await fetch('/api/account/addresses');
      if (res.ok) {
        const data = await res.json();
        const list: SavedAddress[] = data.addresses || [];
        setAddresses(list);
        if (list.length > 0) {
          const def = list.find((a) => a.isDefault) || list[0];
          setSelectedId(def.id);
        } else {
          setShowForm(true);
        }
      }
    } catch {
      // ignore
    } finally {
      setIsLoadingAddresses(false);
    }
  }, []);

  useEffect(() => {
    if (user) fetchAddresses();
  }, [user, fetchAddresses]);

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setIsValidatingCoupon(true);
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
        showToast(
          `Coupon applied! You save ${formatPrice(data.discountAmount)}`,
          'success'
        );
      } else {
        showToast(data.message || 'Invalid coupon', 'error');
      }
    } catch {
      showToast('Failed to validate coupon', 'error');
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode('');
    setCouponInput('');
    setDiscount(0);
  };

  const handleSaveNewAddress = async () => {
    if (
      !form.name ||
      !form.phone ||
      !form.line1 ||
      !form.city ||
      !form.state ||
      !form.pincode
    ) {
      showToast('Please fill all required fields', 'error');
      return;
    }
    if (!/^\d{6}$/.test(form.pincode)) {
      showToast('Enter a valid 6-digit pincode', 'error');
      return;
    }
    try {
      const res = await fetch('/api/account/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, label: 'Home' }),
      });
      if (res.ok) {
        showToast('Address saved', 'success');
        setShowForm(false);
        setForm(formDefaults);
        fetchAddresses();
      } else {
        const data = await res.json();
        showToast(data.message || 'Failed to save address', 'error');
      }
    } catch {
      showToast('Something went wrong', 'error');
    }
  };

  const selectedAddress = useMemo(
    () => addresses.find((a) => a.id === selectedId) || null,
    [addresses, selectedId]
  );

  const shippingForPayment = useMemo(() => {
    if (selectedAddress) {
      return {
        name: selectedAddress.name,
        phone: selectedAddress.phone,
        line1: selectedAddress.line1,
        line2: selectedAddress.line2 || undefined,
        city: selectedAddress.city,
        state: selectedAddress.state,
        pincode: selectedAddress.pincode,
      };
    }
    return null;
  }, [selectedAddress]);

  const total = totalPrice - discount;

  if (!isHydrated || authLoading || isLoadingAddresses) {
    return (
      <div className="container mx-auto px-4 pt-header-lg pb-20">
        <div className="animate-pulse space-y-4 max-w-4xl mx-auto">
          <div className="h-8 bg-secondary rounded-sm w-48" />
          <div className="h-32 bg-secondary rounded-sm" />
          <div className="h-32 bg-secondary rounded-sm" />
        </div>
      </div>
    );
  }

  if (items.length === 0 || !user) return null;

  return (
    <div className="container mx-auto px-4 pt-header-lg pb-20">
      <div className="max-w-5xl mx-auto">
        <h1 className="type-h3 text-ivory mb-1">Checkout</h1>
        <p className="text-sm text-ivory/45 mb-8">
          <Link href="/cart" className="hover:text-primary">
            &larr; Back to cart
          </Link>
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Address selection */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="type-h6 text-ivory">Shipping Address</h2>
                {addresses.length > 0 && !showForm && (
                  <button
                    onClick={() => {
                      setForm(formDefaults);
                      setShowForm(true);
                    }}
                    className="flex items-center gap-1 text-xs uppercase tracking-widest text-primary hover:text-primary/80"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add new
                  </button>
                )}
              </div>

              {addresses.length > 0 && !showForm && (
                <div className="space-y-2">
                  {addresses.map((addr) => (
                    <label
                      key={addr.id}
                      className={`block border rounded-sm p-4 cursor-pointer transition-colors ${
                        selectedId === addr.id
                          ? 'border-primary bg-primary/5'
                          : 'border-ivory/10 hover:border-ivory/15'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="address"
                          value={addr.id}
                          checked={selectedId === addr.id}
                          onChange={() => setSelectedId(addr.id)}
                          className="mt-1 accent-primary"
                        />
                        <div className="flex-1 text-sm">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] uppercase tracking-widest text-ivory/45 bg-secondary px-2 py-0.5 rounded-sm">
                              {addr.label}
                            </span>
                            {addr.isDefault && (
                              <span className="text-[10px] uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded-sm">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="font-medium text-ivory">
                            {addr.name}
                          </p>
                          <p className="text-xs text-ivory/45 mt-1">
                            {addr.line1}
                            {addr.line2 && `, ${addr.line2}`}
                            <br />
                            {addr.city}, {addr.state} {addr.pincode}
                          </p>
                          <p className="text-xs text-ivory/35 mt-1">
                            {addr.phone}
                          </p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              )}

              {showForm && (
                <div className="rounded-sm md:border md:border-ivory/10 md:p-6 md:bg-secondary">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-7">
                    <FloatingInput
                      label="Full Name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      autoComplete="name"
                      required
                    />
                    <FloatingInput
                      label="Phone"
                      type="tel"
                      inputMode="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      autoComplete="tel"
                      required
                    />

                    <div className="md:col-span-2">
                      <FloatingInput
                        label="Pincode"
                        type="tel"
                        inputMode="numeric"
                        maxLength={6}
                        value={form.pincode}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            pincode: e.target.value.replace(/\D/g, ''),
                          })
                        }
                        autoComplete="postal-code"
                        hasError={pincodeStatus === 'invalid'}
                        rightSlot={
                          pincodeStatus === 'looking-up' ? (
                            <Loader2 className="w-4 h-4 animate-spin text-ivory/35" />
                          ) : pincodeStatus === 'verified' ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : null
                        }
                        required
                      />
                      {pincodeStatus === 'verified' && (
                        <p className="text-[11px] text-green-600 mt-1.5">
                          City &amp; state filled in from pincode
                        </p>
                      )}
                      {pincodeStatus === 'invalid' && (
                        <p className="text-[11px] text-red-500 mt-1.5">
                          Pincode not recognised &mdash; please check it.
                        </p>
                      )}
                      {pincodeStatus === 'unavailable' && (
                        <p className="text-[11px] text-ivory/35 mt-1.5">
                          Couldn&apos;t verify pincode automatically &mdash;
                          please confirm city and state.
                        </p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <FloatingInput
                        label="Address Line 1"
                        value={form.line1}
                        onChange={(e) => setForm({ ...form, line1: e.target.value })}
                        autoComplete="address-line1"
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <FloatingInput
                        label="Address Line 2 (optional)"
                        value={form.line2}
                        onChange={(e) => setForm({ ...form, line2: e.target.value })}
                        autoComplete="address-line2"
                      />
                    </div>

                    <FloatingInput
                      label="City"
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      autoComplete="address-level2"
                      required
                    />
                    <FloatingInput
                      label="State"
                      value={form.state}
                      onChange={(e) => setForm({ ...form, state: e.target.value })}
                      autoComplete="address-level1"
                      required
                    />
                  </div>

                  <div className="flex gap-3 pt-8">
                    <Button onClick={handleSaveNewAddress} size="sm">
                      Save Address
                    </Button>
                    {addresses.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setShowForm(false);
                          setForm(formDefaults);
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-secondary rounded-sm p-6 lg:sticky lg:top-24">
              <h2 className="type-h6 text-ivory mb-4">Order Summary</h2>

              {/* Coupon */}
              <div className="mb-5">
                {couponCode ? (
                  <div className="flex items-end gap-3">
                    <Tag className="w-3.5 h-3.5 text-green-600 mb-3" />
                    <div className="flex-1">
                      <span className="text-[10px] tracking-widest uppercase text-green-600 block">
                        Coupon Applied
                      </span>
                      <div className="flex items-center justify-between pt-1 pb-3 border-b border-green-300">
                        <span className="text-sm font-medium text-green-700 uppercase tracking-wider">
                          {couponCode}
                        </span>
                        <button
                          onClick={handleRemoveCoupon}
                          className="text-green-400 hover:text-green-600 transition-colors"
                        >
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
                        onChange={(e) =>
                          setCouponInput(e.target.value.toUpperCase())
                        }
                        placeholder="Have a coupon?"
                        className="w-full bg-transparent pt-1 pb-3 text-sm text-ivory uppercase tracking-wider outline-none border-b border-primary/30 focus:border-primary transition-colors duration-300 placeholder:text-primary/40 placeholder:normal-case placeholder:tracking-normal"
                      />
                      <button
                        onClick={handleApplyCoupon}
                        disabled={isValidatingCoupon || !couponInput.trim()}
                        className="absolute right-0 bottom-3 text-[10px] uppercase tracking-widest text-primary hover:text-primary/80 font-medium disabled:text-primary/30 transition-colors"
                      >
                        {isValidatingCoupon ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          'Apply'
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                {items.map((item) => (
                  <div
                    key={item.cartItemId}
                    className="flex items-center justify-between text-xs text-ivory/55"
                  >
                    <span className="truncate flex-1 mr-2">
                      {item.title} × {item.quantity}
                    </span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-6 pt-4 border-t border-ivory/10">
                <div className="flex justify-between text-sm">
                  <span className="text-ivory/55">Subtotal</span>
                  <span className="text-ivory font-medium">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">
                      Discount ({couponCode})
                    </span>
                    <span className="text-green-600 font-medium">
                      -{formatPrice(discount)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-ivory/55">Shipping</span>
                  <span className="text-ivory font-medium">Free</span>
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

              <RazorpayCheckout
                shippingAddress={shippingForPayment}
                couponCode={couponCode}
                disabled={!shippingForPayment}
              />

              <p className="text-[10px] text-center text-ivory/45 mt-3 uppercase tracking-widest">
                Secure payments by Razorpay
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 pt-header-lg pb-20">
          <div className="animate-pulse space-y-4 max-w-4xl mx-auto">
            <div className="h-8 bg-secondary rounded-sm w-48" />
            <div className="h-32 bg-secondary rounded-sm" />
          </div>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
