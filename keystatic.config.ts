import { config, fields, collection } from '@keystatic/core';

const ratingOptions = [
  { label: '— not rated —', value: '' },
  { label: '★☆☆☆☆ (1/5)', value: '1' },
  { label: '★★☆☆☆ (2/5)', value: '2' },
  { label: '★★★☆☆ (3/5)', value: '3' },
  { label: '★★★★☆ (4/5)', value: '4' },
  { label: '★★★★★ (5/5)', value: '5' },
];
const costOptions = [
  { label: '— not set —', value: '' },
  { label: 'Budget', value: 'Budget' },
  { label: 'Moderate', value: 'Moderate' },
  { label: 'Competitive', value: 'Competitive' },
  { label: 'Premium', value: 'Premium' },
  { label: 'Upscale', value: 'Upscale' },
];
const yesNoOptions = [
  { label: '— not set —', value: '' },
  { label: 'Yes', value: 'yes' },
  { label: 'No', value: 'no' },
];

const postFields = {
  title: fields.slug({ name: { label: 'Title' } }),
  date: fields.text({
    label: 'Date & Time',
    description: 'Format: YYYY-MM-DDTHH:MM (e.g. 2026-05-18T14:30)',
    validation: { isRequired: true },
  }),
  description: fields.text({
    label: 'Description for SEO',
    multiline: true,
    description: 'SEO only — not shown on page. 150–160 chars, plain text, no quotes or markdown.',
    validation: { isRequired: true, length: { min: 50, max: 160 } },
  }),
  tags: fields.text({ label: 'Tags', description: 'Space-separated keywords, e.g. texas food bbq' }),
  gallery: fields.array(
    fields.object({
      image: fields.image({ label: 'Image', directory: 'public/images/posts', publicPath: '/images/posts/' }),
      caption: fields.text({ label: 'Caption', description: 'Optional — up to 50 characters', validation: { length: { max: 50 } } }),
    }),
    { label: 'Gallery', itemLabel: (props) => props.fields.caption.value || 'Image', validation: { length: { max: 10 } } }
  ),
  content: fields.markdoc({ label: 'Content' }),
  signoff: fields.text({
  label: 'Signoff Line (optional)',
  description: 'e.g. V64OTD // THE FILE GETS CLOSED. THE DAMAGE DOESN\u2019T. Leave blank to skip entirely.',
}),
};

// Price now lives per-link, not as a single article-level field — supports multi-product articles
const affiliateLinksField = (description) => fields.array(
  fields.object({
    label: fields.text({ label: 'Product / Item Name', description: 'e.g. Lodge Cast Iron Dutch Oven' }),
    url: fields.url({ label: 'Affiliate URL' }),
    priceNoted: fields.text({
      label: 'Price When Reviewed (optional)',
      description: 'What you saw at the time — not a guarantee. Leave blank if you\u2019d rather not track it.',
    }),
  }),
  {
    label: 'Shop This / Affiliate Links',
    description,
    itemLabel: (props) => props.fields.label.value || 'Link',
  }
);

const listField = (label, itemLabel, description) =>
  fields.array(fields.text({ label: itemLabel }), {
    label,
    description,
    itemLabel: (props) => props.value || itemLabel,
  });

const affiliateFields = {
  ...postFields,
  affiliate: fields.checkbox({ label: 'Contains affiliate links', defaultValue: false }),
};

const locationFields = {
  ...postFields,
  address: fields.text({ label: 'Address' }),
  website: fields.url({ label: 'Website URL' }),
  rating: fields.select({ label: 'Rating', description: 'Be honest, not generous — save 5 stars for something you\u2019d genuinely send a friend to.', options: ratingOptions, defaultValue: '' }),
  cost: fields.select({ label: 'Cost', options: costOptions, defaultValue: '' }),
  content: fields.markdoc({ label: 'Summary' }),
};

