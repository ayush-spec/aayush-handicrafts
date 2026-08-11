import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION!,
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

const categories = [
  {
    _type: 'category',
    _id: 'category-vases',
    name: 'Vases',
    slug: { _type: 'slug', current: 'vases' },
    description: 'Handcrafted ceramic vases for flowers and display',
    sortOrder: 1,
  },
  {
    _type: 'category',
    _id: 'category-bowls',
    name: 'Bowls',
    slug: { _type: 'slug', current: 'bowls' },
    description: 'Functional and decorative ceramic bowls',
    sortOrder: 2,
  },
  {
    _type: 'category',
    _id: 'category-plates',
    name: 'Plates',
    slug: { _type: 'slug', current: 'plates' },
    description: 'Handmade plates and dinnerware',
    sortOrder: 3,
  },
  {
    _type: 'category',
    _id: 'category-mugs',
    name: 'Mugs',
    slug: { _type: 'slug', current: 'mugs' },
    description: 'Artisan coffee mugs and cups',
    sortOrder: 4,
  },
];

const products = [
  {
    _type: 'product',
    title: 'Rustic Terracotta Vase',
    slug: { _type: 'slug', current: 'rustic-terracotta-vase' },
    price: 85,
    stockQuantity: 3,
    isFeatured: true,
    isBestseller: false,
    category: { _type: 'reference', _ref: 'category-vases' },
    description: [
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'Handcrafted terracotta vase with organic texture and warm earth tones. Perfect for dried flowers or standalone display. Each piece unique with slight variations.',
          },
        ],
        style: 'normal',
      },
    ],
    dimensions: {
      height: 12,
      width: 6,
      depth: 6,
    },
    weight: 3.5,
    materials: ['Terracotta', 'Natural glaze'],
    careInstructions: 'Hand wash only. Not food-safe.',
    createdAt: new Date().toISOString(),
  },
  {
    _type: 'product',
    title: 'Ceramic Bud Vase Set',
    slug: { _type: 'slug', current: 'ceramic-bud-vase-set' },
    price: 45,
    stockQuantity: 8,
    isFeatured: false,
    isBestseller: true,
    category: { _type: 'reference', _ref: 'category-vases' },
    description: [
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'Set of three small ceramic bud vases in complementary neutral tones. Perfect for single stems or small bouquets.',
          },
        ],
        style: 'normal',
      },
    ],
    dimensions: {
      height: 5,
      width: 2.5,
      depth: 2.5,
    },
    weight: 1.2,
    materials: ['Stoneware', 'Matte glaze'],
    careInstructions: 'Hand wash recommended. Water-tight.',
    createdAt: new Date().toISOString(),
  },
  {
    _type: 'product',
    title: 'Large Stoneware Mixing Bowl',
    slug: { _type: 'slug', current: 'large-stoneware-mixing-bowl' },
    price: 65,
    stockQuantity: 5,
    isFeatured: false,
    isBestseller: true,
    category: { _type: 'reference', _ref: 'category-bowls' },
    description: [
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'Versatile mixing bowl for cooking and serving. Durable stoneware construction with smooth interior glaze. Microwave and dishwasher safe.',
          },
        ],
        style: 'normal',
      },
    ],
    dimensions: {
      height: 5,
      width: 10,
      depth: 10,
    },
    weight: 4.0,
    materials: ['Stoneware', 'Food-safe glaze'],
    careInstructions: 'Dishwasher safe. Oven safe up to 450°F.',
    createdAt: new Date().toISOString(),
  },
  {
    _type: 'product',
    title: 'Small Ceramic Serving Bowl',
    slug: { _type: 'slug', current: 'small-ceramic-serving-bowl' },
    price: 38,
    stockQuantity: 12,
    isFeatured: false,
    isBestseller: false,
    category: { _type: 'reference', _ref: 'category-bowls' },
    description: [
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'Perfect size for side dishes, snacks, or desserts. Beautiful reactive glaze creates unique patterns on each piece.',
          },
        ],
        style: 'normal',
      },
    ],
    dimensions: {
      height: 3,
      width: 6,
      depth: 6,
    },
    weight: 1.5,
    materials: ['Stoneware', 'Reactive glaze'],
    careInstructions: 'Dishwasher and microwave safe.',
    createdAt: new Date().toISOString(),
  },
  {
    _type: 'product',
    title: 'Handpainted Dinner Plate Set',
    slug: { _type: 'slug', current: 'handpainted-dinner-plate-set' },
    price: 120,
    stockQuantity: 2,
    isFeatured: true,
    isBestseller: false,
    category: { _type: 'reference', _ref: 'category-plates' },
    description: [
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'Set of four dinner plates with hand-painted geometric patterns. Each plate features unique brush strokes. Perfect for everyday or special occasions.',
          },
        ],
        style: 'normal',
      },
    ],
    dimensions: {
      height: 1,
      width: 10.5,
      depth: 10.5,
    },
    weight: 6.0,
    materials: ['Porcelain', 'Lead-free glaze'],
    careInstructions: 'Dishwasher safe. Not microwave safe (metallic accents).',
    createdAt: new Date().toISOString(),
  },
  {
    _type: 'product',
    title: 'Rustic Salad Plate',
    slug: { _type: 'slug', current: 'rustic-salad-plate' },
    price: 28,
    stockQuantity: 15,
    isFeatured: false,
    isBestseller: true,
    category: { _type: 'reference', _ref: 'category-plates' },
    description: [
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'Charming salad plate with rustic speckled glaze. Perfect for appetizers, desserts, or small meals.',
          },
        ],
        style: 'normal',
      },
    ],
    dimensions: {
      height: 0.75,
      width: 8,
      depth: 8,
    },
    weight: 1.8,
    materials: ['Stoneware', 'Speckled glaze'],
    careInstructions: 'Dishwasher and microwave safe.',
    createdAt: new Date().toISOString(),
  },
  {
    _type: 'product',
    title: 'Morning Coffee Mug',
    slug: { _type: 'slug', current: 'morning-coffee-mug' },
    price: 32,
    stockQuantity: 8,
    isFeatured: false,
    isBestseller: true,
    category: { _type: 'reference', _ref: 'category-mugs' },
    description: [
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'Handcrafted coffee mug with comfortable handle. Holds 12oz. Available in warm terracotta tone with natural glaze variations.',
          },
        ],
        style: 'normal',
      },
    ],
    dimensions: {
      height: 4,
      width: 3.5,
      depth: 3.5,
    },
    weight: 0.8,
    materials: ['Stoneware', 'Food-safe glaze'],
    careInstructions: 'Dishwasher and microwave safe.',
    createdAt: new Date().toISOString(),
  },
  {
    _type: 'product',
    title: 'Large Tea Mug with Infuser',
    slug: { _type: 'slug', current: 'large-tea-mug-with-infuser' },
    price: 48,
    stockQuantity: 4,
    isFeatured: true,
    isBestseller: false,
    category: { _type: 'reference', _ref: 'category-mugs' },
    description: [
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'Generous 16oz tea mug with removable stainless steel infuser. Perfect for loose leaf tea lovers. Includes matching lid.',
          },
        ],
        style: 'normal',
      },
    ],
    dimensions: {
      height: 5,
      width: 4,
      depth: 4,
    },
    weight: 1.2,
    materials: ['Porcelain', 'Stainless steel infuser'],
    careInstructions: 'Hand wash recommended. Mug is microwave safe (remove infuser).',
    createdAt: new Date().toISOString(),
  },
];

async function seed() {
  console.log('🌱 Seeding Sanity with categories and products...\n');

  // Create categories
  console.log('Creating categories...');
  for (const category of categories) {
    try {
      await client.createOrReplace(category);
      console.log(`✅ Created category: ${category.name}`);
    } catch (error) {
      console.error(`❌ Error creating category ${category.name}:`, error);
    }
  }

  console.log('\nCreating products...');
  for (const product of products) {
    try {
      await client.create(product);
      console.log(`✅ Created product: ${product.title}`);
    } catch (error) {
      console.error(`❌ Error creating product ${product.title}:`, error);
    }
  }

  console.log('\n✨ Seeding complete! Visit http://localhost:3000/studio to see your products.');
}

seed().catch(console.error);
