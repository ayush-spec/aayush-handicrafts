'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { Loader2, ShoppingCart } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/useToast';

interface ShippingAddress {
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
}

interface RazorpayHandlerResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayInstance {
  open: () => void;
  on: (event: string, cb: (response: unknown) => void) => void;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  image?: string;
  order_id: string;
  prefill: { name: string; email: string; contact: string };
  theme?: { color?: string };
  handler: (response: RazorpayHandlerResponse) => void;
  modal?: { ondismiss?: () => void };
  notes?: Record<string, string>;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface Props {
  shippingAddress: ShippingAddress | null;
  couponCode: string;
  disabled?: boolean;
}

export default function RazorpayCheckout({
  shippingAddress,
  couponCode,
  disabled,
}: Props) {
  const router = useRouter();
  const { items } = useCart();
  const { showToast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePay = async () => {
    if (isProcessing) return;
    if (!shippingAddress) {
      showToast('Please select or enter a shipping address', 'error');
      return;
    }
    if (typeof window === 'undefined' || !window.Razorpay) {
      showToast('Payment is loading, please try again in a moment', 'error');
      return;
    }

    setIsProcessing(true);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          shippingAddress,
          ...(couponCode && { couponCode }),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.requiresLogin) {
          window.location.href = '/login?redirect=/checkout';
          return;
        }
        throw new Error(data.message || 'Failed to start payment');
      }

      if (!data.key) {
        throw new Error('Payment gateway is not configured');
      }

      const rzp = new window.Razorpay({
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: 'Aayush Handicrafts',
        description: 'Handcrafted silver from Jaipur',
        image: '/logo.svg',
        order_id: data.orderId,
        prefill: data.prefill,
        theme: { color: '#1F3A5F' },
        handler: async (response) => {
          try {
            const verifyRes = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(response),
            });
            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.verified) {
              router.push(
                `/checkout/success?razorpay_order_id=${response.razorpay_order_id}`
              );
            } else {
              showToast(
                verifyData.message || 'Payment verification failed',
                'error'
              );
              setIsProcessing(false);
            }
          } catch {
            showToast('Could not verify payment. Contact support.', 'error');
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: () => setIsProcessing(false),
        },
      });

      rzp.open();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Something went wrong';
      showToast(message, 'error');
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
      />
      <button
        onClick={handlePay}
        disabled={disabled || isProcessing}
        className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 active:scale-[0.98] text-white font-semibold uppercase tracking-wider text-[13px] h-[50px] rounded-sm transition-all duration-200 disabled:opacity-60 disabled:active:scale-100"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Processing...</span>
          </>
        ) : (
          <>
            <ShoppingCart className="w-4 h-4" />
            <span>Pay Now</span>
          </>
        )}
      </button>
    </>
  );
}
