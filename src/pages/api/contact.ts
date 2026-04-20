export const prerender = false;

export async function POST(context: any) {
  const data = await context.request.formData();
  const firstName = data.get('firstName')?.toString().trim() ?? '';
  const lastName  = data.get('lastName')?.toString().trim() ?? '';
  const email     = data.get('email')?.toString().trim() ?? '';
  const message   = data.get('message')?.toString().trim() ?? '';

  if (!firstName || !lastName || !email || !message || message.length < 10) {
    return new Response(JSON.stringify({ error: 'Validation failed' }), { status: 400 });
  }

  const apiKey = context.locals.runtime?.env?.RESEND_API_KEY ?? import.meta.env.RESEND_API_KEY;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'OTD Contact Form <noreply@mail.v64otd.com>',
      to: ['admin@v64otd.com'],
      reply_to: email,
      subject: `[OTD CONTACT] ${firstName} ${lastName}`,
      text: `FROM: ${firstName} ${lastName}\nEMAIL: ${email}\n\nMESSAGE:\n${message}`,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('Resend error:', err);
    return new Response(JSON.stringify({ error: 'Failed to send' }), { status: 500 });
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
