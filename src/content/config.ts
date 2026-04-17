import { defineCollection, z } from 'astro:content';

const postSchema = z.object({
  title: z.string(),
  date: z.coerce.string(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  affiliate: z.boolean().optional(),
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
  xposts:   defineCollection({ schema: postSchema }),
  pages:    defineCollection({ schema: pageSchema }),
};