// ---- Gear ----
const gearFields = {
  ...affiliateFields,
  rating: fields.select({ label: 'Rating', description: 'Reserve 5 stars for something you\u2019d buy again without thinking twice.', options: ratingOptions, defaultValue: '' }),
  manufacturerUrl: fields.url({ label: 'Manufacturer / Product Page (non-affiliate)', description: 'The brand\u2019s own page, for reference — not a buy link.' }),
  useCase: fields.text({ label: 'Use Case', description: 'One sentence: what job is this actually for? Helps readers self-select fast.' }),
  pros: listField('Pros', 'Pro', 'Be specific — "doesn\u2019t fog in humidity" beats "works well."'),
  cons: listField('Cons', 'Con', 'Don\u2019t skip this even for things you love — zero cons reads as an ad, not a review.'),
  buildQuality: fields.text({ label: 'Build Quality / Durability Note', multiline: true, description: 'How does it actually feel after real use — scuffed, loose, still solid?' }),
  timeFieldTested: fields.text({ label: 'Time Field-Tested', description: 'Be specific: "3 weekend trips" tells readers more than "a while."' }),
  bestFor: fields.text({ label: 'Best For / Not For', description: 'Who should buy this — and who should skip it for something else?' }),
  wouldBuyAgain: fields.select({ label: 'Would You Buy It Again?', description: 'The simplest honest test there is.', options: yesNoOptions, defaultValue: '' }),
  affiliateLinks: affiliateLinksField('Add a link for every product named above, including any paired item.'),
};

// ---- The Table (restaurants) ----
const tableFields = {
  ...locationFields,
  foodType: fields.text({ label: 'Food Type', description: 'e.g. BBQ, Italian, Tex-Mex (50 chars max)', validation: { length: { max: 50 } } }),
  whatYouOrdered: fields.text({ label: 'What You Ordered', multiline: true, description: 'Name actual dishes — "the food was good" tells a reader nothing they can act on.' }),
  serviceQuality: fields.text({ label: 'Service Quality', description: 'A specific moment (fast refill, forgotten order) beats "service was fine."' }),
  ambiance: fields.text({ label: 'Ambiance / Atmosphere', description: 'Noise, lighting, crowd — the things that decide if it\u2019s date-night or quick-lunch.' }),
  bestFor: fields.text({ label: 'Best For', description: 'Be specific about occasion, not just "good restaurant."' }),
  wouldReturn: fields.select({ label: 'Would You Return?', description: 'If the honest answer is no, say so — that\u2019s the useful part.', options: yesNoOptions, defaultValue: '' }),
  affiliateLinks: affiliateLinksField('Rare for restaurants, but use this if a reservation platform link applies.'),
};

// ---- The Kitchen (recipes) ----
const chowFields = {
  ...affiliateFields,
  rating: fields.select({ label: 'Rating', description: 'Rate how it actually turned out for you, not how good it sounds on paper.', options: ratingOptions, defaultValue: '' }),
  prepTime: fields.text({ label: 'Prep Time', description: 'Time yourself the first time — most recipe times online are optimistic.' }),
  cookTime: fields.text({ label: 'Cook Time' }),
  totalTime: fields.text({ label: 'Total Time' }),
  servings: fields.text({ label: 'Servings / Yield', description: 'How many people did this actually feed at your table?' }),
  difficulty: fields.select({
    label: 'Difficulty',
    description: 'Rate based on technique required, not just time.',
    options: [{ label: '— not set —', value: '' }, { label: 'Easy', value: 'easy' }, { label: 'Medium', value: 'medium' }, { label: 'Hard', value: 'hard' }],
    defaultValue: '',
  }),
  equipmentNeeded: listField('Equipment Needed', 'Item', 'Anything beyond basic pots/pans a reader would need to buy.'),
  substitutionNotes: fields.text({ label: 'Key Ingredient Notes / Substitutions', multiline: true, description: 'What worked if you didn\u2019t have the exact ingredient on hand?' }),
  storageNotes: fields.text({ label: 'Storage / Leftovers Note', multiline: true, description: 'How long did leftovers actually stay good, and how did you store them?' }),
  affiliateLinks: affiliateLinksField('Tools, pans, or ingredients worth linking directly.'),
};

