/**
 * Aayush Handicrafts — site configuration.
 * Single source of truth for brand identity, contact details, tax, and
 * shipping thresholds. Edit this file (and globals.css tokens) to rebrand.
 */

export const siteConfig = {
  brand: {
    name: 'Aayush Handicrafts',
    tagline: 'Handcrafted Silver, Made in India',
    // TODO(brand): replace with real socials/handles
    instagram: '@aayush.handicrafts',
    instagramUrl: 'https://instagram.com/aayush.handicrafts',
  },

  contact: {
    // TODO(brand): replace with real contact details
    email: 'hello@aayushhandicrafts.com',
    address: {
      line1: 'TODO — street address',
      city: 'Jaipur',
      state: 'Rajasthan',
      pincode: '302015',
      country: 'India',
    },
  },

  legal: {
    // TODO(brand): GSTIN once registration certificate is available
    gstin: 'TODO-GSTIN',
    currency: 'INR',
    /** GST rate applied to (metal value + making charge). 0.03 = 3% silver articles. */
    taxRate: 0.03,
  },

  shipping: {
    freeShipping: true,
    /** Orders at/above this total (₹) ship with courier insurance. */
    insuredThreshold: 10_000,
    /** Orders at/above this total (₹) require signature/OTP on delivery. */
    signatureThreshold: 25_000,
  },

  silver: {
    /** Fallback rate (₹ per kg, 999 purity) used if Sanity has no rate set. */
    fallbackRatePerKg: 95_000,
    /** Cache duration for the fetched rate (ms). Daily-ish. */
    rateCacheMs: 6 * 60 * 60 * 1000, // 6 hours
  },
} as const;

export type SiteConfig = typeof siteConfig;
