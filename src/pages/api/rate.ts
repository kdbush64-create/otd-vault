import type { APIRoute } from 'astro';
import { createHash } from 'crypto';

export const prerender = false;

function hashIP(ip: string): string {
  return createHash('sha256').update(ip + 'otd-salt-2026').digest('hex').slice(0, 32);
}

export const GET: APIRoute = async ({ request, locals }) => {
  const db = (locals as any).runtime?.env?.DB;
  if (!db) return new Response(JSON.stringify({ error: 'DB not available' }), { status: 500 });

  const url = new URL(request.url);
  const slug = url.searchParams.get('slug');
  if (!slug) return new Response(JSON.stringify({ error: 'Missing slug' }), { status: 400 });

  const result = await db.prepare(
    'SELECT COUNT(*) as count, AVG(stars) as avg FROM ratings WHERE slug = ?'
  ).bind(slug).first();

  return new Response(JSON.stringify({
    count: result?.count ?? 0,
    average: result?.avg ? Math.round((result.avg as number) * 10) / 10 : null
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
};

export const POST: APIRoute = async ({ request, locals }) => {
  const db = (locals as any).runtime?.env?.DB;
  if (!db) return new Response(JSON.stringify({ error: 'DB not available' }), { status: 500 });

  let body: any;
  try {
    body = await request.json();
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 });
  }

  const { slug, stars } = body;
  if (!slug || !stars || stars < 1 || stars > 5) {
    return new Response(JSON.stringify({ error: 'Invalid input' }), { status: 400 });
  }

  const ip = request.headers.get('cf-connecting-ip') ||
             request.headers.get('x-forwarded-for') ||
             'unknown';
  const ipHash = hashIP(ip);

  try {
    await db.prepare(
      'INSERT INTO ratings (slug, stars, ip_hash) VALUES (?, ?, ?)'
    ).bind(slug, Math.round(stars), ipHash).run();
  } catch (e: any) {
    if (e?.message?.includes('UNIQUE constraint')) {
      // Already voted — return current stats silently (not an error)
      const result = await db.prepare(
        'SELECT COUNT(*) as count, AVG(stars) as avg FROM ratings WHERE slug = ?'
      ).bind(slug).first();
      return new Response(JSON.stringify({
        count: result?.count ?? 0,
        average: result?.avg ? Math.round((result.avg as number) * 10) / 10 : null,
        already_voted: true
      }), { headers: { 'Content-Type': 'application/json' } });
    }
    return new Response(JSON.stringify({ error: 'DB error' }), { status: 500 });
  }

  const result = await db.prepare(
    'SELECT COUNT(*) as count, AVG(stars) as avg FROM ratings WHERE slug = ?'
  ).bind(slug).first();

  return new Response(JSON.stringify({
    count: result?.count ?? 0,
    average: result?.avg ? Math.round((result.avg as number) * 10) / 10 : null,
    already_voted: false
  }), { headers: { 'Content-Type': 'application/json' } });
};
