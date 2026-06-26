import { defineCollection, z } from 'astro:content';

const tagsField = z.union([z.string(), z.array(z.string())])
  .optional()
  .transform(val => Array.isArray(val) ? val.join(' ') : val);

const affiliateLinkSchema = z.object({
  label: z.string(),
  url: z.string(),
  priceNoted: z.string().optional(),
});

const postSchema = z.object({
  title: z.string(),
  date: z.coerce.string(),
  description: z.string().optional(),
  tags: tagsField,
  gallery: z.array(z.object({
    image: z.string(),
    caption: z.string().max(50).optional(),
  })).max(10).optional(),
  signoff: z.string().optional(),
});

const dispatchSchema = postSchema.extend({
  callToAction: z.array(z.string()).optional(),
});

const lifestyleSchema = postSchema.extend({
  affiliate: z.boolean().optional(),
  affiliateLinks: z.array(affiliateLinkSchema).optional(),
});

const locationSchema = postSchema.extend({
  address: z.string().optional(),
  website: z.string().optional(),
  rating: z.string().optional(),
  cost: z.string().optional(),
});

const tableSchema = locationSchema.extend({
  foodType: z.string().max(50).optional(),
  whatYouOrdered: z.string().optional(),
  serviceQuality: z.string().optional(),
  ambiance: z.string().optional(),
  bestFor: z.string().optional(),
  wouldReturn: z.string().optional(),
  affiliateLinks: z.array(affiliateLinkSchema).optional(),
});

const gearSchema = postSchema.extend({
  affiliate: z.boolean().optional(),
  rating: z.string().optional(),
  manufacturerUrl: z.string().optional(),
  useCase: z.string().optional(),
  pros: z.array(z.string()).optional(),
  cons: z.array(z.string()).optional(),
  buildQuality: z.string().optional(),
  timeFieldTested: z.string().optional(),
  bestFor: z.string().optional(),
  wouldBuyAgain: z.string().optional(),
  affiliateLinks: z.array(affiliateLinkSchema).optional(),
});

const chowSchema = postSchema.extend({
  affiliate: z.boolean().optional(),
  rating: z.string().optional(),
  prepTime: z.string().optional(),
  cookTime: z.string().optional(),
  totalTime: z.string().optional(),
  servings: z.string().optional(),
  difficulty: z.string().optional(),
  equipmentNeeded: z.array(z.string()).optional(),
  substitutionNotes: z.string().optional(),
  storageNotes: z.string().optional(),
  affiliateLinks: z.array(affiliateLinkSchema).optional(),
});

const travelSchema = locationSchema.extend({
  bestSeason: z.string().optional(),
  recommendedStay: z.string().optional(),
  pairWith: z.string().optional(),
  bestFor: z.string().optional(),
  affiliateLinks: z.array(affiliateLinkSchema).optional(),
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
  dispatch:  defineCollection({ schema: dispatchSchema }),
  gear:      defineCollection({ schema: gearSchema }),
  coord:     defineCollection({ schema: travelSchema }),
  table:     defineCollection({ schema: tableSchema }),
  chow:      defineCollection({ schema: chowSchema }),
  transit:   defineCollection({ schema: travelSchema }),
  lifestyle: defineCollection({ schema: lifestyleSchema }),
  xposts:    defineCollection({ schema: xpostSchema }),
  pages:     defineCollection({ schema: pageSchema }),
};
