'use client';

import { Hammer, Leaf, Truck, ShieldCheck } from 'lucide-react';

export function TrustBadges() {
  const badges = [
    {
      icon: Hammer,
      label: 'Handmade in India',
    },
    {
      icon: Leaf,
      label: 'Eco-Friendly',
    },
    {
      icon: Truck,
      label: 'Free Shipping ₹999+',
    },
    {
      icon: ShieldCheck,
      label: 'Secure Checkout',
    },
  ];

  return (
    <div className="mt-8 md:mt-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-3xl mx-auto">
        {badges.map((badge, index) => (
          <div
            key={index}
            className="flex flex-col items-center gap-2 text-center"
          >
            <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-primary">
              <badge.icon className="w-full h-full" strokeWidth={1.5} />
            </div>
            <span className="text-xs md:text-sm text-primary font-medium">
              {badge.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
