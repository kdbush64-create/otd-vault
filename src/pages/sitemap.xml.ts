import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const prerender = true;

const SITE = 'https://v64otd.com';

// Static pages and their priority/changefreq
const staticPages = [
  { url: '/',        changefreq: 'daily',   priority: '1.0' },
  { url: '/dispatch', changefreq: 'daily',   priority: '0.9' },
  { url: '/reviews',  changefreq: 'weekly',  priority: '0.8' },
  { url: '/gear',     changefreq: 'weekly',  priority: '0.7' },
  { url: '/table',    changefreq: 'weekly',  priority: '0.7' },
  { url: '/chow',     changefreq: 'weekly',  priority: '0.7' },
  { url: '/transit',  changefreq: 'weekly',  priority: '0.7' },
  { url: '/coord',    changefreq: 'weekly',  priority: '0.7' },
  { url: '/about',    changefreq: 'monthly', priority: '0.5' },
];

function toIsoDate(dateStr: string): string {
  try {
    return new Date(dateStr).toISOString().split('T')[0];
  } catch {
    return new Date().toISOString().split('T')[0];
  }
}

export const GET: APIRoute = async () => {
  const channels = ['dispatch', 'gear', 'table', 'chow', 'transit', 'coord'] as const;

  // Collect all content posts
  const postUrls: { url: string; date: string }[] = [];

  for (const channel of channels) {
    try {
      const entries = await getCollection(channel as any);
      for (const entry of entries) {
        postUrls.push({
          url: `/${channel}/${entry.id}`,
          date: toIsoDate(entry.data.date),
        });
      }
    } catch {
      // Collection might be empty
    }
  }

  // Sort posts newest first
  postUrls.sort((a, b) => b.date.localeCompare(a.date));

  const today = new Date().toISOString().split('T')[0];

  const staticEntries = staticPages.map(p => `
  <url>
    <loc>${SITE}${p.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('');

  const postEntries = postUrls.map(p => `
  <url>
    <loc>${SITE}${p.url}</loc>
    <lastmod>${p.date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticEntries}
${postEntries}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
