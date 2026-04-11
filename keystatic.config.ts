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
  storage: { kind: 'github', repo: 'kdbush64-create/otd-vault', branchPrefix: 'keystatic/' },
  ui: {
    brand: { name: 'v64otd.com' },
    navigation: {
      Channels: ['dispatch', 'transit', 'coord', 'table', 'xposts'],
      'Affiliate Channels': ['gear', 'chow'],
      Site: ['pages'],
    },
  },
  collections: {
    dispatch: collection({ label: 'Dispatch', slugField: 'title', path: 'src/content/dispatch/*', format: { frontmatter: 'yaml' }, schema: postFields }),
    transit:  collection({ label: 'Transit',  slugField: 'title', path: 'src/content/transit/*',  format: { frontmatter: 'yaml' }, schema: postFields }),
    gear:     collection({ label: 'Gear',     slugField: 'title', path: 'src/content/gear/*',     format: { frontmatter: 'yaml' }, schema: affiliateFields }),
    coord:    collection({ label: 'Coord',    slugField: 'title', path: 'src/content/coord/*',    format: { frontmatter: 'yaml' }, schema: postFields }),
    table:    collection({ label: 'Table',    slugField: 'title', path: 'src/content/table/*',    format: { frontmatter: 'yaml' }, schema: postFields }),
    chow:     collection({ label: 'Chow',     slugField: 'title', path: 'src/content/chow/*',     format: { frontmatter: 'yaml' }, schema: affiliateFields }),
    xposts:   collection({ label: 'X Posts',  slugField: 'title', path: 'src/content/xposts/*',  format: { frontmatter: 'yaml' }, schema: {
      title: fields.slug({ name: { label: 'Title' } }),
      date: fields.date({ label: 'Date', validation: { isRequired: true } }),
      content: fields.markdoc({ label: 'Content' }),
    }}),
    pages: collection({ label: 'Pages', slugField: 'title', path: 'src/content/pages/*', format: { frontmatter: 'yaml' }, schema: {
      title: fields.slug({ name: { label: 'Title' } }),
      description: fields.text({ label: 'Description', multiline: true }),
      content: fields.markdoc({ label: 'Content' }),
    }}),
  },
});
