'use client';

import { Suspense, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('razorpay_order_id');
  const { clearCart } = useCart();
  const clearedRef = useRef(false);

  useEffect(() => {
    if (orderId && !clearedRef.current) {
      clearedRef.current = true;
      clearCart();
    }
  }, [orderId, clearCart]);

  return (
    <div className="pt-header">
      <div className="max-w-2xl mx-auto px-4 md:px-6 py-12 md:py-20 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" strokeWidth={1.5} />

        <h1 className="type-h2 text-ivory mb-3">
          Thank You!
        </h1>
        <p className="text-ivory/55 text-lg mb-2">
          Your order has been placed successfully.
        </p>
        <p className="text-ivory/45 text-sm mb-8">
          You&apos;ll receive a confirmation email with your order details and tracking
          information once your order ships.
        </p>

        {orderId && (
          <p className="text-xs text-ivory/35 mb-8">
            Order reference: {orderId.slice(-8).toUpperCase()}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/shop">
            <Button variant="primary" size="lg">
              Continue Shopping
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" size="lg">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="pt-header">
          <div className="max-w-2xl mx-auto px-4 md:px-6 py-12 md:py-20 text-center">
            <div className="animate-pulse space-y-4">
              <div className="w-16 h-16 bg-secondary rounded-full mx-auto" />
              <div className="h-8 bg-secondary rounded-sm max-w-xs mx-auto" />
              <div className="h-4 bg-secondary rounded-sm max-w-sm mx-auto" />
            </div>
          </div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
