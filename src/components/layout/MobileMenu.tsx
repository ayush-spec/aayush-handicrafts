'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, Instagram, ShoppingCart, User } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { useMobileMenu } from '@/contexts/MobileMenuContext';

const NAV_ITEMS = [
  { href: '/', label: 'Atelier' },
  { href: '/shop', label: 'Collection' },
  { href: '/about', label: 'Our Craft' },
  { href: '/contact', label: 'Enquire' },
  { href: '/cart', label: 'Cart', showBadge: true },
  { href: '/account', label: 'Account', showAuth: true },
];

export default function MobileMenu() {
  const pathname = usePathname();
  const { totalItems, isHydrated } = useCart();
  const { isAuthenticated } = useAuth();
  const { isOpen, closeMenu } = useMobileMenu();

  // Close menu when route changes
  useEffect(() => {
    if (isOpen) {
      closeMenu();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeMenu();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeMenu]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 z-[9998] ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeMenu}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-primary shadow-2xl transform transition-transform duration-300 ease-out z-[9999] flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
      >
        {/* Close Button */}
        <div className="flex items-center justify-end px-[16px] pt-[16px] pb-[8px]">
          <button
            onClick={closeMenu}
            className="p-2 hover:bg-secondary/10 rounded-full transition-colors"
            aria-label="Close menu"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-[24px] overflow-y-auto">
          <ul className="space-y-[4px] text-right">
            {NAV_ITEMS.map((item, index) => {
              const showAuth = (item as { showAuth?: boolean }).showAuth;
              const href = showAuth
                ? isAuthenticated ? '/account' : '/login'
                : item.href;
              const label = showAuth
                ? isAuthenticated ? 'Account' : 'Login'
                : item.label;
              const isActive = pathname === href ||
                (href !== '/' && pathname.startsWith(href));
              const isCart = item.showBadge;

              return (
                <li
                  key={item.href}
                  className={`transition-all duration-300 ${
                    isOpen
                      ? 'opacity-100 translate-x-0'
                      : 'opacity-0 translate-x-4'
                  }`}
                  style={{
                    transitionDelay: isOpen ? `${index * 50}ms` : '0ms'
                  }}
                >
                  <Link
                    href={href}
                    className={`flex items-center justify-end gap-3 py-[6px] text-base font-sans uppercase tracking-wider transition-colors ${
                      isActive
                        ? 'font-bold text-white'
                        : 'text-white/70 hover:text-white'
                    }`}
                  >
                    {isCart ? (
                      <>
                        <ShoppingCart className="w-5 h-5" />
                        {isHydrated && totalItems > 0 && (
                          <span className="flex items-center justify-center min-w-[24px] h-6 px-2 bg-secondary text-primary text-sm font-bold rounded-full">
                            {totalItems}
                          </span>
                        )}
                      </>
                    ) : showAuth ? (
                      <>
                        <User className="w-5 h-5" />
                        <span>{label}</span>
                      </>
                    ) : (
                      <span>{label}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer - Social Links */}
        <div className="px-[24px] py-[16px] border-t border-white/20 text-right">
          <p className="text-sm font-sans uppercase tracking-wider text-white/60 mb-3">
            Follow Us
          </p>
          <div className="flex gap-4 justify-end">
            <a
              href="https://www.instagram.com/aayush.handicrafts/?hl=en"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-secondary/10 hover:bg-secondary hover:text-primary text-white transition-all duration-300"
              aria-label="Follow us on Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-secondary/10 hover:bg-secondary hover:text-primary text-white transition-all duration-300"
              aria-label="WhatsApp"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </a>
          </div>
          <p className="text-xs font-sans text-white/40 mt-4">
            © {new Date().getFullYear()} Aayush Handicrafts
          </p>
        </div>
      </div>
    </>
  );
}
