#!/usr/bin/env node
/**
 * scripts/vendor-images.mjs
 * ---------------------------------------------------------------------------
 * Downloads every image and video still referenced from dcmdlaw.com and
 * rewrites src/content.mjs to point at local copies.
 *
 * This is the last cord to the WordPress install. After this runs, the site is
 * fully standalone: no navigation link, no asset, nothing at all resolves back
 * to the old host. Until it runs, images hotlink from dcmdlaw.com — which works
 * (it's your own server) but means the new site cannot outlive the old one.
 *
 * Usage:  node scripts/vendor-images.mjs
 *         node scripts/vendor-images.mjs --dry
 *
 * Requires network access. Run it locally, commit the result.
 */

import { writeFile, mkdir, readFile } from 'node:fs/promises';
import { resolve, dirname, extname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = resolve(ROOT, 'assets/media');
// Every file that can reference a dcmdlaw.com asset. All get rewritten so no
// stray hotlink survives in the Spanish content or the shared templates.
const FILES = [
  resolve(ROOT, 'src/content.mjs'),
  resolve(ROOT, 'src/content.es.mjs'),
  resolve(ROOT, 'src/templates.mjs'),
];
const DRY = process.argv.includes('--dry');

const RX = /https:\/\/dcmdlaw\.com\/wp-content\/[^"'\s)]+/g;

const localName = (url) => {
  const clean = url.split('?')[0];
  const ext = extname(clean) || '.jpg';
  const stem = basename(clean, ext)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  // keep the uploads month so two files named 3703.jpg can't collide
  const m = clean.match(/\/uploads\/(\d{4})\/(\d{2})\//);
  const prefix = m ? `${m[1]}${m[2]}-` : '';
  return `${prefix}${stem}${ext}`;
};

async function main() {
  const sources = new Map();
  for (const f of FILES) {
    try { sources.set(f, await readFile(f, 'utf8')); } catch { /* file may not exist */ }
  }
  const allText = [...sources.values()].join('\n');
  const urls = [...new Set(allText.match(RX) || [])];

  if (!urls.length) {
    console.log('[media] Nothing left to vendor — no dcmdlaw.com assets in any source file.');
    return;
  }

  console.log(`[media] ${urls.length} assets referenced\n`);
  if (DRY) {
    for (const u of urls) console.log(`  ${localName(u).padEnd(42)} <- ${u}`);
    console.log('\n[media] --dry: nothing written.');
    return;
  }

  await mkdir(OUT, { recursive: true });
  const map = new Map();
  let done = 0, failed = 0, bytes = 0;

  for (const u of urls) {
    const name = localName(u);
    try {
      const res = await fetch(u, {
        headers: {
          // Some hosts hotlink-protect bare requests; a browser-like UA + a
          // same-site referer gets through where a plain fetch is refused.
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0 Safari/537.36',
          'Referer': 'https://dcmdlaw.com/',
          'Accept': 'image/avif,image/webp,image/apng,image/*,video/*,*/*;q=0.8',
        },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      await writeFile(resolve(OUT, name), buf);
      map.set(u, `/assets/media/${name}`);
      bytes += buf.length;
      done++;
      process.stdout.write(`\r[media] ${done}/${urls.length}  ${name.padEnd(44)}`);
    } catch (e) {
      failed++;
      console.error(`\n[media] FAILED ${u} — ${e.message}`);
    }
  }

  for (const [file, text] of sources) {
    let out = text;
    for (const [remote, local] of map) out = out.split(remote).join(local);
    if (out !== text) await writeFile(file, out);
  }

  console.log(`\n\n[media] Vendored ${done} assets (${(bytes / 1048576).toFixed(1)} MB) -> assets/media/`);
  if (failed) console.log(`[media] ${failed} failed — check the URLs above before deploying.`);
  console.log('[media] Rewrote local paths in: ' + [...sources.keys()].map((f) => basename(f)).join(', '));
  console.log('\n  Next:');
  console.log('   1. npm run build');
  console.log('   2. Compress: npx @squoosh/cli --webp auto assets/media/*.{jpg,png}');
  console.log('   3. Delete https://dcmdlaw.com from img-src in _headers and vercel.json');
  console.log('   4. The hero .mp4 is the big one — consider a shorter/compressed loop.\n');
}

main().catch((e) => { console.error('[media]', e); process.exit(1); });
