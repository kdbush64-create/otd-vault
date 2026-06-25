import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env ?? (locals as any).env ?? {};
  const apiKey = env.MAILERLITE_API_KEY;

  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'Server misconfiguration.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let email: string | null = null;

  const contentType = request.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    const body = await request.json();
    email = body?.email ?? null;
  } else {
    const formData = await request.formData();
    email = formData.get('email') as string | null;
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return new Response(JSON.stringify({ error: 'Valid email address required.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const GROUP_ID = '191203552373245934';

  const mlRes = await fetch('https://connect.mailerlite.com/api/subscribers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      email,
      groups: [GROUP_ID],
    }),
  });

  if (mlRes.ok || mlRes.status === 200 || mlRes.status === 201) {
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // MailerLite returns 409 if subscriber already exists — treat as success
  if (mlRes.status === 409) {
    return new Response(JSON.stringify({ success: true, already: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const errorBody = await mlRes.text();
  console.error('MailerLite error:', mlRes.status, errorBody);

  return new Response(JSON.stringify({ error: 'Subscription failed. Please try again.' }), {
    status: 502,
    headers: { 'Content-Type': 'application/json' },
  });
};