// ---- Travel (transit + coord — shared shape, separate collections) ----
const travelFields = {
  ...locationFields,
  bestSeason: fields.text({ label: 'Best Time to Visit / Season', description: 'Be specific about months or conditions, not just "summer."' }),
  recommendedStay: fields.text({ label: 'Recommended Length of Stay', description: 'How long did you actually need before it felt like enough?' }),
  pairWith: fields.text({ label: "What's Nearby / Pair With", multiline: true, description: 'What\u2019s worth combining this with on the same trip?' }),
  bestFor: fields.text({ label: 'Best For', description: 'Be specific about who this is — and isn\u2019t — a good fit for.' }),
  affiliateLinks: affiliateLinksField('Booking link if you have one — Vrbo or Booking.com, not Airbnb.'),
};

// ---- Lifestyle (narrative content — health, travel essays, pets, etc.) ----
const lifestyleFields = {
  ...affiliateFields,
  affiliateLinks: affiliateLinksField('Add a link for anything mentioned worth pointing readers toward — no pressure to link everything.'),
  signoff: fields.text({
  label: 'Signoff Line (optional)',
  description: 'e.g. V64OTD // THE FILE GETS CLOSED. THE DAMAGE DOESN\u2019T. Leave blank to skip entirely.',
}),
};

export default config({
  storage: { kind: 'cloud' },
  cloud: { project: 'otd-vault/otd-vault' },
  ui: {
    brand: { name: 'v64otd.com' },
    navigation: {
      Dispatch: ['dispatch'],
      'Reviews & Gear': ['gear', 'table', 'chow', 'transit', 'coord'],
      Lifestyle: ['lifestyle'],
      Site: ['pages'],
      Other: ['xposts'],
    },
  },
  collections: {
    dispatch:  collection({ label: 'Dispatch',            slugField: 'title', path: 'src/content/dispatch/*',  format: { frontmatter: 'yaml', contentField: 'content' }, schema: postFields }),
    gear:      collection({ label: 'Gear',                slugField: 'title', path: 'src/content/gear/*',      format: { frontmatter: 'yaml', contentField: 'content' }, schema: gearFields }),
    table:     collection({ label: 'The Table',           slugField: 'title', path: 'src/content/table/*',     format: { frontmatter: 'yaml', contentField: 'content' }, schema: tableFields }),
    chow:      collection({ label: 'The Kitchen',         slugField: 'title', path: 'src/content/chow/*',      format: { frontmatter: 'yaml', contentField: 'content' }, schema: chowFields }),
    transit:   collection({ label: 'Travel — Road Trip',  slugField: 'title', path: 'src/content/transit/*',   format: { frontmatter: 'yaml', contentField: 'content' }, schema: travelFields }),
    coord:     collection({ label: 'Getaways',            slugField: 'title', path: 'src/content/coord/*',     format: { frontmatter: 'yaml', contentField: 'content' }, schema: travelFields }),
    lifestyle: collection({ label: 'Lifestyle',           slugField: 'title', path: 'src/content/lifestyle/*', format: { frontmatter: 'yaml', contentField: 'content' }, schema: lifestyleFields }),
    xposts:    collection({ label: 'X Posts',  slugField: 'title', path: 'src/content/xposts/*',  format: { frontmatter: 'yaml', contentField: 'content' }, schema: {
      title: fields.slug({ name: { label: 'Title' } }),
      date: fields.date({ label: 'Date', validation: { isRequired: true } }),
      xhandle: fields.text({ label: 'X Handle' }),
      approved: fields.checkbox({ label: 'Approved — publish to site', defaultValue: false }),
      content: fields.markdoc({ label: 'Content' }),
    }}),
    pages: collection({ label: 'Pages', slugField: 'title', path: 'src/content/pages/*', format: { frontmatter: 'yaml', contentField: 'content' }, schema: {
      title: fields.slug({ name: { label: 'Title' } }),
      description: fields.text({
        label: 'Description for SEO',
        multiline: true,
        description: 'SEO only — not shown on page. 150–160 chars, plain text, no quotes or markdown.',
        validation: { isRequired: true, length: { min: 50, max: 160 } },
      }),
      content: fields.markdoc({ label: 'Content' }),
    }}),
  },
});
