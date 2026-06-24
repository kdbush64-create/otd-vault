import { defineCollection, z } from 'astro:content';

const tagsField = z.union([z.string(), z.array(z.string())])
  .optional()
  .transform(val => Array.isArray(val) ? val.join(' ') : val);

const postSchema = z.object({
  title: z.string(),
  date: z.coerce.string(),
  description: z.string().optional(),
  tags: tagsField,
  gallery: z.array(z.object({
    image: z.string(),
    caption: z.string().max(50).optional(),
  })).max(10).optional(),
});

const dispatchSchema = postSchema.extend({
  callToAction: z.array(z.string()).optional(),
});

const locationSchema = postSchema.extend({
  address: z.string().optional(),
  website: z.string().optional(),
  rating: z.string().optional(),
  cost: z.string().optional(),
});

const tableSchema = locationSchema.extend({
  foodType: z.string().max(50).optional(),
});

const gearSchema = postSchema.extend({
  affiliate: z.boolean().optional(),
  website: z.string().optional(),
  rating: z.string().optional(),
  cost: z.string().optional(),
  affiliateLinks: z.array(z.object({ label: z.string(), url: z.string() })).optional(),
});

const chowSchema = postSchema.extend({
  affiliate: z.boolean().optional(),
  rating: z.string().optional(),
  cost: z.string().optional(),
  affiliateLinks: z.array(z.object({ label: z.string(), url: z.string() })).optional(),
});

const xpostSchema = z.object({
  title: z.string(),
  date: z.coerce.string(),
  xhandle: z.string().optional(),
  approved: z.boolean().optional(),
});

const pageSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
});

export const collections = {
  dispatch: defineCollection({ schema: dispatchSchema }),
  transit:  defineCollection({ schema: postSchema }),
  gear:     defineCollection({ schema: gearSchema }),
  coord:    defineCollection({ schema: locationSchema }),
  table:    defineCollection({ schema: tableSchema }),
  chow:     defineCollection({ schema: chowSchema }),
  xposts:   defineCollection({ schema: xpostSchema }),
  pages:    defineCollection({ schema: pageSchema }),
};
