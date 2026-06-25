export const prerender = true;
import { getCollection } from 'astro:content';
function toRFC822(dateStr: string): string {
  const clean = dateStr.split('.')[0].replace('Z', '');
  const d = new Date(clean.includes('T') ? clean : clean + 'T00:00:00');
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${days[d.getUTCDay()]}, ${String(d.getUTCDate()).padStart(2,'0')} ${months[d.getUTCMonth()]} ${d.getUTCFullYear()} ${String(d.getUTCHours()).padStart(2,'0')}:${String(d.getUTCMinutes()).padStart(2,'0')}:${String(d.getUTCSeconds()).padStart(2,'0')} +0000`;
}
export async function GET() {
  const channels = ['dispatch', 'lifestyle'] as const;
  const allPosts = (
    await Promise.all(
      channels.map(async (channel) => {
        const entries = await getCollection(channel as any);
        return entries.map((post) => ({ post, channel }));
      })
    )
  ).flat();

  const sorted = allPosts.sort((a, b) =>
    String(b.post.data.date ?? '').localeCompare(String(a.post.data.date ?? ''))
  );

  const items = sorted.map(({ post, channel }) => {
    const title = post.data.title;
    const description = post.data.description ?? '';
    const url = `https://v64otd.com/${channel}/${post.slug}/`;
    const pubDate = toRFC822(String(post.data.date ?? ''));
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
    <lastBuildDate>${toRFC822(new Date().toISOString())}</lastBuildDate>
    ${items}
  </channel>
</rss>`;
  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' }
  });
}
