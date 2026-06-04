export const prerender = true;

import { getCollection } from 'astro:content';

export async function GET() {
  const posts = await getCollection('dispatch');
  const sorted = [...posts].sort((a, b) =>
    String(b.data.date ?? '').localeCompare(String(a.data.date ?? ''))
  );

  const items = sorted.map(post => {
    const title = post.data.title;
    const description = post.data.description ?? '';
    const url = `https://v64otd.com/dispatch/${post.slug}/`;
    const rawDate = String(post.data.date ?? '');
    const cleanDate = rawDate.split('.')[0].replace('Z', '');
    const pubDate = new Date(cleanDate.includes('T') ? cleanDate : cleanDate + 'T00:00:00').toUTCString();
    const body = post.body ?? '';

    return `
    <item>
      <title><![CDATA[${title}]]></title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${description}]]></description>
      <content:encoded><![CDATA[${body}]]></content:encoded>
    </item>`;
  }).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>OTD Vault — Daily Dispatch</title>
    <link>https://v64otd.com</link>
    <description>Daily dispatches from Vintage64TX at v64otd.com</description>
    <language>en-us</language>
    <atom:link href="https://v64otd.com/rss.xml" rel="self" type="application/rss+xml" />
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' }
  });
}
