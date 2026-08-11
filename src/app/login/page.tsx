'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Button } from '@/components/ui';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/useToast';

function LoginContent() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/account';
  const error = searchParams.get('error');
  const { showToast } = useToast();

  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const startCountdown = () => {
    setCountdown(30);
    const interval = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(interval);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  };

  const handleSendOtp = async () => {
    if (phone.length !== 10) {
      showToast('Enter a valid 10-digit mobile number', 'error');
      return;
    }

    setIsSending(true);
    try {
      const res = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.message || 'Failed to send OTP', 'error');
        return;
      }

      setStep('otp');
      startCountdown();
      showToast('OTP sent to your WhatsApp', 'success');
    } catch {
      showToast('Something went wrong', 'error');
    } finally {
      setIsSending(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      showToast('Enter the 6-digit OTP', 'error');
      return;
    }

    setIsVerifying(true);
    try {
      const res = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.message || 'Invalid OTP', 'error');
        return;
      }

      window.location.href = redirectTo;
    } catch {
      showToast('Verification failed', 'error');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `/api/auth/google?redirect=${encodeURIComponent(redirectTo)}`;
  };

  return (
    <div className="pt-header">
      <div className="max-w-sm mx-auto px-4 py-12 md:py-20">
        <h1 className="type-h2 text-ivory mb-2 text-center">Login</h1>
        <p className="text-ivory/45 text-sm text-center mb-8">
          Sign in to track orders, save addresses, and get exclusive discounts.
        </p>

        {error === 'auth_failed' && (
          <p className="text-red-500 text-sm text-center mb-4">
            Authentication failed. Please try again.
          </p>
        )}

        {/* Google Login */}
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 border border-ivory/15 rounded-sm h-[50px] text-sm font-medium text-ivory/75 hover:bg-secondary transition-colors mb-6"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Continue with Google
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs uppercase tracking-widest text-ivory/35">or</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Phone OTP */}
        {step === 'phone' ? (
          <div>
            <label className="block text-xs uppercase tracking-widest text-ivory/45 mb-2">
              Mobile Number
            </label>
            <div className="flex gap-2">
              <span className="flex items-center justify-center w-14 h-[50px] border border-ivory/15 rounded-sm text-sm text-ivory/45 bg-secondary">
                +91
              </span>
              <input
                type="tel"
                inputMode="numeric"
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                placeholder="10-digit number"
                className="flex-1 h-[50px] border border-ivory/15 rounded-sm px-3 text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <Button
              fullWidth
              size="lg"
              className="mt-4"
              onClick={handleSendOtp}
              disabled={isSending || phone.length !== 10}
            >
              {isSending ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending...
                </span>
              ) : (
                'Send OTP via WhatsApp'
              )}
            </Button>
          </div>
        ) : (
          <div>
            <label className="block text-xs uppercase tracking-widest text-ivory/45 mb-2">
              Enter OTP sent to +91{phone}
            </label>
            <input
              type="tel"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              placeholder="6-digit OTP"
              className="w-full h-[50px] border border-ivory/15 rounded-sm px-3 text-sm text-center tracking-[0.5em] font-medium focus:outline-none focus:border-primary transition-colors"
              autoFocus
            />
            <Button
              fullWidth
              size="lg"
              className="mt-4"
              onClick={handleVerifyOtp}
              disabled={isVerifying || otp.length !== 6}
            >
              {isVerifying ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verifying...
                </span>
              ) : (
                'Verify &amp; Login'
              )}
            </Button>

            <div className="flex items-center justify-between mt-4">
              <button
                onClick={() => {
                  setStep('phone');
                  setOtp('');
                }}
                className="text-xs text-ivory/45 hover:text-ivory/75 transition-colors"
              >
                Change number
              </button>
              <button
                onClick={handleSendOtp}
                disabled={countdown > 0 || isSending}
                className="text-xs text-primary hover:text-primary/80 transition-colors disabled:text-gray-300"
              >
                {countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="pt-header">
          <div className="max-w-sm mx-auto px-4 py-12 md:py-20">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-secondary rounded-sm max-w-[200px] mx-auto" />
              <div className="h-4 bg-secondary rounded-sm max-w-[300px] mx-auto" />
              <div className="h-[50px] bg-secondary rounded-sm" />
            </div>
          </div>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
