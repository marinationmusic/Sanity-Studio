// schemas/faqPage.ts
// Localized FAQ content for the marketing FAQ page — one document per locale (en / fr).

import {defineField, defineType} from 'sanity'

export const faqItem = defineType({
  name: 'faqItem',
  title: 'FAQ item',
  type: 'object',
  fields: [
    defineField({
      name: 'question',
      title: 'Question',
      type: 'string',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'answer',
      title: 'Answer',
      type: 'text',
      rows: 5,
      validation: (R) => R.required(),
    }),
  ],
  preview: {
    select: {title: 'question'},
    prepare: ({title}) => ({title: title ?? 'Untitled'}),
  },
})

export const faqCategoryBlock = defineType({
  name: 'faqCategoryBlock',
  title: 'FAQ category',
  type: 'object',
  fields: [
    defineField({
      name: 'categoryId',
      title: 'Category ID',
      type: 'string',
      description:
        'Stable ID for anchors and filters (e.g. getting_started). Use lowercase letters, numbers, and underscores.',
      validation: (R) =>
        R.required().regex(/^[a-z0-9_]+$/, {
          name: 'categoryId',
          invert: false,
        }),
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      description: 'Single emoji shown next to the category title.',
      initialValue: '❓',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'items',
      title: 'Questions',
      type: 'array',
      of: [{type: 'faqItem'}],
      validation: (R) => R.required().min(1),
    }),
  ],
  preview: {
    select: {title: 'label', subtitle: 'categoryId'},
    prepare: ({title, subtitle}) => ({
      title: title ?? 'Category',
      subtitle,
    }),
  },
})

export const faqPage = defineType({
  name: 'faqPage',
  title: 'FAQ page',
  type: 'document',
  fields: [
    defineField({
      name: 'locale',
      title: 'Locale',
      type: 'string',
      options: {
        list: [
          {title: 'English', value: 'en'},
          {title: 'French', value: 'fr'},
        ],
        layout: 'radio',
      },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{type: 'faqCategoryBlock'}],
      validation: (R) => R.required().min(1),
    }),
  ],
  preview: {
    select: {locale: 'locale', count: 'categories'},
    prepare: ({locale, count}) => ({
      title: `FAQ (${locale ?? '?'})`,
      subtitle: `${Array.isArray(count) ? count.length : 0} categories`,
    }),
  },
})
