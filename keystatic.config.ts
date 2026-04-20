import { config, fields, collection } from '@keystatic/core';
const ratingOptions = [
  { label: '— not rated —', value: '' },
  { label: '1/10', value: '1' },
  { label: '2/10', value: '2' },
  { label: '3/10', value: '3' },
  { label: '4/10', value: '4' },
  { label: '5/10', value: '5' },
  { label: '6/10', value: '6' },
  { label: '7/10', value: '7' },
  { label: '8/10', value: '8' },
  { label: '9/10', value: '9' },
  { label: '10/10', value: '10' },
];
const costOptions = [
  { label: '— not set —', value: '' },
  { label: 'Budget', value: 'Budget' },
  { label: 'Moderate', value: 'Moderate' },
  { label: 'Competitive', value: 'Competitive' },
  { label: 'Premium', value: 'Premium' },
  { label: 'Upscale', value: 'Upscale' },
];
const postFields = {
  title: fields.slug({ name: { label: 'Title' } }),
  date: fields.date({ label: 'Date', validation: { isRequired: true } }),
  description: fields.text({
    label: 'Description for SEO',
    multiline: true,
    description: 'SEO only — not shown on page. 150–160 chars, plain text, no quotes or markdown.',
    validation: { length: { min: 50, max: 160 } },
  }),
  tags: fields.array(fields.text({ label: 'Tag' }), { label: 'Tags', itemLabel: (p) => p.value }),
  gallery: fields.array(
    fields.object({
      image: fields.image({ label: 'Image', directory: 'public/images/posts', publicPath: '/images/posts/' }),
      caption: fields.text({ label: 'Caption', description: 'Optional — up to 50 characters', validation: { length: { max: 50 } } }),
    }),
    { label: 'Gallery', itemLabel: (props) => props.fields.caption.value || 'Image', validation: { length: { max: 10 } } }
  ),
  content: fields.markdoc({ label: 'Content' }),
};
const affiliateFields = {
  ...postFields,
  affiliate: fields.checkbox({ label: 'Contains affiliate links', defaultValue: false }),
};
const locationFields = {
  ...postFields,
  address: fields.text({ label: 'Address' }),
  website: fields.url({ label: 'Website URL' }),
  rating: fields.select({ label: 'Rating (out of 10)', options: ratingOptions, defaultValue: '' }),
  cost: fields.select({ label: 'Cost', options: costOptions, defaultValue: '' }),
  content: fields.markdoc({ label: 'Summary' }),
};
const tableFields = {
  ...locationFields,
  foodType: fields.text({ label: 'Food Type', description: 'e.g. BBQ, Italian, Tex-Mex (50 chars max)', validation: { length: { max: 50 } } }),
};
const gearFields = {
  ...affiliateFields,
  website: fields.url({ label: 'Website URL' }),
};
export default config({
  storage: { kind: 'cloud' },
  cloud: { project: 'otd-vault/otd-vault' },
  ui: {
    brand: { name: 'v64otd.com' },
    navigation: {
      Channels: ['dispatch', 'transit', 'coord', 'table', 'xposts'],
      'Affiliate Channels': ['gear', 'chow'],
      Site: ['pages'],
    },
  },
  collections: {
    dispatch: collection({ label: 'Dispatch', slugField: 'title', path: 'src/content/dispatch/*', format: { frontmatter: 'yaml', contentField: 'content' }, schema: postFields }),
    transit:  collection({ label: 'Transit',  slugField: 'title', path: 'src/content/transit/*',  format: { frontmatter: 'yaml', contentField: 'content' }, schema: postFields }),
    gear:     collection({ label: 'Gear',     slugField: 'title', path: 'src/content/gear/*',     format: { frontmatter: 'yaml', contentField: 'content' }, schema: gearFields }),
    coord:    collection({ label: 'Coord',    slugField: 'title', path: 'src/content/coord/*',    format: { frontmatter: 'yaml', contentField: 'content' }, schema: locationFields }),
    table:    collection({ label: 'Table',    slugField: 'title', path: 'src/content/table/*',    format: { frontmatter: 'yaml', contentField: 'content' }, schema: tableFields }),
    chow:     collection({ label: 'Chow',     slugField: 'title', path: 'src/content/chow/*',     format: { frontmatter: 'yaml', contentField: 'content' }, schema: affiliateFields }),
    xposts:   collection({ label: 'X Posts',  slugField: 'title', path: 'src/content/xposts/*',  format: { frontmatter: 'yaml', contentField: 'content' }, schema: {
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
        validation: { length: { min: 50, max: 160 } },
      }),
      content: fields.markdoc({ label: 'Content' }),
    }}),
  },
});
