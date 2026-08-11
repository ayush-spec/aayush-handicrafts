import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'coupon',
  title: 'Coupon',
  type: 'document',
  fields: [
    defineField({
      name: 'code',
      title: 'Coupon Code',
      type: 'string',
      description: 'Uppercase code customers enter at checkout (e.g. WELCOME10)',
      validation: (Rule) => Rule.required().uppercase(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'string',
      description: 'Internal description for your reference',
    }),
    defineField({
      name: 'discountType',
      title: 'Discount Type',
      type: 'string',
      options: {
        list: [
          { title: 'Percentage', value: 'percentage' },
          { title: 'Fixed Amount (INR)', value: 'fixed' },
        ],
      },
      initialValue: 'percentage',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'discountValue',
      title: 'Discount Value',
      type: 'number',
      description: 'e.g. 10 for 10% or 500 for ₹500 off',
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: 'minOrderAmount',
      title: 'Minimum Order Amount (INR)',
      type: 'number',
      description: 'Minimum cart total to apply this coupon. 0 = no minimum.',
      initialValue: 0,
    }),
    defineField({
      name: 'maxDiscountAmount',
      title: 'Max Discount Cap (INR)',
      type: 'number',
      description: 'Cap for percentage discounts. 0 = no cap.',
      initialValue: 0,
    }),
    defineField({
      name: 'maxUsageTotal',
      title: 'Total Usage Limit',
      type: 'number',
      description: 'Max times this coupon can be used across all users. 0 = unlimited.',
      initialValue: 0,
    }),
    defineField({
      name: 'maxUsagePerUser',
      title: 'Per User Limit',
      type: 'number',
      description: 'Max times a single user can use this coupon.',
      initialValue: 1,
    }),
    defineField({
      name: 'isFirstPurchaseOnly',
      title: 'First Purchase Only',
      type: 'boolean',
      description: 'Only valid for users who have never placed an order.',
      initialValue: false,
    }),
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'validFrom',
      title: 'Valid From',
      type: 'datetime',
    }),
    defineField({
      name: 'validUntil',
      title: 'Valid Until',
      type: 'datetime',
    }),
  ],
  preview: {
    select: {
      title: 'code',
      subtitle: 'description',
      active: 'isActive',
    },
    prepare({ title, subtitle, active }) {
      return {
        title: `${active ? '' : '[INACTIVE] '}${title}`,
        subtitle,
      };
    },
  },
});
