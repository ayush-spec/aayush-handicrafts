# Aayush Handicrafts — Setup Checklist

Everything needed to take the store from code-complete to live. Do these in order; each section lists where to get the values and where to put them.

All env vars go in `.env.local` (copy from `.env.local.example`).

---

## 1. Sanity (CMS — products, silver rate, coupons)

1. Create a project at https://www.sanity.io/manage → **New project** → dataset `production`.
2. Copy the **Project ID** → `NEXT_PUBLIC_SANITY_PROJECT_ID`.
3. In project settings → **API** → create a token with **Editor** (write) access → `SANITY_API_TOKEN` (needed for the seed script + cron rate upserts).
4. **CORS origins**: add `http://localhost:3000` and your production domain (allow credentials).
5. Push the schema: `bunx sanity schema deploy` (or it deploys automatically on first Studio visit).
6. Open Studio at `http://localhost:3000/studio` to confirm it loads.
7. Seed launch products: `bun run seed` (uploads the 8 products; making charges are ₹0 placeholders — set them in Studio).
8. In Studio, open **Silver Rate Settings** and set a `manualRatePerKg` (₹ per kg) so pricing works before the cron runs.

## 2. Neon (PostgreSQL — orders, users)

1. Create a project at https://console.neon.tech → copy the pooled connection string → `DATABASE_URL`.
2. Push the schema (includes the order breakdown columns):
   ```bash
   bunx drizzle-kit push
   ```

## 3. Razorpay (payments)

1. Dashboard → Settings → API Keys → generate **test** keys → `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET`.
2. Settings → Webhooks → add `https://<domain>/api/webhooks/razorpay`, subscribe to payment/order events → `RAZORPAY_WEBHOOK_SECRET`.
3. Switch to live keys at launch.

## 4. Resend (order confirmation + contact emails)

1. https://resend.com → API key → `RESEND_API_KEY`.
2. Verify your sending domain (DNS records) so `ORDER_EMAIL_FROM` / `CONTACT_EMAIL_FROM` work; until then use `onboarding@resend.dev` for testing.
3. Set `CONTACT_EMAIL` to the owner's real inbox.

## 5. Auth

1. Generate secrets:
   ```bash
   openssl rand -hex 32   # run twice
   ```
   → `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`.
2. Google OAuth: https://console.cloud.google.com → create OAuth client (Web) → authorized redirect URI `https://<domain>/api/auth/google/callback` (+ localhost for dev) → `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`.

## 6. MSG91 (WhatsApp OTP login)

1. https://msg91.com → Auth key → `MSG91_AUTH_KEY`.
2. Create an OTP template → `MSG91_TEMPLATE_ID`; sender ID → `MSG91_SENDER_ID`.

## 7. Cron (daily silver rate)

1. `openssl rand -hex 32` → `CRON_SECRET`.
2. Vercel Cron is already configured (`vercel.json`, daily 03:00 UTC → `/api/cron/silver-rate`). Just make sure `CRON_SECRET` is set in Vercel env vars.
3. Note: the GoodReturns scraper selector is heuristic — verify it once against the live page, or rely on the Sanity manual override.

## 8. Admin + brand config

1. `ADMIN_EMAIL` = owner's email (grants admin access).
2. Fill in `src/config/site.config.ts` (search `TODO(brand)`): address, email, Instagram, **GSTIN**, shipping thresholds.
3. Replace placeholder assets: `/public/logos/*`, `/public/landingpagelogo.jpg`.
4. Legal review of policy pages (still upstream text).

---

## Verify

```bash
bun run dev        # http://localhost:3000
bun run build      # must pass
```

- [ ] Landing renders with seeded products in the Vortex hero
- [ ] Product page shows live rate-linked price
- [ ] Test checkout end-to-end with Razorpay test card
- [ ] Order confirmation email arrives
- [ ] Studio edits (making charge, manual rate) reflect on site

## Deploy

Push to Vercel, add all env vars there, then update: Google OAuth redirect URIs, Razorpay webhook URL, Sanity CORS origins.
