import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Account | Aayush Handicrafts',
  description: 'Manage your Aayush Handicrafts account, orders, and addresses.',
};

const NAV_ITEMS = [
  { href: '/account', label: 'Profile' },
  { href: '/account/orders', label: 'Orders' },
  { href: '/account/addresses', label: 'Addresses' },
];

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="pt-header">
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-10">
        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 md:gap-10">
          {/* Sidebar — desktop: vertical, mobile: horizontal scroll */}
          <nav className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0 border-b md:border-b-0 md:border-r border-ivory/10 md:pr-6">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="whitespace-nowrap text-sm uppercase tracking-widest text-ivory/45 hover:text-ivory transition-colors px-3 py-2 md:px-0"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Content */}
          <div className="min-w-0">{children}</div>
        </div>
      </div>
    </div>
  );
}
