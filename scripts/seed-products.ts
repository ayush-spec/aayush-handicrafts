/**
 * Seed script — uploads the 8 launch products (images + data) to Sanity.
 *
 * Usage:
 *   bun run scripts/seed-products.ts
 *
 * Requires .env.local: NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET,
 * NEXT_PUBLIC_SANITY_API_VERSION, SANITY_API_TOKEN (write).
 *
 * Idempotent-ish: skips products whose slug already exists.
 * TODO(brand): set real making charges (currently placeholder ₹0 — prices
 * will be metal value only until you edit in Sanity Studio).
 */

import { createClient } from 'next-sanity';
import { config as loadEnv } from 'dotenv';
import { readFileSync, existsSync } from 'fs';
import path from 'path';

loadEnv({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION!,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

const PRODUCTS_DIR = path.join(process.cwd(), 'public/images/products');

interface SeedProduct {
  title: string;
  slug: string;
  category: 'Jewellery' | 'Pooja & Ritual' | 'Home & Tableware';
  description: string;
  weightGrams: number;
  purity: '925' | '999';
  sizeNote: string;
  imageDir: string;
  images: string[];
  isBestseller?: boolean;
  isFeatured?: boolean;
}

const SEED: SeedProduct[] = [
  {
    title: 'Silver Kada / Bangle',
    slug: 'silver-kada-bangle',
    category: 'Jewellery',
    description:
      'An intricate cast bangle handcrafted in Jaipur, India, standing out for its irregularities and imperfect patterns of grace.',
    weightGrams: 132,
    purity: '925',
    sizeNote: '7.62 cm',
    imageDir: 'Silver kada-bangle',
    images: ['1.webp', '2.webp', '3.webp', '4.webp'],
    isBestseller: true,
    isFeatured: true,
  },
  {
    title: 'Kamadhenu Cow with Calf',
    slug: 'kamadhenu-cow-with-calf',
    category: 'Pooja & Ritual',
    description:
      'Kamadhenu, described in Hinduism as "Gou Mata" (cow mother), rendered as a divine silver idol.',
    weightGrams: 185,
    purity: '925',
    sizeNote: '3in × 1in × 2in / 4in × 2in × 2.5in (L×W×H) — 185g / 335g',
    imageDir: 'Kamadhenu Cow with Calf',
    images: ['1.webp', '2.webp', '3.webp'],
    isFeatured: true,
  },
  {
    title: 'Jug with Glasses Set',
    slug: 'jug-with-glasses-set',
    category: 'Home & Tableware',
    description:
      'A handcrafted, dazzling silver jug set with an embossed hexagon design.',
    weightGrams: 1223,
    purity: '999',
    sizeNote: 'Glass 2.5in × 2.5in × 4.5in, Jug 3.5in × 3.5in × 8.5in (L×W×H)',
    imageDir: 'Jug with glasses set',
    images: ['1.webp', '2.webp', '3.webp'],
    isBestseller: true,
    isFeatured: true,
  },
  {
    title: 'Anklet / Payal',
    slug: 'anklet-payal',
    category: 'Jewellery',
    description:
      'A designer anklet for festive occasions — Diwali sparkle with a traditional touch.',
    weightGrams: 150,
    purity: '999',
    sizeNote: '11in × 1in (L×W)',
    imageDir: 'Anklet-Payal',
    images: ['2.webp', 'IMG_5675.webp'],
  },
  {
    title: 'Pooja Thali Set',
    slug: 'pooja-thali-set',
    category: 'Pooja & Ritual',
    description:
      'A four-piece handmade set with shine-matt finish and reverse scallop edge: plate, water container, sweet vessel, and kumkum-rice container — for the home temple.',
    weightGrams: 524,
    purity: '999',
    sizeNote: '9.5in × 9.5in × 1.5in / 6.5in × 6.5in × 1.5in (L×W×H) — 524g / 311g',
    imageDir: 'Pooja Thali',
    images: ['1.webp', '2.webp', '3.webp', '4.webp'],
    isBestseller: true,
  },
  {
    title: 'Trinket Box (Matka Style, Small)',
    slug: 'trinket-box-matka-small',
    category: 'Pooja & Ritual',
    description:
      'A handcrafted matka-style trinket box, matte body with a shiny-finish cover — a small container for sindoor/kumkum.',
    weightGrams: 40,
    purity: '999',
    sizeNote: '1.5in × 1.5in × 1in (L×W×H)',
    imageDir: 'Trinket box',
    images: ['1.webp', '2.webp'],
  },
  {
    title: 'Trinket Box for Sindoor/Kumkum (Tall)',
    slug: 'trinket-box-sindoor-tall',
    category: 'Pooja & Ritual',
    description:
      'A matka-style trinket box, matte-finish body with a shiny-finish cover, easy to carry.',
    weightGrams: 15,
    purity: '999',
    sizeNote: '1in × 1in × 2in (L×W×H)',
    imageDir: 'Trinket box for Sindoor-Kumkum',
    images: ['1.webp', '2.webp', '3.webp'],
  },
  {
    title: 'Charan Paduka — Footprints of God',
    slug: 'charan-paduka-footprints-of-god',
    category: 'Pooja & Ritual',
    description:
      'A symbol of Goddess Laxmi, acting as a medium to receive her holy blessings.',
    weightGrams: 25,
    purity: '999',
    sizeNote: '3in × 1.5in (L×W)',
    imageDir: 'Charan Paduka- Footprints of God',
    images: ['1.webp', '2.webp', '3.webp'],
  },
];

async function ensureCategory(name: string, sortOrder: number): Promise<string> {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const existing = await client.fetch<{ _id: string } | null>(
    `*[_type == "category" && slug.current == $slug][0]{ _id }`,
    { slug }
  );
  if (existing) return existing._id;
  const doc = await client.create({
    _type: 'category',
    name,
    slug: { _type: 'slug', current: slug },
    sortOrder,
  });
  console.log(`  + category: ${name}`);
  return doc._id;
}

async function uploadImage(filePath: string) {
  const asset = await client.assets.upload(
    'image',
    readFileSync(filePath),
    { filename: path.basename(filePath) }
  );
  return {
    _type: 'image' as const,
    _key: asset._id.slice(-8),
    asset: { _type: 'reference' as const, _ref: asset._id },
  };
}

async function main() {
  if (!process.env.SANITY_API_TOKEN) {
    throw new Error('SANITY_API_TOKEN (write) is required');
  }

  const categoryIds = new Map<string, string>();
  const categories: SeedProduct['category'][] = ['Jewellery', 'Pooja & Ritual', 'Home & Tableware'];
  for (let i = 0; i < categories.length; i++) {
    categoryIds.set(categories[i], await ensureCategory(categories[i], i + 1));
  }

  for (const product of SEED) {
    const existing = await client.fetch<{ _id: string } | null>(
      `*[_type == "product" && slug.current == $slug][0]{ _id }`,
      { slug: product.slug }
    );
    if (existing) {
      console.log(`  = skip (exists): ${product.title}`);
      continue;
    }

    const images = [];
    for (const file of product.images) {
      const filePath = path.join(PRODUCTS_DIR, product.imageDir, file);
      if (!existsSync(filePath)) {
        console.warn(`  ! missing image: ${filePath}`);
        continue;
      }
      images.push(await uploadImage(filePath));
    }

    await client.create({
      _type: 'product',
      title: product.title,
      slug: { _type: 'slug', current: product.slug },
      images,
      description: [
        {
          _type: 'block',
          _key: 'desc',
          style: 'normal',
          markDefs: [],
          children: [{ _type: 'span', _key: 'span', text: product.description, marks: [] }],
        },
        {
          _type: 'block',
          _key: 'size',
          style: 'normal',
          markDefs: [],
          children: [{ _type: 'span', _key: 'span', text: `Size: ${product.sizeNote}`, marks: [] }],
        },
      ],
      weightGrams: product.weightGrams,
      purity: product.purity,
      isHallmarked: false, // TODO(brand): mark hallmarked pieces
      makingType: 'flat',
      makingValue: 0, // TODO(brand): real making charges
      madeToOrder: false,
      category: { _type: 'reference', _ref: categoryIds.get(product.category)! },
      stockQuantity: 1,
      isFeatured: product.isFeatured ?? false,
      isBestseller: product.isBestseller ?? false,
      isLimitedEdition: false,
      materials: [product.purity === '925' ? '92.5% Sterling Silver' : '99.9% Fine Silver'],
      averageRating: 0,
      reviewCount: 0,
      createdAt: new Date().toISOString(),
    });
    console.log(`  + product: ${product.title}`);
  }

  console.log('\nSeed complete. Set making charges in Sanity Studio → Products.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
