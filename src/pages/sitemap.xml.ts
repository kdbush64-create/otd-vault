import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
  const site = 'https://v64otd.com';

  const channels = ['dispatch', 'transit', 'gear', 'coord', 'table', 'chow'] as const;
  
  const staticPages = [
    '',
    '/dispatch',
    '/transit',
    '/gear',
    '/coord',
    '/table',
    '/chow',
    '/substack',
    '/about',
  ];

  const postUrls: string[] = [];
  for (const channel of channels) {
    const posts = await getCollection(channel);
    for (const post of posts) {
      postUrls.push(`/${channel}/${post.slug}/`);
    }
  }

  const allUrls = [
    ...staticPages.map(p => `${site}${p}`),
    ...postUrls.map(p => `${site}${p}`),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(url => `  <url>
    <loc>${url}</loc>
  </url>`).join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
