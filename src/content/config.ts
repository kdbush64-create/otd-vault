import { defineCollection, z } from 'astro:content';

const postSchema = z.object({
  title: z.string(),
  date: z.coerce.string(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  affiliate: z.boolean().optional(),
  gallery: z.array(z.object({
    image: z.string(),
    caption: z.string().max(50).optional(),
  })).max(10).optional(),
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
  gear:     defineCollection({ schema: postSchema }),
  coord:    defineCollection({ schema: postSchema }),
  table:    defineCollection({ schema: postSchema }),
  chow:     defineCollection({ schema: postSchema }),
  xposts:   defineCollection({ schema: xpostSchema }),
  pages:    defineCollection({ schema: pageSchema }),
};
