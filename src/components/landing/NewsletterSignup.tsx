'use client';

import { useState, useRef } from 'react';
import { Mail, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/useToast';

export function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [focused, setFocused] = useState(false);
  const toast = useToast();
  const isActive = focused || email.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSubscribed(true);
        setEmail('');
        toast.success('Welcome! Check your email for a special discount code.');
      } else {
        toast.error(data.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      toast.error('Failed to subscribe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubscribed) {
    return (
      <div className="flex flex-col items-center justify-center text-center">
        <CheckCircle className="w-10 h-10 text-accent-green mb-4" />
        <h2 className="type-h4 mb-3 text-ivory">
          You&apos;re All Set!
        </h2>
        <p className="type-body text-ivory/55">
          Check your inbox for a welcome email with your exclusive 10% discount code.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Icon */}
      <Mail className="w-10 h-10 text-primary mb-4" />

      {/* Heading */}
      <p className="type-label text-primary mb-2">Community</p>
      <h2 className="type-h4 mb-3 text-ivory">
        Join Our Community
      </h2>

      {/* Subtext */}
      <p className="type-body text-ivory/55 mb-6">
        Get 10% off your first order! Plus exclusive launches, behind-the-scenes stories, and pottery tips.
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="relative">
          <label
            htmlFor="newsletter-email"
            className={`absolute left-0 transition-all duration-300 pointer-events-none font-sans ${
              isActive
                ? 'text-[10px] tracking-widest uppercase top-0 text-ivory/35'
                : 'text-base top-6 text-ivory/35'
            }`}
          >
            Enter your email
          </label>
          <input
            id="newsletter-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="w-full bg-transparent pt-4 pb-3 text-base text-ivory outline-none border-b border-ivory/10 focus:border-gray-900 transition-colors duration-300"
            autoComplete="email"
            required
          />
          {/* Animated focus line */}
          <div
            className={`absolute bottom-0 left-0 h-[2px] bg-gray-900 transition-all duration-500 ease-out ${
              focused ? 'w-full' : 'w-0'
            }`}
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="text-primary hover:text-ivory transition-colors text-sm md:text-base tracking-widest uppercase whitespace-nowrap disabled:opacity-50 mt-4"
        >
          {isSubmitting ? 'Subscribing...' : 'Subscribe \u2192'}
        </button>
      </form>

      {/* Privacy note */}
      <p className="text-xs text-ivory/35 mt-auto">
        We respect your privacy. Unsubscribe anytime.
      </p>
    </div>
  );
}
