// schemas/category.ts
// Referenced by post.category.
// Pre-seed: Artist Trends | Market Analysis | Strategy | Platform Guide | Product Updates

import {defineField, defineType} from 'sanity'

export const category = defineType({
  name: 'category',
  title: 'Category',
  type: 'document',

  preview: {
    select: {title: 'title', subtitle: 'slug.current'},
  },

  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (R) => R.required(),
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 64},
      validation: (R) => R.required(),
    }),

    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
    }),

    // Colour used for the category badge on the blog card.
    // Should match getCategoryColor() in BlogPage.tsx.
    defineField({
      name: 'color',
      title: 'Badge Color (hex)',
      type: 'string',
      description: 'Hex color for the category pill. E.g. #FFAE42',
      validation: (R) =>
        R.regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, {
          name: 'hex color',
          invert: false,
        }),
    }),
  ],
})
