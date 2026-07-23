#!/usr/bin/env node
/**
 * scripts/import-blog.mjs
 * ---------------------------------------------------------------------------
 * Pulls the full blog archive out of WordPress via its REST API and writes
 * data/blog.json. build.mjs renders that file if it exists, falling back to the
 * page-1 posts hard-coded in content.mjs if it doesn't.
 *
 * The live archive is ~390 posts across 39 pages. Scraping the HTML would be
 * slow and lossy; the REST API hands over clean post bodies, categories, dates,
 * and featured images in about 4 requests.
 *
 * Usage:
 *   node scripts/import-blog.mjs            # everything
 *   node scripts/import-blog.mjs --limit 50 # first 50, for a quick check
 *   node scripts/import-blog.mjs --dry      # report only, write nothing
 *
 * Requires network access — run it locally, commit data/blog.json.
 *
 * If the REST API is disabled (some security plugins turn it off), enable it
 * temporarily, or export a WordPress WXR file and parse that instead.
 */

import { writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = resolve(ROOT, 'data/blog.json');
const BASE = 'https://dcmdlaw.com/wp-json/wp/v2';

const args = process.argv.slice(2);
const DRY = args.includes('--dry');
const LIMIT = args.includes('--limit') ? Number(args[args.indexOf('--limit') + 1]) : Infinity;

const strip = (html) => String(html || '')
  .replace(/<[^>]*>/g, '')
  .replace(/&#8217;/g, '\u2019').replace(/&#8216;/g, '\u2018')
  .replace(/&#8220;/g, '\u201c').replace(/&#8221;/g, '\u201d')
  .replace(/&#8211;/g, '\u2013').replace(/&#8212;/g, '\u2014')
  .replace(/&hellip;/g, '\u2026').replace(/&nbsp;/g, ' ')
  .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&#0?39;|&#8242;|&rsquo;/g, "'").replace(/&quot;/g, '"')
  .replace(/\s+/g, ' ').trim();

async function getJson(url) {
  const r = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!r.ok) throw new Error(`HTTP ${r.status} for ${url}`);
  return { data: await r.json(), total: Number(r.headers.get('x-wp-totalpages') || 1) };
}

async function main() {
  console.log('[blog] Reading categories…');
  const cats = new Map();
  for (let p = 1; p <= 3; p++) {
    try {
      const { data } = await getJson(`${BASE}/categories?per_page=100&page=${p}`);
      if (!data.length) break;
      data.forEach((c) => cats.set(c.id, strip(c.name)));
    } catch { break; }
  }
  console.log(`[blog] ${cats.size} categories`);

  const posts = [];
  let page = 1, totalPages = 1;

  do {
    const url = `${BASE}/posts?per_page=100&page=${page}&_embed=wp:featuredmedia`;
    process.stdout.write(`\r[blog] page ${page}${totalPages > 1 ? '/' + totalPages : ''}…   `);
    const { data, total } = await getJson(url);
    totalPages = total;
    for (const p of data) {
      if (posts.length >= LIMIT) break;
      const media = p._embedded?.['wp:featuredmedia']?.[0];
      posts.push({
        slug: p.slug,
        date: p.date.slice(0, 10),
        title: strip(p.title?.rendered),
        excerpt: strip(p.excerpt?.rendered),
        // Body kept as HTML. build.mjs drops it into .article, which styles
        // h2/ul/li/a. Review it once — WordPress leaves shortcodes behind.
        html: p.content?.rendered || '',
        cats: (p.categories || []).map((id) => cats.get(id)).filter(Boolean),
        image: media?.source_url || null,
        imageW: media?.media_details?.width || null,
        imageH: media?.media_details?.height || null,
        draft: p.status && p.status !== 'publish',
      });
    }
    page++;
  } while (page <= totalPages && posts.length < LIMIT);

  console.log(`\n[blog] ${posts.length} posts fetched`);

  const shortcodes = posts.filter((p) => /\[[a-z_]+[^\]]*\]/i.test(p.html)).length;
  const noImage = posts.filter((p) => !p.image).length;
  console.log(`[blog] ${noImage} without a featured image (the template handles it)`);
  if (shortcodes) console.log(`[blog] WARNING: ${shortcodes} posts contain WordPress shortcodes — these will render as literal text. Grep data/blog.json for "[" and clean them.`);

  if (DRY) {
    console.log('\n[blog] --dry: nothing written. Sample:');
    posts.slice(0, 3).forEach((p) => console.log(`   ${p.date}  ${p.title.slice(0, 60)}`));
    return;
  }

  await mkdir(dirname(OUT), { recursive: true });
  await writeFile(OUT, JSON.stringify({
    generatedAt: new Date().toISOString(),
    generatedBy: 'import-blog.mjs',
    source: BASE,
    count: posts.length,
    categories: [...cats.values()].sort(),
    posts,
  }, null, 2));

  const kb = (JSON.stringify(posts).length / 1024).toFixed(0);
  console.log(`\n[blog] Wrote data/blog.json (${kb} KB)`);
  console.log('\n  Next:');
  console.log('   1. npm run build          # every post becomes a page');
  console.log('   2. Spot-check a few — WordPress content is rarely clean');
  console.log('   3. Add the old blog URLs to your redirect map if slugs changed\n');
}

main().catch((e) => {
  console.error('\n[blog]', e.message);
  console.error('[blog] If the REST API is disabled, enable it or export a WXR file instead.');
  process.exit(1);
});
