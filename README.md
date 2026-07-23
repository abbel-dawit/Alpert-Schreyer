# dcmdlaw.com — Standalone Site Rebuild

**Alpert Schreyer Personal Injury Lawyers**

A complete, standalone replacement for dcmdlaw.com. 45 pages, generated from a
content data layer. Content imported from the live site and preserved verbatim
— case results, testimonials, FAQ answers, attorney bios, consent text and the
legal disclaimer are exactly as published.

**This no longer depends on the WordPress install.** No navigation link, no
form, no page resolves back to it. Images still hotlink from `dcmdlaw.com/wp-content`
until you run `npm run media:vendor` — one command, documented below.

---

## Quick start

```bash
npm run build        # -> site/
```

Then **open `site/index.html`**. Double-click it, point your IDE's preview at
it, or serve the folder — all three work.

No framework. No install needed to build. `scripts/build.mjs` is plain Node.

### If you're opening this in an IDE

Point it at **`site/`** and you're done. Every path in the output is relative,
so it doesn't matter what your project root is.

The previous version shipped root-relative paths (`/assets/css/site.css`) split
across `dist/` and `preview/` folders. If your IDE's project root wasn't exactly
the site root, every asset and every link 404'd — which is why parts of the page
were missing and buttons went nowhere. That's fixed: **one folder, all relative,
works from any root.**

## What changed in this round

**Build 3.4.0** — check `site/version.txt`.

### Book flipped
The free-book section on the resources hub is now **book on the left, text on the
right**.

### Blog removed entirely
Gone: the `/blog/` index, every post page, the `/blog/admin/` editor, all blog
links in the nav and footer, the blog entry in the sitemap, and the unused blog
data and `postCard` component. The site went from 72 pages to **61**. No stray
`/blog/` link remains anywhere. (The WordPress importer script is left in
`scripts/` in case you ever want it, but nothing references it.)

### Standalone — ready to delete the old site

The goal this round: make this buildable and launchable with **no dependency on
dcmdlaw.com or WordPress**, so you can delete the old site and host this anywhere
— GitHub Pages, Netlify, Vercel, any static host.

What's already fully self-contained:
- **Fonts** — self-hosted via `/assets/fonts/fonts.css`. Zero requests to Google
  Fonts. Until you run `npm run fonts:vendor` to download the woff2 files, it
  falls back to system fonts, which look clean on their own — the site is never
  broken without them.
- **QR code** (desktop review-sheet handoff) — now generated inline in the
  browser. The third-party `api.qrserver.com` call is gone.
- **Maps & video** — load only when a visitor clicks the placeholder. Nothing
  from Google Maps or YouTube fires on page load.
- **Reviews, forms** — already server-side via `/api/`, no third-party JS.

**The one remaining step — images.** About 34 images and the hero video still
hotlink from dcmdlaw.com. They can't be bundled from here, but one command pulls
them local and rewrites every reference:

```bash
npm run media:vendor      # downloads to assets/media/, rewrites the source
npm run build
```

After that, delete `https://dcmdlaw.com` from `img-src` in `_headers` and
`vercel.json` and **nothing** resolves to the old host. You can delete the old
site. Full detail — including the favicon and logo, which vendor in the same
pass — is in TECHNICAL-MANUAL §4.

### Launch, start to finish

```bash
npm run media:vendor      # cut the last cord to the old host
npm run fonts:vendor      # optional polish — system fonts work without it
npm run build             # -> site/
# push site/ to GitHub Pages, or deploy the repo to Netlify/Vercel
```

That's the whole thing. No database, no WordPress, no server beyond the two
optional `/api/` functions for the contact form and live reviews.


## The 45 pages

```
/                                        Home
/about-our-firm/                         About
/about-our-firm/awards-recognition/      Awards
/about-our-firm/case-results/            Case results + Murphy's trial record
/about-our-firm/our-attorneys/           Attorney index
/about-our-firm/our-attorneys/<slug>/    4 full profiles — bios, creds, admissions
/about-our-firm/testimonials/            Stage + full grid
/practice-areas/                         Hub — 12 areas
/practice-areas/<slug>/                  12 pages, each with FAQ + related
/dui/<county>/                           4 counties
/areas-we-serve/                         Hub + 17 served cities
/areas-we-serve/<slug>/                  6 location pages
/reviews/                                Dedicated reviews + how-to
/contact/                                Form + all four offices
/privacy-policy/  /disclaimer/  /sitemap/
/blog/  /personal-injury-resources/{,free-downloads,video-center}  /es/
/404
+ sitemap.xml, robots.txt, llms.txt
```

