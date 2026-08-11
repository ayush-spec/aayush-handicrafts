import { defineType, defineField } from 'sanity';

/**
 * Singleton: silver rate settings.
 * `marketRatePerKg` is refreshed by the daily rate-fetch route;
 * `manualRatePerKg` (when set) always wins — use it to override the market rate.
 */
export default defineType({
  name: 'silverRateSettings',
  title: 'Silver Rate',
  type: 'document',
  fields: [
    defineField({
      name: 'marketRatePerKg',
      title: 'Market Rate (₹/kg, 999 purity)',
      type: 'number',
      description: 'Last fetched Indian market rate. Updated automatically.',
      readOnly: true,
    }),
    defineField({
      name: 'manualRatePerKg',
      title: 'Manual Override (₹/kg)',
      type: 'number',
      description: 'When set, this rate is used everywhere instead of the market rate. Clear to resume automatic pricing.',
    }),
    defineField({
      name: 'source',
      title: 'Rate Source',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'updatedAt',
      title: 'Last Updated',
      type: 'datetime',
      readOnly: true,
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Silver Rate Settings' }),
  },
});
