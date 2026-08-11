import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    defineField({
      name: 'customerName',
      title: 'Customer Name',
      type: 'string',
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: 'customerPhoto',
      title: 'Customer Photo',
      type: 'image',
      description: 'Optional customer photo',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'testimonialText',
      title: 'Testimonial',
      type: 'text',
      description: 'The customer\'s review or testimonial',
      validation: (Rule) => Rule.required().max(500),
    }),
    defineField({
      name: 'rating',
      title: 'Rating',
      type: 'number',
      description: 'Customer rating (1-5 stars)',
      validation: (Rule) => Rule.required().min(1).max(5),
      initialValue: 5,
    }),
    defineField({
      name: 'productReference',
      title: 'Related Product',
      type: 'reference',
      to: [{ type: 'product' }],
      description: 'Optional: Link to the product this testimonial is about',
    }),
    defineField({
      name: 'featured',
      title: 'Featured on Homepage',
      type: 'boolean',
      description: 'Show this testimonial on the homepage',
      initialValue: false,
    }),
    defineField({
      name: 'createdAt',
      title: 'Date',
      type: 'datetime',
      description: 'Testimonial date',
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      name: 'customerName',
      text: 'testimonialText',
      rating: 'rating',
      media: 'customerPhoto',
    },
    prepare: ({ name, text, rating, media }) => ({
      title: name,
      subtitle: `⭐ ${rating}/5 - ${text?.substring(0, 50)}...`,
      media,
    }),
  },
});
