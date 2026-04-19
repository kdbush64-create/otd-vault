import { defineCollection, z } from 'astro:content';

const postSchema = z.object({
  title: z.string(),
  date: z.coerce.string(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  gallery: z.array(z.object({ image: z.string(), caption: z.string().max(50).optional() })).max(10).optional(),
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
});

const affiliateSchema = postSchema.extend({
  affiliate: z.boolean().optional(),
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
  dispatch: defineCollection({ schema: postSchema }),
  transit:  defineCollection({ schema: postSchema }),
  gear:     defineCollection({ schema: gearSchema }),
  coord:    defineCollection({ schema: locationSchema }),
  table:    defineCollection({ schema: tableSchema }),
  chow:     defineCollection({ schema: affiliateSchema }),
  xposts:   defineCollection({ schema: xpostSchema }),
  pages:    defineCollection({ schema: pageSchema }),
};
