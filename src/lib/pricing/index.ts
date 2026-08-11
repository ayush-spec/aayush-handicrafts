/**
 * Rate-linked silver pricing.
 *
 * Every product price = (weightGrams × effective silver rate) + making charge.
 * GST (siteConfig.legal.taxRate) is applied on top of metal + making.
 *
 * All amounts are in ₹ (rupees) unless suffixed `Paise`.
 */

import { siteConfig } from '@/config/site.config';
import { client } from '@/lib/sanity/client';
import type { Product, SilverRateSettings } from '@/types/sanity';

// ─── Rate ────────────────────────────────────────────────

export interface ResolvedRate {
  /** ₹ per kg, 999 purity. */
  ratePerKg: number;
  /** ₹ per gram, 999 purity. */
  ratePerGram: number;
  source: 'manual' | 'market' | 'fallback';
  updatedAt?: string;
}

/**
 * Resolve the effective silver rate.
 * Priority: Sanity manual override → Sanity market rate → config fallback.
 */
export async function getEffectiveRate(): Promise<ResolvedRate> {
  try {
    const settings = await client.fetch<SilverRateSettings | null>(
      `*[_type == "silverRateSettings"][0] {
        _id, marketRatePerKg, manualRatePerKg, source, updatedAt
      }`,
      {},
      { next: { revalidate: 300 } }
    );
    if (settings?.manualRatePerKg && settings.manualRatePerKg > 0) {
      return {
        ratePerKg: settings.manualRatePerKg,
        ratePerGram: settings.manualRatePerKg / 1000,
        source: 'manual',
        updatedAt: settings.updatedAt,
      };
    }
    if (settings?.marketRatePerKg && settings.marketRatePerKg > 0) {
      return {
        ratePerKg: settings.marketRatePerKg,
        ratePerGram: settings.marketRatePerKg / 1000,
        source: 'market',
        updatedAt: settings.updatedAt,
      };
    }
  } catch (err) {
    console.error('[pricing] Failed to fetch silver rate, using fallback:', err);
  }
  return {
    ratePerKg: siteConfig.silver.fallbackRatePerKg,
    ratePerGram: siteConfig.silver.fallbackRatePerKg / 1000,
    source: 'fallback',
  };
}

// ─── Making charge ───────────────────────────────────────

export function computeMakingCharge(
  product: Pick<Product, 'weightGrams' | 'makingType' | 'makingValue'>,
  metalValue: number
): number {
  switch (product.makingType) {
    case 'per_gram':
      return product.weightGrams * product.makingValue;
    case 'percentage':
      return (metalValue * product.makingValue) / 100;
    case 'flat':
    default:
      return product.makingValue;
  }
}

// ─── Price breakdown ─────────────────────────────────────

export interface PriceBreakdown {
  /** ₹/gram rate used (999 purity). */
  ratePerGram: number;
  /** Purity-adjusted ₹/gram (925 → ×0.925). */
  effectiveRatePerGram: number;
  metalValue: number;
  makingCharge: number;
  /** metalValue + makingCharge, pre-tax. */
  taxable: number;
  tax: number;
  /** Final customer price, tax included, rounded to nearest ₹. */
  total: number;
}

const PURITY_FACTOR: Record<Product['purity'], number> = {
  '999': 1,
  '925': 0.925,
};

/**
 * Compute the full price breakdown for a product at a given rate.
 * Prices are tax-inclusive in display; `tax` is the contained GST amount.
 */
export function computePriceBreakdown(
  product: Pick<Product, 'weightGrams' | 'purity' | 'makingType' | 'makingValue'>,
  rate: Pick<ResolvedRate, 'ratePerGram'>
): PriceBreakdown {
  const effectiveRatePerGram = rate.ratePerGram * (PURITY_FACTOR[product.purity] ?? 1);
  const metalValue = product.weightGrams * effectiveRatePerGram;
  const makingCharge = computeMakingCharge(product, metalValue);
  const taxable = metalValue + makingCharge;
  const tax = taxable * siteConfig.legal.taxRate;
  return {
    ratePerGram: rate.ratePerGram,
    effectiveRatePerGram,
    metalValue: round2(metalValue),
    makingCharge: round2(makingCharge),
    taxable: round2(taxable),
    tax: round2(tax),
    total: Math.round(taxable + tax),
  };
}

/** Convenience: compute display price (tax-inclusive ₹) for a product. */
export function computeDisplayPrice(
  product: Pick<Product, 'weightGrams' | 'purity' | 'makingType' | 'makingValue'>,
  rate: Pick<ResolvedRate, 'ratePerGram'>
): number {
  return computePriceBreakdown(product, rate).total;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

// ─── Attach computed prices ──────────────────────────────

/**
 * Attach the computed display `price` to products fetched from Sanity.
 * Server-side only — call after every product query so client components
 * can keep using `product.price`.
 */
export function withComputedPrices<T extends Product>(
  products: T[],
  rate: Pick<ResolvedRate, 'ratePerGram'>
): T[] {
  return products.map((p) => ({ ...p, price: computeDisplayPrice(p, rate) }));
}

export function withComputedPrice<T extends Product>(
  product: T,
  rate: Pick<ResolvedRate, 'ratePerGram'>
): T {
  return { ...product, price: computeDisplayPrice(product, rate) };
}
