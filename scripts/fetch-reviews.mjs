#!/usr/bin/env node
/**
 * scripts/fetch-reviews.mjs
 * ---------------------------------------------------------------------------
 * Pulls Google reviews at BUILD time and writes data/reviews.cache.json.
 *
 * Why bother, when /api/reviews already exists?
 *   Two reasons, both about the first visitor.
 *   1. A cold serverless function can take a second or more to answer. The
 *      build-time cache means the reviews rail has real content in the very
 *      first paint, with no round trip at all.
 *   2. If Google is down, or the key gets rotated, or billing lapses on a
 *      Saturday, the site still shows real reviews instead of falling back to
 *      testimonials. The cache is the safety net under the safety net.
 *
 * Run it in CI on a schedule (daily is plenty — see TECHNICAL-MANUAL §6.5):
 *   node scripts/fetch-reviews.mjs
 *
 * Exits 0 even on failure. A review fetch must never break a deploy.
 */

import { writeFile, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'data', 'reviews.cache.json');

const OFFICES = [
  { key: 'waldorf', label: 'Waldorf', placeId: process.env.PLACE_ID_WALDORF },
  { key: 'lanham', label: 'Lanham', placeId: process.env.PLACE_ID_LANHAM },
  { key: 'frederick', label: 'Frederick', placeId: process.env.PLACE_ID_FREDERICK },
  { key: 'rockville', label: 'Rockville', placeId: process.env.PLACE_ID_ROCKVILLE },
];

const FIELDS = 'id,displayName,rating,userRatingCount,reviews';

function log(...a) {
  console.log('[fetch-reviews]', ...a);
}

async function fetchPlace(office, key) {
  const url = `https://places.googleapis.com/v1/places/${encodeURIComponent(office.placeId)}?languageCode=en`;
  const res = await fetch(url, {
    headers: { 'X-Goog-Api-Key': key, 'X-Goog-FieldMask': FIELDS },
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

function normalize(r, office) {
  return {
    author: r.authorAttribution?.displayName || 'Google user',
    photo: r.authorAttribution?.photoUri || null,
    profile: r.authorAttribution?.uri || null,
    rating: r.rating,
    text: r.originalText?.text || r.text?.text || '',
    time: r.publishTime || null,
    relative: r.relativePublishTimeDescription || null,
    office: office.label,
    source: 'google',
  };
}

async function main() {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  const configured = OFFICES.filter((o) => o.placeId);

  if (!key) {
    log('GOOGLE_PLACES_API_KEY not set — skipping. Site will use data/reviews.sample.json.');
    return;
  }
  if (!configured.length) {
    log('No PLACE_ID_* values set — skipping. See TECHNICAL-MANUAL §6.1.');
    return;
  }

  const settled = await Promise.allSettled(
    configured.map(async (o) => ({ office: o, data: await fetchPlace(o, key) }))
  );

  const good = [];
  for (let i = 0; i < settled.length; i++) {
    const s = settled[i];
    if (s.status === 'fulfilled') {
      good.push(s.value);
      log(`ok   ${configured[i].key} — ${s.value.data.userRatingCount ?? 0} ratings`);
    } else {
      log(`FAIL ${configured[i].key} — ${s.reason.message}`);
    }
  }

  if (!good.length) {
    log('All lookups failed. Leaving any existing cache in place.');
    return;
  }

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

  const withText = all.filter((r) => r.text && r.text.trim());

  const payload = {
    rating: total ? Number((weighted / total).toFixed(1)) : null,
    total,
    fetchedAt: new Date().toISOString(),
    offices: good.length,
    top: [...withText]
      .sort((a, b) => b.rating - a.rating || b.text.length - a.text.length)
      .slice(0, 9),
    recent: [...withText]
      .sort((a, b) => new Date(b.time || 0) - new Date(a.time || 0))
      .slice(0, 9),
  };

  await writeFile(OUT, JSON.stringify(payload, null, 2) + '\n', 'utf8');
  log(`wrote ${OUT} — ${payload.total} ratings, avg ${payload.rating}, ${withText.length} with text`);

  // Loud warning: the API cap is real and people forget it constantly.
  if (withText.length < 6) {
    log('NOTE: Places returns max 5 reviews per place. Few reviews have text.');
  }
}

main().catch((err) => {
  log('unexpected error —', err.message);
  process.exitCode = 0; // never break the build over reviews
});
