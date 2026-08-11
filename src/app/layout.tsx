import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ToastProvider } from "@/components/ui/ToastProvider";
import { MobileMenuProvider } from "@/contexts/MobileMenuContext";
import MobileMenu from "@/components/layout/MobileMenu";
import SwipeBackIndicator from "@/components/layout/SwipeBackIndicator";
import SmoothScroll from "@/components/layout/SmoothScroll";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

// Placeholder brand fonts — swap via config when the identity lands.
// Variable names kept (--font-gotham / --font-maragsa) so the design
// system in globals.css/tailwind.config.ts stays untouched.

// Inter (variable) for body text (replaces Gotham)
const gotham = localFont({
  src: "../fonts/inter-latin.woff2",
  variable: "--font-gotham",
  display: "swap",
});

// Cormorant Garamond for display headings (replaces Maragsa)
const maragsaDisplay = localFont({
  src: [
    { path: "../fonts/cormorant-regular.woff2", weight: "300 500", style: "normal" },
    { path: "../fonts/cormorant-italic.woff2", weight: "300 500", style: "italic" },
  ],
  variable: "--font-maragsa",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aayush Handicrafts | Handcrafted Silver",
  description: "Handcrafted silver — silverware, pooja essentials, and coins, priced on the live Indian silver rate.",
  icons: {
    icon: "/logos/monkeylogo.png",
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${gotham.variable} ${maragsaDisplay.variable}`}>
      <body className="font-sans antialiased flex flex-col min-h-screen">
        <SmoothScroll>
          <ToastProvider>
            <MobileMenuProvider>
              <Header />
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
              <MobileMenu />
              <SwipeBackIndicator />
            </MobileMenuProvider>
          </ToastProvider>
          <Analytics />
          <SpeedInsights />
        </SmoothScroll>
      </body>
    </html>
  );
}
