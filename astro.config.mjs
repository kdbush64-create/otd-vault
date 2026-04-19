import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import keystatic from '@keystatic/astro';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  output: 'server',
  adapter: cloudflare({ imageService: 'compile' }),
  integrations: [
    react(),
    markdoc(),
    keystatic(),
    sitemap({
      filter: (page) =>
        !page.includes('/xposts/') &&
        !page.includes('/pages/00-the-man/'),
    }),
  ],
  site: 'https://v64otd.com',
});
