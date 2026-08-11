# Aayush Handicrafts

Handcrafted silver e-commerce — silverware, pooja essentials, and coins — with **live rate-linked pricing**: every price is computed from the Indian market silver rate plus making charges, plus GST.

## Stack

Next.js 14 · TypeScript · Tailwind · Sanity CMS · Neon PostgreSQL + Drizzle · Razorpay · MSG91 · Resend · Zustand

## Develop

```bash
cp .env.local.example .env.local   # fill in keys
bun install
bun run dev
```

## Key concepts

- No stored product prices — see `src/lib/pricing/`
- Silver rate: daily cron → Sanity singleton, manual override supported
- Coupons discount making charges only
- Brand config: `src/config/site.config.ts` (+ color tokens in `globals.css` / `tailwind.config.ts`)

See `CLAUDE.md` for the full architecture guide.
