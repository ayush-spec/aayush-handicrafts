import { defineType, defineField } from 'sanity';
import VideoInput from './components/VideoInput';

export default defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1).max(6),
    }),
    defineField({
      name: 'video',
      title: 'Hero Video',
      type: 'file',
      options: { accept: 'video/mp4,video/webm,video/quicktime' },
      description: 'Hero video \u2014 autoplays muted and loops. Falls back to first image if empty.',
      components: { input: VideoInput },
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [
        {
          type: 'block',
        },
        {
          type: 'image',
          options: {
            hotspot: true,
          },
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'weightGrams',
      title: 'Silver Weight (grams)',
      type: 'number',
      description: 'Fine silver weight — drives rate-linked pricing.',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'purity',
      title: 'Purity',
      type: 'string',
      options: {
        list: [
          { title: '925 (Sterling)', value: '925' },
          { title: '999 (Fine Silver)', value: '999' },
        ],
        layout: 'radio',
      },
      initialValue: '925',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'isHallmarked',
      title: 'BIS Hallmarked',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'makingType',
      title: 'Making Charge Type',
      type: 'string',
      options: {
        list: [
          { title: 'Flat amount (₹)', value: 'flat' },
          { title: 'Per gram (₹/g)', value: 'per_gram' },
          { title: 'Percentage of metal value (%)', value: 'percentage' },
        ],
        layout: 'radio',
      },
      initialValue: 'flat',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'makingValue',
      title: 'Making Charge Value',
      type: 'number',
      description: '₹ amount (flat), ₹ per gram (per_gram), or % (percentage).',
      initialValue: 0,
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'madeToOrder',
      title: 'Made to Order',
      type: 'boolean',
      description: 'Made-to-order pieces do not decrement stock; they show a lead time.',
      initialValue: false,
    }),
    defineField({
      name: 'leadTimeDays',
      title: 'Lead Time (days)',
      type: 'number',
      description: 'Production time for made-to-order pieces.',
      hidden: ({ parent }) => !parent?.madeToOrder,
      validation: (Rule) => Rule.min(1).max(90),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'stockQuantity',
      title: 'Stock Quantity',
      type: 'number',
      description: 'Available inventory',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'isFeatured',
      title: 'Featured Product',
      type: 'boolean',
      description: 'Show on homepage',
      initialValue: false,
    }),
    defineField({
      name: 'isBestseller',
      title: 'Bestseller',
      type: 'boolean',
      description: 'Mark as bestseller',
      initialValue: false,
    }),
    defineField({
      name: 'isLimitedEdition',
      title: 'Limited Edition',
      type: 'boolean',
      description: 'Mark as limited edition (shows urgency badge)',
      initialValue: false,
    }),
    defineField({
      name: 'dimensions',
      title: 'Dimensions',
      type: 'object',
      fields: [
        {
          name: 'height',
          type: 'number',
          title: 'Height (inches)',
        },
        {
          name: 'width',
          type: 'number',
          title: 'Width (inches)',
        },
        {
          name: 'depth',
          type: 'number',
          title: 'Depth (inches)',
        },
      ],
    }),
    defineField({
      name: 'materials',
      title: 'Materials',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'E.g., Sterling silver, Meenakari, Gemstones',
    }),
    defineField({
      name: 'careInstructions',
      title: 'Care Instructions',
      type: 'text',
    }),
    defineField({
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    // Review & Rating Fields
    defineField({
      name: 'averageRating',
      title: 'Average Rating',
      type: 'number',
      description: 'Average customer rating (0-5 scale)',
      validation: (Rule) => Rule.min(0).max(5),
      initialValue: 0,
    }),
    defineField({
      name: 'reviewCount',
      title: 'Review Count',
      type: 'number',
      description: 'Total number of customer reviews',
      validation: (Rule) => Rule.min(0),
      initialValue: 0,
    }),
    // Product Variants
    defineField({
      name: 'variants',
      title: 'Product Variants',
      type: 'array',
      description: 'Add variants for color, size, or material options',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'sku',
              type: 'string',
              title: 'SKU',
              description: 'Unique identifier for this variant (e.g., "red-large")',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'variantType',
              type: 'string',
              title: 'Variant Type',
              description: 'Type of variant (color, size, or material)',
              options: {
                list: [
                  { title: 'Color', value: 'color' },
                  { title: 'Size', value: 'size' },
                  { title: 'Material/Glaze', value: 'material' },
                ],
              },
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'name',
              type: 'string',
              title: 'Display Name',
              description: 'E.g., "Ocean Blue", "Large", "Matte Glaze"',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'value',
              type: 'string',
              title: 'Value',
              description: 'Hex color code (e.g., "#0077BE") or identifier',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'priceModifier',
              type: 'number',
              title: 'Price Modifier',
              description: 'Amount to add/subtract from base price (use 0 for no change)',
              initialValue: 0,
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'stockQuantity',
              type: 'number',
              title: 'Stock Quantity',
              description: 'Available inventory for this variant',
              validation: (Rule) => Rule.required().min(0),
            },
            {
              name: 'images',
              type: 'array',
              title: 'Variant Images',
              description: 'Optional: Images specific to this variant',
              of: [{ type: 'image', options: { hotspot: true } }],
            },
            {
              name: 'isDefault',
              type: 'boolean',
              title: 'Default Variant',
              description: 'Show this variant by default on product page',
              initialValue: false,
            },
          ],
          preview: {
            select: {
              name: 'name',
              type: 'variantType',
              stock: 'stockQuantity',
            },
            prepare: ({ name, type, stock }) => ({
              title: name,
              subtitle: `${type} · Stock: ${stock}`,
            }),
          },
        },
      ],
    }),
    // Variant Combinations (for complex products)
    defineField({
      name: 'variantCombinations',
      title: 'Variant Combinations (Optional)',
      type: 'array',
      description: 'Define specific combinations (e.g., Blue + Large). Leave empty if using simple price modifiers.',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'sku',
              type: 'string',
              title: 'Combination SKU',
              description: 'Unique identifier for this combination',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'variantSkus',
              type: 'array',
              title: 'Variant SKUs',
              description: 'Select the variant SKUs that make up this combination',
              of: [{ type: 'string' }],
              validation: (Rule) => Rule.required().min(1),
            },
            {
              name: 'price',
              type: 'number',
              title: 'Combination Price',
              description: 'Specific price for this combination',
              validation: (Rule) => Rule.required().min(0),
            },
            {
              name: 'stockQuantity',
              type: 'number',
              title: 'Stock Quantity',
              description: 'Available inventory for this combination',
              validation: (Rule) => Rule.required().min(0),
            },
          ],
          preview: {
            select: {
              sku: 'sku',
              price: 'price',
              stock: 'stockQuantity',
            },
            prepare: ({ sku, price, stock }) => ({
              title: sku,
              subtitle: `₹${price} · Stock: ${stock}`,
            }),
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'images.0',
      weight: 'weightGrams',
      category: 'category.name',
    },
    prepare: ({ title, media, weight, category }) => ({
      title,
      subtitle: `${weight ?? 0}g · ${category || 'Uncategorized'}`,
      media,
    }),
  },
});
