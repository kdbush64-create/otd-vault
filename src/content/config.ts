import { defineCollection, z } from 'astro:content';

const postSchema = z.object({
  title: z.string(),
  date: z.coerce.string(),
  description: z.string().optional(),
  tags: z.string().optional(),
  gallery: z.array(z.object({ image: z.string(), caption: z.string().max(50).optional() })).max(10).optional(),
  image: z.string().optional(),
  signoff: z.string().optional(),
  callToAction: z.string().optional(),
});

const locationSchema = postSchema.extend({
  address: z.string().optional(),
  website: z.string().optional(),
  rating: z.string().optional(),
  cost: z.string().optional(),
  bestSeason: z.string().optional(),
  recommendedStay: z.string().optional(),
  pairWith: z.string().optional(),
});

const tableSchema = locationSchema.extend({
  foodType: z.string().max(50).optional(),
  whatYouOrdered: z.string().optional(),
  serviceQuality: z.string().optional(),
  ambiance: z.string().optional(),
  bestFor: z.string().optional(),
  wouldReturn: z.string().optional(),
});

const gearSchema = postSchema.extend({
  affiliate: z.boolean().optional(),
  website: z.string().optional(),
  manufacturerUrl: z.string().optional(),
  useCase: z.string().optional(),
  pros: z.string().optional(),
  cons: z.string().optional(),
  buildQuality: z.string().optional(),
  timeFieldTested: z.string().optional(),
  bestFor: z.string().optional(),
  wouldBuyAgain: z.string().optional(),
});

const affiliateSchema = postSchema.extend({
  affiliate: z.boolean().optional(),
});

const chowSchema = postSchema.extend({
  affiliate: z.boolean().optional(),
  affiliateLinks: z.array(z.object({
    label: z.string(),
    url: z.string(),
  })).optional(),
  prepTime: z.string().optional(),
  cookTime: z.string().optional(),
  totalTime: z.string().optional(),
  servings: z.string().optional(),
  difficulty: z.string().optional(),
  equipmentNeeded: z.string().optional(),
  substitutionNotes: z.string().optional(),
  storageNotes: z.string().optional(),
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
  chow:     defineCollection({ schema: chowSchema }),
  xposts:   defineCollection({ schema: xpostSchema }),
  pages:    defineCollection({ schema: pageSchema }),
};
