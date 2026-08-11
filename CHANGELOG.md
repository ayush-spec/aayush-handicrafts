# Changelog

## [2026-05-05] — Editorial Luxury Reskin ("Jewel-Box Dark")

Full visual reskin modeled on the reference static site (ayush-spec/aayush-handicrafts),
ported onto the existing Next.js/Sanity/Razorpay stack. E-commerce machinery unchanged.

### Added
- `VortexGallery` — React port of the 3D rotating product ring (auto-rotate, momentum drag, depth blur; mobile = scroll-snap strip); landing hero
- `HoverMaskReveal` — cursor-tracking spotlight reveal cards (touch: IntersectionObserver wipe); "Curated Pieces" section
- `CinematicScroll` — sticky scroll-zoom editorial section (uses `/images/editorial/bangle.jpg`); replaces the pottery ScrollVideoSection on the landing
- Product photography: 8 real products under `public/images/products/` + `scripts/seed-products.ts` (`bun run seed`) to upload them to Sanity with categories, weights, purities
- Landing demo fallback — renders seed photography from `/public` when Sanity has no products yet
- Etsy link in footer; `.lux-img` desaturate→color hover utility for product cards
- Cormorant Garamond (300–500 + italics) as the display font

### Changed
- Palette → jewel-box dark site-wide: bg `#0F0E0D`, ivory `#F4EFE6`, silver accents; all gray/white utility usages remapped to ivory/secondary tokens
- Landing rebuilt: Vortex hero → brand statement → CinematicScroll → Curated Pieces (Mudmonkey sections removed from the page)
- Nav labels: Atelier / Collection / Our Craft / Enquire / FAQ
- About → "Our Craft" (reference editorial: Legacy / Purity / The Creed); Contact → "Enquire" styling
- Default FAQs rewritten (purchase question now explains rate-linked checkout, purity, international shipping, intentional irregularities)
- Footer: dark, "Every piece imperfectly perfect" tagline

### Removed
- HeroVideoSection / ScrollVideoSection / Bestsellers / ShopByCategory / Testimonials / Instagram / InfoSection from the landing (components remain in the repo, unused)

## [2026-05-05] — Initial Fork: Aayush Handicrafts (Silver E-commerce)

Forked from Mudmonkeystudio and transformed into a rate-linked silver store.

### Added
- `src/config/site.config.ts` — single source of truth for brand, contact, GSTIN, tax rate (3% GST), shipping thresholds (insured ≥ ₹10k, signature ≥ ₹25k), silver fallback rate
- `src/lib/pricing/` — rate-linked pricing engine: `getEffectiveRate()` (manual override → market rate → fallback), `computePriceBreakdown()` (metal/making/tax/total), `withComputedPrices()` for attaching display prices server-side
- `sanity/schemas/silverRate.ts` — `silverRateSettings` singleton (market rate, manual override, source, updatedAt)
- `/api/cron/silver-rate` — daily Vercel Cron (see `vercel.json`) scraping the Indian market silver rate into Sanity; `CRON_SECRET`-protected, fail-safe
- Product schema silver fields: `weightGrams`, `purity` (925/999), `isHallmarked`, `makingType` (flat/per_gram/percentage), `makingValue`, `madeToOrder`, `leadTimeDays`
- `src/lib/email/order-confirmation.ts` — Resend order confirmation with full metal/making/GST breakdown, fired from `createOrderFromRazorpay`
- DB columns: `orders.metal_total`/`making_total`; `order_items.metal_value`/`making_charge`/`tax_amount`/`rate_per_gram` (paisa)
- GST line item (3%) computed at checkout; price locked at Razorpay order creation and stored per order item
- Phone normalization (`+91XXXXXXXXXX`) for Razorpay prefill
- `.env.local.example`, fresh `CLAUDE.md`

### Changed
- Coupons now discount the **making charge only** — `/api/coupons/validate` recomputes the making total server-side from cart item IDs + live rate
- `product.price` is computed (rate-linked), never stored; shop filters/sort/pagination compute prices in JS
- Made-to-order products skip stock gates and stock decrement
- Fonts: Fraunces + Inter (local woff2) replacing Maragsa/Gotham, same CSS variables
- Palette: terracotta → deep navy + silver tokens (`globals.css`, `tailwind.config.ts`)
- All brand strings/emails/socials → Aayush Handicrafts; order prefix `AAH-`
- Home/FAQ pages tolerate an unconfigured CMS at build time

### Removed
- Workshops entirely (pages, components, schema, queries, FAQ category, nav links)
- Three.js archived components, Gotham/Maragsa font files, workshop imagery references
