// schemas/post.ts
// Main blog post document — maps 1:1 to SanityPost in BlogPage.tsx

import {defineField, defineType} from 'sanity'

export const post = defineType({
  name: 'post',
  title: 'Blog Post',
  type: 'document',

  // ── Studio UI: show the cover image as the preview thumbnail ─────────────
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'coverImage',
      category: 'category.title',
    },
    prepare({title, author, media, category}) {
      return {
        title,
        subtitle: `${category ?? 'Uncategorised'} · ${author ?? 'Unknown author'}`,
        media,
      }
    },
  },

  fields: [
    // ── Core identity ───────────────────────────────────────────────────────
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (R) => R.required().min(10).max(120),
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (R) => R.required(),
    }),

    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      description: 'Short summary shown on blog cards and in meta descriptions.',
      validation: (R) => R.required().min(30).max(220),
    }),

    // ── Authorship ──────────────────────────────────────────────────────────
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{type: 'author'}],
      validation: (R) => R.required(),
    }),

    // ── Categorisation ──────────────────────────────────────────────────────
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{type: 'category'}],
      validation: (R) => R.required(),
    }),

    // ── Dates ───────────────────────────────────────────────────────────────
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      options: {dateFormat: 'YYYY-MM-DD', timeFormat: 'HH:mm'},
      initialValue: () => new Date().toISOString(),
      validation: (R) => R.required(),
    }),

    // ── Media ───────────────────────────────────────────────────────────────
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: {
        hotspot: true, // lets editors crop without code changes
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          description: 'Describe the image for screen readers and SEO.',
          validation: (R) => R.required(),
        }),
      ],
      validation: (R) => R.required(),
    }),

    // ── Flags ───────────────────────────────────────────────────────────────
    defineField({
      name: 'featured',
      title: 'Featured Post',
      type: 'boolean',
      description: 'Pin this post to the top of the blog as the hero featured story.',
      initialValue: false,
    }),

    // ── Body content (Portable Text) ────────────────────────────────────────
    // This is the full rich-text body rendered on the individual post page.
    // You don't use this on the listing page, but you will need it for the
    // blog post detail page later.
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        // Standard block (paragraphs, headings, lists, quotes)
        {
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'Heading 2', value: 'h2'},
            {title: 'Heading 3', value: 'h3'},
            {title: 'Heading 4', value: 'h4'},
            {title: 'Blockquote', value: 'blockquote'},
          ],
          marks: {
            decorators: [
              {title: 'Bold', value: 'strong'},
              {title: 'Italic', value: 'em'},
              {title: 'Underline', value: 'underline'},
              {title: 'Strike', value: 'strike-through'},
              {title: 'Code', value: 'code'},
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'URL',
                fields: [
                  defineField({
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                    validation: (R) => R.uri({scheme: ['http', 'https', 'mailto']}),
                  }),
                  defineField({
                    name: 'blank',
                    type: 'boolean',
                    title: 'Open in new tab',
                    initialValue: true,
                  }),
                ],
              },
            ],
          },
        },

        // Inline image block
        {
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({name: 'alt', type: 'string', title: 'Alt Text'}),
            defineField({name: 'caption', type: 'string', title: 'Caption'}),
          ],
        },

        // Embedded callout / tip block
        {
          type: 'object',
          name: 'callout',
          title: 'Callout',
          fields: [
            defineField({
              name: 'tone',
              type: 'string',
              title: 'Tone',
              options: {
                list: [
                  {title: 'Info', value: 'info'},
                  {title: 'Warning', value: 'warning'},
                  {title: 'Tip', value: 'tip'},
                ],
                layout: 'radio',
              },
              initialValue: 'info',
            }),
            defineField({name: 'text', type: 'text', title: 'Text'}),
          ],
          preview: {
            select: {text: 'text', tone: 'tone'},
            prepare: ({text, tone}) => ({title: `[${tone?.toUpperCase()}] ${text}`}),
          },
        },
      ],
    }),

    // ── SEO ─────────────────────────────────────────────────────────────────
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        defineField({
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'string',
          description: 'Overrides the post title in search results. Max 60 chars.',
          validation: (R) => R.max(60),
        }),
        defineField({
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text',
          rows: 2,
          description: 'Summary for search engines. Max 155 chars.',
          validation: (R) => R.max(155),
        }),
        defineField({
          name: 'ogImage',
          title: 'OG / Social Share Image',
          type: 'image',
          description: 'Overrides cover image for social sharing cards (1200×630 recommended).',
        }),
      ],
    }),
  ],

  // ── Ordering in the Studio desk ─────────────────────────────────────────
  orderings: [
    {
      title: 'Published Date, Newest',
      name: 'publishedAtDesc',
      by: [{field: 'publishedAt', direction: 'desc'}],
    },
    {
      title: 'Published Date, Oldest',
      name: 'publishedAtAsc',
      by: [{field: 'publishedAt', direction: 'asc'}],
    },
    {
      title: 'Title A→Z',
      name: 'titleAsc',
      by: [{field: 'title', direction: 'asc'}],
    },
  ],
})
