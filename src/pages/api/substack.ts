export const prerender = false;

export async function GET() {
  try {
    const res = await fetch('https://v64otd.substack.com/feed', {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const xml = await res.text();
    return new Response(xml, {
      headers: { 'Content-Type': 'application/xml', 'Cache-Control': 'public, max-age=300' }
    });
  } catch {
    return new Response('error', { status: 500 });
  }
}
