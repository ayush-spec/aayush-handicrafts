'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { useMobileMenu } from '@/contexts/MobileMenuContext';

const SCROLL_THRESHOLD = 80;

const NAV_ITEMS = [
  { label: 'Atelier', href: '/' },
  { label: 'Collection', href: '/shop' },
  { label: 'Our Craft', href: '/about' },
  { label: 'Enquire', href: '/contact' },
  { label: 'FAQ', href: '/faq' },
];

export default function Header() {
  const { totalItems } = useCart();
  const { isAuthenticated } = useAuth();
  const { openMenu } = useMobileMenu();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  const isHomePage = pathname === '/';
  const isShopPage = pathname === '/shop' || pathname.startsWith('/shop/');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > SCROLL_THRESHOLD);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const whiteText = isHomePage;
  const textColor = whiteText ? 'text-white' : 'text-ivory/75';
  const textHover = whiteText ? 'hover:text-white/80' : 'hover:text-ivory';
  const separatorColor = whiteText ? 'bg-white/20' : 'bg-ivory/15';

  return (
    <>
      {/* Full header */}
      <header
        className={`fixed top-0 left-0 right-0 z-[60] pt-safe transition-all duration-300 ${
          scrolled
            ? isShopPage
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 -translate-y-full pointer-events-none'
            : 'opacity-100 translate-y-0'
        } ${isShopPage ? 'md:bg-secondary' : ''}`}
        style={whiteText && !scrolled ? { background: 'linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 100%)' } : undefined}
      >
        {/* Mobile nav — unchanged */}
        <nav className="md:hidden mx-auto px-[8px] py-1 h-header">
          <div className="relative flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="relative w-10 h-10 flex items-center justify-center">
                <Image
                  src="/logos/monkeylogo.png"
                  alt="Aayush Handicrafts Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                  priority
                />
              </div>
            </Link>

            {/* Cart Icon & Mobile Menu Button */}
            <div className="flex items-center space-x-2">
              <Link
                href="/cart"
                className={`relative p-1.5 rounded-sm transition-colors ${whiteText ? 'hover:bg-white/10' : 'hover:bg-ivory/5'}`}
              >
                <svg
                  className={`w-5 h-5 ${whiteText ? 'text-white' : 'text-ivory/75'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-primary text-[#0F0E0D] rounded-full w-3.5 h-3.5 flex items-center justify-center text-[9px] leading-none font-bold">
                    {totalItems}
                  </span>
                )}
              </Link>

              <button
                onClick={openMenu}
                className={`p-1.5 rounded-sm transition-colors ${whiteText ? 'hover:bg-white/10' : 'hover:bg-ivory/5'}`}
                aria-label="Open menu"
              >
                <svg
                  className={`w-5 h-5 ${whiteText ? 'text-white' : 'text-ivory/75'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </nav>

        {/* Desktop nav — 7-column grid */}
        <div className="hidden md:grid grid-cols-7 w-full items-center h-header px-4">
          {/* Col 1: Logo */}
          <div className="flex items-center justify-end">
            <Link href="/">
              <div className="relative w-8 h-8 flex items-center justify-center">
                <Image
                  src="/logos/monkeylogo.png"
                  alt="Aayush Handicrafts Logo"
                  width={32}
                  height={32}
                  className="object-contain"
                  priority
                />
              </div>
            </Link>
          </div>

          {/* Col 2-6: Nav links */}
          {NAV_ITEMS.map((item) => (
            <div key={item.href} className="flex items-center justify-end gap-3">
              <Link
                href={item.href}
                className={`font-sans text-sm tracking-wider uppercase whitespace-nowrap transition-colors ${textColor} ${textHover}`}
              >
                {item.label}
              </Link>
            </div>
          ))}

          {/* Col 7: Profile icon + Cart */}
          <div className="flex items-center justify-end gap-3">
            <Link
              href={isAuthenticated ? '/account' : '/login'}
              className={`transition-colors opacity-60 hover:opacity-100 ${textColor}`}
              aria-label={isAuthenticated ? 'Account' : 'Login'}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </Link>
            <Link
              href="/cart"
              className={`relative font-sans text-sm tracking-wider uppercase whitespace-nowrap transition-colors ${
                totalItems > 0 ? 'text-primary' : textColor
              } ${textHover}`}
            >
              Cart
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-2.5 text-primary text-[8px] font-bold leading-none">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Sticky icon — visible when scrolled */}
      <div
        className={`fixed top-4 right-[8px] md:right-4 z-[60] transition-all duration-300 ${
          isShopPage
            ? 'hidden'
            : scrolled
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        {/* Desktop: cart icon (hidden on shop page since header stays visible) */}
        <Link
          href="/cart"
          className={`${isShopPage ? 'hidden' : 'hidden md:flex'} relative p-1.5 bg-primary rounded-sm shadow-md hover:bg-primary/90 transition-colors`}
        >
          <svg
            className="w-5 h-5 text-[#0F0E0D]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          {totalItems > 0 && (
            <span className="absolute -top-0.5 -right-0.5 bg-primary text-[#0F0E0D] rounded-full w-3.5 h-3.5 flex items-center justify-center text-[9px] leading-none font-bold">
              {totalItems}
            </span>
          )}
        </Link>

        {/* Mobile: hamburger icon */}
        <button
          onClick={openMenu}
          className="md:hidden p-1.5 bg-primary rounded-sm shadow-md hover:bg-primary/90 transition-colors"
          aria-label="Open menu"
        >
          <svg
            className="w-5 h-5 text-[#0F0E0D]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </>
  );
}
