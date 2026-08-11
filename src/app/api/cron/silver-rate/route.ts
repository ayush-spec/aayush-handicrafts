import { NextRequest, NextResponse } from 'next/server';
import { writeClient } from '@/lib/sanity/client';

export const dynamic = 'force-dynamic';

/**
 * Daily cron: fetch the Indian market silver rate and store it on the
 * `silverRateSettings` singleton in Sanity.
 *
 * Source: GoodReturns (goodreturns.in) publishes daily Indian silver rates
 * per kg. Scraping is best-effort — if the fetch or parse fails, the last
 * stored rate (or the manual override / config fallback) keeps serving,
 * so pricing never goes down.
 *
 * Secure with CRON_SECRET — Vercel Cron sends it as a Bearer token.
 * vercel.json:
 *   { "crons": [{ "path": "/api/cron/silver-rate", "schedule": "0 3 * * *" }] }
 */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = request.headers.get('authorization');
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
  }

  if (!process.env.SANITY_API_TOKEN) {
    return NextResponse.json(
      { message: 'SANITY_API_TOKEN not configured' },
      { status: 500 }
    );
  }

  try {
    const res = await fetch('https://www.goodreturns.in/silver-rates/', {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      },
      next: { revalidate: 0 },
    });
    if (!res.ok) throw new Error(`GoodReturns HTTP ${res.status}`);
    const html = await res.text();

    // Look for a "₹ per kg" figure — the page shows rates per gram and per kg.
    // Match patterns like "₹95,000" near "kg". Take the largest plausible
    // 5–6 digit comma-formatted number as the per-kg rate.
    const matches = [...html.matchAll(/₹\s?([\d,]{5,})/g)]
      .map((m) => parseInt(m[1].replace(/,/g, ''), 10))
      .filter((n) => n >= 50_000 && n <= 500_000); // sane silver ₹/kg band

    if (matches.length === 0) {
      throw new Error('Could not parse silver rate from source page');
    }

    const ratePerKg = Math.max(...matches);

    // Upsert the singleton.
    const existing = await writeClient.fetch<{ _id: string } | null>(
      `*[_type == "silverRateSettings"][0]{ _id }`
    );
    const doc = {
      _type: 'silverRateSettings',
      marketRatePerKg: ratePerKg,
      source: 'goodreturns.in',
      updatedAt: new Date().toISOString(),
    };
    if (existing) {
      await writeClient.patch(existing._id).set(doc).commit();
    } else {
      await writeClient.create(doc);
    }

    console.log(`[cron/silver-rate] updated market rate: ₹${ratePerKg}/kg`);
    return NextResponse.json({ ok: true, ratePerKg });
  } catch (err) {
    // Never hard-fail pricing — old rate keeps serving.
    console.error('[cron/silver-rate] fetch failed:', err);
    return NextResponse.json(
      { ok: false, message: 'Rate fetch failed; previous rate retained' },
      { status: 502 }
    );
  }
}
