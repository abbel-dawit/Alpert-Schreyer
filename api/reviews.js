/**
 * GET /api/reviews
 * ---------------------------------------------------------------------------
 * Server-side proxy for Google Places reviews.
 *
 * Why this file exists at all:
 *   The Places API key must never reach the browser. A key embedded in client
 *   JS can be scraped and billed against in minutes. This function is the only
 *   thing that ever sees GOOGLE_PLACES_API_KEY.
 *
 * What it returns:
 *   { rating, total, fetchedAt, top: [...], recent: [...] }
 *
 * Known limitation — read this before promising anything to the client:
 *   The Places API returns a MAXIMUM OF 5 REVIEWS per place. There is no
 *   paging. "top" is Google's own relevance order; "recent" is newest-first.
 *   With four offices we merge up to 20 and slice, which is why the site shows
 *   a healthy rail — but you cannot render "all 200 reviews" from this API at
 *   any price. See docs/TECHNICAL-MANUAL.md §6.4 for the options if the firm
 *   wants full history.
 *
 * Runtime: Vercel / Netlify Functions (Node 18+, global fetch).
 */

const PLACES_ENDPOINT = 'https://places.googleapis.com/v1/places/';

// Replace these with real Place IDs — see TECHNICAL-MANUAL §6.1
const OFFICES = [
  { key: 'waldorf',   label: 'Waldorf',   placeId: process.env.PLACE_ID_WALDORF },
  { key: 'lanham',    label: 'Lanham',    placeId: process.env.PLACE_ID_LANHAM },
  { key: 'frederick', label: 'Frederick', placeId: process.env.PLACE_ID_FREDERICK },
  { key: 'rockville', label: 'Rockville', placeId: process.env.PLACE_ID_ROCKVILLE },
];

const FIELDS = [
  'id',
  'displayName',
  'rating',
  'userRatingCount',
  'reviews',
].join(',');

const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours
let memo = { at: 0, payload: null };

async function fetchPlace(office, key) {
  const url = `${PLACES_ENDPOINT}${encodeURIComponent(office.placeId)}?languageCode=en`;
  const res = await fetch(url, {
    headers: {
      'X-Goog-Api-Key': key,
      'X-Goog-FieldMask': FIELDS,
    },
  });
  if (!res.ok) throw new Error(`Places ${res.status} for ${office.key}`);
  return res.json();
}

function normalize(review, office) {
  return {
    author: review.authorAttribution?.displayName || 'Google user',
    photo: review.authorAttribution?.photoUri || null,
    profile: review.authorAttribution?.uri || null,
    rating: review.rating,
    text: review.originalText?.text || review.text?.text || '',
    time: review.publishTime || null,
    relative: review.relativePublishTimeDescription || null,
    office: office.label,
  };
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Serve warm cache without touching Google
  if (memo.payload && Date.now() - memo.at < CACHE_TTL_MS) {
    res.setHeader('Cache-Control', 'public, s-maxage=21600, stale-while-revalidate=86400');
    return res.status(200).json(memo.payload);
  }

  const key = process.env.GOOGLE_PLACES_API_KEY;
  const configured = OFFICES.filter((o) => o.placeId);

  if (!key || configured.length === 0) {
    // Not configured yet. Fail soft and loud: the client falls back to the
    // bundled seed file, and the operator sees exactly what's missing.
    return res.status(503).json({
      error: 'not_configured',
      missing: [
        !key && 'GOOGLE_PLACES_API_KEY',
        ...OFFICES.filter((o) => !o.placeId).map((o) => `PLACE_ID_${o.key.toUpperCase()}`),
      ].filter(Boolean),
    });
  }

  try {
    const places = await Promise.allSettled(
      configured.map((o) => fetchPlace(o, key).then((d) => ({ office: o, data: d })))
    );

    const good = places.filter((p) => p.status === 'fulfilled').map((p) => p.value);
    if (!good.length) throw new Error('all place lookups failed');

    let all = [];
    let weighted = 0;
    let total = 0;

    for (const { office, data } of good) {
      const count = data.userRatingCount || 0;
      if (data.rating && count) {
        weighted += data.rating * count;
        total += count;
      }
      for (const r of data.reviews || []) all.push(normalize(r, office));
    }

    // Only surface reviews that actually say something — a bare 5-star with no
    // text is real and counts toward the average, but it makes a dead card.
    const withText = all.filter((r) => r.text && r.text.trim().length > 0);

    const top = [...withText]
      .sort((a, b) => (b.rating - a.rating) || (b.text.length - a.text.length))
      .slice(0, 9);

    const recent = [...withText]
      .sort((a, b) => new Date(b.time || 0) - new Date(a.time || 0))
      .slice(0, 9);

    const payload = {
      rating: total ? Number((weighted / total).toFixed(1)) : null,
      total,
      fetchedAt: new Date().toISOString(),
      top,
      recent,
    };

    memo = { at: Date.now(), payload };

    res.setHeader('Cache-Control', 'public, s-maxage=21600, stale-while-revalidate=86400');
    return res.status(200).json(payload);
  } catch (err) {
    // Never 500 the review section into a blank hole. Serve the stale copy if
    // we have one; otherwise let the client fall back to the seed file.
    if (memo.payload) {
      res.setHeader('Cache-Control', 'public, s-maxage=60');
      return res.status(200).json({ ...memo.payload, stale: true });
    }
    return res.status(502).json({ error: 'upstream_unavailable' });
  }
}
