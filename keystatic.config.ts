import { config, fields, collection } from '@keystatic/core';

const postFields = {
  title: fields.slug({ name: { label: 'Title' } }),
  date: fields.date({ label: 'Date', validation: { isRequired: true } }),
  description: fields.text({ label: 'Description', multiline: true }),
  tags: fields.array(fields.text({ label: 'Tag' }), { label: 'Tags', itemLabel: (p) => p.value }),
  content: fields.markdoc({ label: 'Content' }),
};

const affiliateFields = {
  ...postFields,
  affiliate: fields.checkbox({ label: 'Contains affiliate links', defaultValue: false }),
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
    dispatch: collection({ label: 'Dispatch', slugField: 'title', path: 'src/content/dispatch/*.md', format: { frontmatter: 'yaml', contentField: 'content' }, schema: postFields }),
    transit:  collection({ label: 'Transit',  slugField: 'title', path: 'src/content/transit/*.md',  format: { frontmatter: 'yaml', contentField: 'content' }, schema: postFields }),
    gear:     collection({ label: 'Gear',     slugField: 'title', path: 'src/content/gear/*.md',     format: { frontmatter: 'yaml', contentField: 'content' }, schema: affiliateFields }),
    coord:    collection({ label: 'Coord',    slugField: 'title', path: 'src/content/coord/*.md',    format: { frontmatter: 'yaml', contentField: 'content' }, schema: postFields }),
    table:    collection({ label: 'Table',    slugField: 'title', path: 'src/content/table/*.md',    format: { frontmatter: 'yaml', contentField: 'content' }, schema: postFields }),
    chow:     collection({ label: 'Chow',     slugField: 'title', path: 'src/content/chow/*.md',     format: { frontmatter: 'yaml', contentField: 'content' }, schema: affiliateFields }),
    xposts:   collection({ label: 'X Posts',  slugField: 'title', path: 'src/content/xposts/*.md',  format: { frontmatter: 'yaml', contentField: 'content' }, schema: {
      title: fields.slug({ name: { label: 'Title' } }),
      date: fields.date({ label: 'Date', validation: { isRequired: true } }),
      content: fields.markdoc({ label: 'Content' }),
    }}),
    pages: collection({ label: 'Pages', slugField: 'title', path: 'src/content/pages/*.md', format: { frontmatter: 'yaml', contentField: 'content' }, schema: {
      title: fields.slug({ name: { label: 'Title' } }),
      description: fields.text({ label: 'Description', multiline: true }),
      content: fields.markdoc({ label: 'Content' }),
    }}),
  },
});
