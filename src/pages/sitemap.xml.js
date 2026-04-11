import { getCollection } from 'astro:content';

export async function GET({ site }) {
  const channels = ['dispatch', 'transit', 'gear', 'coord', 'table', 'chow'];
  const postUrls = [];
  for (const channel of channels) {
    const posts = await getCollection(channel);
    for (const post of posts) postUrls.push(`${site}${channel}/${post.slug}`);
  }
  const channelUrls = channels.map(ch => `${site}${ch}`);
  const staticUrls  = [`${site}`, `${site}newsletter`, `${site}about`];
  const all = [...staticUrls, ...channelUrls, ...postUrls];
  const xml = ['<?xml version="1.0" encoding="UTF-8"?>','<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...all.map(u => `  <url><loc>${u}</loc></url>`),'</urlset>'].join('\n');
  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
}
