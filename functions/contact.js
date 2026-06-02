export async function onRequestPost(context) {
  const RESEND_API_KEY = context.env.RESEND_API_KEY;
  
  let body;
  try {
    body = await context.request.json();
  } catch {
    return new Response('Invalid request', { status: 400 });
  }

  const { name, email, subject, message, company } = body;

  // Build email content
  let htmlContent, textSubject;

  if (company) {
    // Popup company notification
    textSubject = `[AI Twin] Visitor from ${company}`;
    htmlContent = `
      <h2>Someone visited your AI Twin</h2>
      <p><strong>Company:</strong> ${company}</p>
      <p><em>They used your AI avatar at gregoiresayer.com</em></p>
    `;
  } else {
    // Contact form
    textSubject = `[gregoiresayer.com] ${subject || 'New message'}`;
    htmlContent = `
      <h2>New message from gregoiresayer.com</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <hr>
      <p>${message?.replace(/\n/g, '<br>') || ''}</p>
    `;
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'onboarding@resend.dev',
        to: 'gregasayer@gmail.com',
        subject: textSubject,
        html: htmlContent
      })
    });

    if (!res.ok) {
      const err = await res.text();
      return new Response(JSON.stringify({ error: err }), { status: 500 });
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
