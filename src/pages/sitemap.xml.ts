export const prerender = false;

export async function GET() {
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://v64otd.com/sitemap-index.xml</loc>
  </sitemap>
</sitemapindex>`,
    {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=86400',
      },
    }
  );
}