**Five of those are honest stubs** — blog, the three resources pages, and `/es/`.
They're in the nav, so they need a destination rather than a 404, and each one
says plainly what hasn't been migrated and why. That content is CMS-managed and
wasn't in scope. `/es/` is the one that matters most: it serves a real audience
on the old template today.

---

## Architecture

```
src/content.mjs      ← ALL content. Edit this to change the site.
src/templates.mjs    ← layout, header, footer, review sheet, form, components
src/styles.css       ← design tokens + everything
src/app.js           ← nav, reviews, testimonial stage, forms, maps
scripts/build.mjs    ← renders site/
site/                ← GENERATED. Never edit.
```

Header, footer, review sheet and lead form exist **once** in the codebase.
Change the nav once, it changes on 45 pages.

Per my own note in the last technical manual (§3): once there's a second page,
inlining CSS stops being right. So CSS and JS are now external, hashed-cacheable
files:

| | Gzipped | |
|---|---|---|
| `index.html` | 17.2 KB | per page |
| `assets/css/site.css` | 12.0 KB | **cached across all 45** |
| `assets/js/app.js` | 8.1 KB | **cached across all 45** |

First page ~37 KB. Every page after ~17 KB.

---

## Verified

All 45 pages, automated:

- **4,645 relative links and asset refs — every one resolves to a real file**
- **Zero root-relative paths** (except `/api/`, which is a server route)
- **Content renders with JavaScript disabled** — no rule hides anything without
  a `.js` ancestor
- Balanced tags, exactly one `<h1>` per page
- Every image has `alt` **and** `width`/`height` — zero layout shift
- Every page has `lang`, a skip link, and a canonical
- Every JSON-LD block parses (LegalService, FAQPage, BreadcrumbList, Attorney)
- Zero `<a href>` escaping to dcmdlaw.com

---

## Before launch

Ordered by how much it matters.

1. **`npm run media:vendor`** — downloads all 24 assets locally and rewrites
   `content.mjs`. Until this runs, the new site can't outlive the old host.
   Try `--dry` first.
2. **Place IDs** — four values, ten minutes, and the review flow goes from
   "opens Google Maps" to "opens the review box". → TECHNICAL-MANUAL §6.1
3. **`GOOGLE_PLACES_API_KEY`** — restricted to Places API (New), with a daily
   quota cap. → §6.7
4. **`INTAKE_WEBHOOK_URL`** — **the form currently accepts leads and delivers
   them nowhere.** Wire it and send a test. → §5.3
5. **`npm run fonts:vendor`** — stops disclosing every visitor's IP to Google. → §4
6. **Vendor the QR generator** — currently a third-party endpoint. → §6.3
7. **Privacy policy** — migrate the real one; mine describes the build's actual
   behaviour as a starting point for counsel, not as a policy.
8. **Redirect map** — old URLs (`/waldorf-car-accident-lawyer/`) → new
   (`/practice-areas/car-accidents/`). **301s, not 302s.** Get this wrong and
   the rankings go with it.

Full checklist: TECHNICAL-MANUAL §9.

### A note on URLs

Links are written `../about-our-firm/index.html` so they work everywhere,
including straight off disk. Canonical tags point at the clean `/about-our-firm/`
URL, so that's what search engines index.

Once the host is configured to serve directory indexes, build with
`npm run build:clean-urls` and links become `../about-our-firm/`. Do that at
deploy time, not before — the explicit form is what makes local review work.

---

## Still worth doing

- **`/es/` properly.** The layout is already language-agnostic — it needs a
  Spanish `content.mjs`, and a human translator, not a machine.
- **Migrate the blog.** It's the biggest remaining content gap.
- **Real photography.** Several images do double duty because I used what was on
  the live site.
- **Instrument the review funnel** — sheet opened → office picked → Google
  opened. You can't improve the ask rate blind.
- **Individual practice-area copy.** Each page has real, specific content, but
  the originals may have more depth worth importing.
