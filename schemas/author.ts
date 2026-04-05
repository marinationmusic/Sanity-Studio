// schemas/author.ts
// Referenced by post.author — Justin and Prabhjot are your two authors.

import {defineField, defineType} from 'sanity'

export const author = defineType({
  name: 'author',
  title: 'Author',
  type: 'document',

  preview: {
    select: {title: 'name', media: 'image'},
  },

  fields: [
    defineField({
      name: 'name',
      title: 'Full Name',
      type: 'string',
      validation: (R) => R.required(),
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'name', maxLength: 64},
    }),

    defineField({
      name: 'image',
      title: 'Profile Photo',
      type: 'image',
      options: {hotspot: true},
      fields: [defineField({name: 'alt', type: 'string', title: 'Alt Text'})],
    }),

    defineField({
      name: 'role',
      title: 'Role / Title',
      type: 'string',
      // e.g. "Founder & CEO" or "CTO & Solo Developer"
    }),

    defineField({
      name: 'bio',
      title: 'Short Bio',
      type: 'text',
      rows: 3,
      description: 'One-paragraph bio shown on post detail pages.',
    }),

    defineField({
      name: 'twitter',
      title: 'Twitter / X Handle',
      type: 'string',
      description: 'Without the @ symbol.',
    }),
  ],
})
