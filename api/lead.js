/**
 * POST /api/lead
 * ---------------------------------------------------------------------------
 * Handles the free-case-review form.
 *
 * This endpoint touches data that is potentially privileged and definitely
 * sensitive (an injured person describing their accident). Treat it that way:
 *
 *   - Nothing is logged except a request ID and an outcome. Never log the
 *     body. Never send the case description to an analytics tool.
 *   - Validation runs server-side regardless of what the client did.
 *   - Two silent bot filters: an unfilled honeypot field, and a minimum
 *     time-on-form. Neither shows a CAPTCHA to a person in pain.
 *   - Rate limited per IP.
 *
 * Wire DELIVERY (below) to whatever the firm actually uses — case management
 * intake, a shared mailbox, or both. See docs/TECHNICAL-MANUAL.md §5.3.
 */

const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_PER_WINDOW = 5;
const MIN_FILL_MS = 3000; // humans don't complete this in under 3s

const hits = new Map();

function rateLimited(ip) {
  const now = Date.now();
  const rec = hits.get(ip) || { n: 0, start: now };
  if (now - rec.start > WINDOW_MS) {
    hits.set(ip, { n: 1, start: now });
    return false;
  }
  rec.n += 1;
  hits.set(ip, rec);
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (now - v.start > WINDOW_MS) hits.delete(k);
  }
  return rec.n > MAX_PER_WINDOW;
}

const clean = (v, max) => String(v == null ? '' : v).trim().slice(0, max);

function validate(b) {
  const errors = {};
  const out = {
    name: clean(b.name, 120),
    phone: clean(b.phone, 40),
    email: clean(b.email, 160),
    zip: clean(b.zip, 10),
    case: clean(b.case, 5000),
    hear: clean(b.hear, 60),
    consent: b.consent === true || b.consent === 'on' || b.consent === 'true',
  };

  if (out.name.length < 2) errors.name = 'Name is required.';
  if (out.phone.replace(/\D/g, '').length < 10) errors.phone = 'A 10-digit phone number is required.';
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(out.email)) errors.email = 'A valid email is required.';
  if (!/^\d{5}$/.test(out.zip)) errors.zip = 'A 5-digit ZIP code is required.';
  if (out.case.length < 10) errors.case = 'Please describe the case.';
  if (!out.consent) errors.consent = 'Consent is required to contact you.';

  return { out, errors };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ip =
    (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
    req.socket?.remoteAddress ||
    'unknown';

  if (rateLimited(ip)) {
    return res.status(429).json({ error: 'Too many requests. Please call (301) 932-9997.' });
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};

  // Honeypot: a real person never sees or fills "company".
  if (clean(body.company, 200)) {
    return res.status(200).json({ ok: true }); // lie to the bot, drop the payload
  }

  // Timing check
  const started = Number(body.formStart || 0);
  if (started && Date.now() - started < MIN_FILL_MS) {
    return res.status(200).json({ ok: true });
  }

  const { out, errors } = validate(body);
  if (Object.keys(errors).length) {
    return res.status(400).json({ error: 'validation_failed', errors });
  }

  try {
    // ---- DELIVERY ---------------------------------------------------------
    // Replace with the firm's intake destination. Keep it server-to-server.
    //
    // await fetch(process.env.INTAKE_WEBHOOK_URL, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${process.env.INTAKE_TOKEN}`,
    //   },
    //   body: JSON.stringify({ ...out, receivedAt: new Date().toISOString(), source: 'dcmdlaw.com/' }),
    // });
    // -----------------------------------------------------------------------

    if (!process.env.INTAKE_WEBHOOK_URL) {
      console.warn('[lead] INTAKE_WEBHOOK_URL not set — lead accepted but not delivered');
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[lead] delivery failed', { ip: ip.slice(0, 7) + '…' });
    return res.status(502).json({ error: 'Could not submit. Please call (301) 932-9997.' });
  }
}
