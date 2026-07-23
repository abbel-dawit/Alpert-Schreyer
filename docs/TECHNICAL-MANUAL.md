# Technical Manual

**dcmdlaw.com homepage redesign** — for whoever maintains this.

Assumes you can read HTML, CSS and JavaScript. Assumes nothing else.

---

## Contents

1. [How to run it](#1-how-to-run-it)
2. [How the page is put together](#2-how-the-page-is-put-together)
3. [Why it's one file, and when to stop](#3-why-its-one-file-and-when-to-stop)
4. [Self-hosting the fonts](#4-self-hosting-the-fonts)
5. [The lead form](#5-the-lead-form)
6. [The Google review system](#6-the-google-review-system)
7. [SEO and structured data](#7-seo-and-structured-data)
8. [Security](#8-security)
9. [Launch checklist](#9-launch-checklist)
10. [Common tasks](#10-common-tasks)
11. [Troubleshooting](#11-troubleshooting)

---

## 1. How to run it

```bash
npm run build              # -> site/
npm run dev                # build + serve site/ at http://localhost:3000
npm run build:clean-urls   # -> site/ with /about-our-firm/ instead of .../index.html
npm run standalone         # vendor images + fonts, then build
```

`site/` is the deliverable: 45 static HTML files plus shared assets.

**Never edit `site/`.** It is wiped and regenerated on every build. Edit
`src/content.mjs` (content) or `src/templates.mjs` (structure).

### Why every path is relative

Output uses relative paths (`../../assets/css/site.css`) and explicit
`index.html` on directory links. This is deliberate.

The first version used root-relative paths (`/assets/css/site.css`). Those only
work when the server root *is* the site root. Open the project folder in an IDE,
preview from a subfolder, double-click the file, or deploy under a sub-path, and
every asset and every link 404s. Relative paths work in all of those.

There were two failure modes stacked on top of each other, and they're worth
understanding because the second one was much worse than the first:

1. **Assets 404** → page renders unstyled. Ugly, obvious, harmless.
2. **`app.js` 404s** → `.rv{opacity:0}` never got its `is-in` class → **33
   elements on the home page stayed invisible.** The page looked half-built.

Failure 2 was a design bug independent of any path issue. See §2.1.

### Trade-off

Links read `/about-our-firm/index.html` rather than `/about-our-firm/`. Both
serve the same page; canonical tags point at the clean URL, so that's what gets
indexed. If you want clean URLs in the address bar, build with `--clean-urls`
once the host serves directory indexes (`cleanUrls: true` is already set in
`vercel.json`). Do it at deploy time — the explicit form is what makes local
review work.

## 2.1 Fail-safe rendering — do not undo this

Anything that hides content is guarded behind `.js`, which is added to `<html>`
by an inline script in `<head>`:

```css
.js .rv{opacity:0}          /* hidden only if JS is confirmed running */
.js .rv.is-in{opacity:1}    /* revealed on scroll */
```

If the script 404s, is blocked by CSP, throws, or is disabled, **none of those
rules apply and everything renders visible.** Three things were fixed this way:

| Element | Was | Now |
|---|---|---|
| `.rv` (33 per page) | `opacity:0` | visible; `.js` opts into the reveal |
| `.gapbar__fill` | `scaleX(0)` | bars drawn; `.js` opts into the animation |
| `.actionbar` | `translateY(110%)` | visible; `.js` opts into hide-on-scroll |

> **The rule: never write a style that hides content unless a `.js` ancestor
> guards it.** A failed script must degrade the experience, never the content.
> This is a law firm's intake page — a blank section is a lost client.

### Deploying

**Netlify / Cloudflare Pages**
```bash
# Publish directory: .
# Functions directory: api
```
`_headers` and `netlify.toml` are already configured.

**Vercel**
```bash
vercel --prod
```
`vercel.json` carries the same header policy. `api/*.js` are picked up as
functions automatically.

**Anywhere else** — it's a static file plus two Node handlers. If your host runs
Node 18+, you're fine.

### Environment variables

Copy `.env.example` → `.env` and fill it in. Every variable is annotated there.
Set the same values in your host's dashboard. **Nothing in `.env` is safe to
expose to the client** — never prefix any of it with `NEXT_PUBLIC_`, `VITE_`, or
any other bundler-inlining prefix.

---

## 2. How the page is put together

`index.html` reads top to bottom in this order:

```
<head>
  meta / OG / canonical
  font links                    <- swap these out, see §4
  JSON-LD: LegalService         <- four office locations
  JSON-LD: FAQPage
  <style>                       <- all CSS, ~50 KB
    :root { design tokens }     <- change colours and type HERE, nowhere else
    reset + base
    type roles
    buttons
    ...one block per section
  </style>
</head>
<body>
  skip link
  utility bar
  sticky header + mega menus
  mobile drawer
  <main>
    hero (video, ledger strip, lead form)
    gap bar          <- the signature element
    trust badges
    intro prose
    case results ledger
    reviews          <- tabs + rail
    review ask band
    why choose
    practice areas
    attorneys
    testimonials
    FAQ
    CTA
    contact + offices
  </main>
  footer
  mobile action bar
  toast
  <dialog id="reviewSheet">     <- review capture
  <script>                      <- all JS, ~21 KB
</body>
```

### The token system

Everything visual routes through CSS custom properties in `:root`. To restyle
the site, you edit that block and nothing else.

```css
:root{
  --ink-900:#0E1A22;    /* dark sections, headings */
  --paper:#F5F6F4;      /* page background */
  --crimson:#A6192E;    /* actions, accents — Maryland Crossland red */
  --teal:#2E6E6A;       /* review ask band, success */
  --star:#F5A623;       /* Google stars — SEE NOTE */

  --sans:"Public Sans", ...;    /* body + UI */
  --serif:"Newsreader", ...;    /* display, sparingly */
  --mono:"IBM Plex Mono", ...;  /* money + case data */
}
```

> **Note on `--star`.** Gold appears *only* inside Google star ratings. That's a
> deliberate constraint, not an accident: it means gold on this site always
> signals "this is review data." If you start using it for buttons or dividers,
> the review module stops reading as evidence and starts reading as decoration.
> Don't.

Type scale is fluid via `clamp()` — `--t-xs` through `--t-4xl`. Don't hardcode
`font-size` in px; use the tokens or the scale breaks between breakpoints.

### Breakpoints

| Width | What changes |
|---|---|
| `< 560px` | Ledger strip dividers hidden |
| `< 640px` | Review sheet becomes a bottom sheet |
| `< 1180px` | **Desktop nav → burger + drawer. Mobile action bar appears.** |
| `≥ 1040px` | Reviews rail → 3-up grid |
| `≥ 1060px` | Hero → two columns |

The important one is 1180px — that's where the nav swaps. It's high because the
nav has seven items and they don't fit sooner.

---

## 3. The build system

The first version of this site was a single self-contained `index.html` with
inlined CSS and JS. That was the right call for one page and the wrong call for
45 — so it was split, exactly as the previous edition of this manual said it
should be.

### Where things live

```
src/content.mjs      ALL content — text, offices, attorneys, case results, FAQs
src/templates.mjs    layout, header, footer, review sheet, form, components
src/styles.css       design tokens + all styling
src/app.js           all behaviour
scripts/build.mjs    renders everything into dist/
dist/                GENERATED — never edit
```

### Why external assets now

| | Gzipped | Cached? |
|---|---|---|
| `index.html` | 16.3 KB | no — per page |
| `assets/css/site.css` | 11.7 KB | **yes — across all 45** |
| `assets/js/app.js` | 7.9 KB | **yes — across all 45** |

First page ~36 KB. Every subsequent page ~16 KB. Inlining would have cost 33 KB
on *every* page. `_headers` already sets `immutable` on `/assets/*`.

**When you add hashing:** rename to `site.<hash>.css` in `build.mjs` and update
the `<link>` in `templates.mjs → layout()`. One place each.

### Adding a page

Add an entry in `scripts/build.mjs`:

```js
page('/some-path/', layout({
  title: '…', desc: '…', path: '/some-path/',
  ld: [ldBreadcrumbs([{ t: 'Some Path' }])],
  body: `${pageHero({ h1: 'Heading', crumbs: [{ t: 'Some Path' }] })} …`,
}));
```

It's picked up by `sitemap.xml`, `llms.txt` and `/sitemap/` automatically —
those are generated from the page list, so they can't drift out of sync.

To add it to the **nav**, edit `navTree` in `src/templates.mjs`. That drives the
desktop mega-menu and the mobile drawer from one array.

---

## 4. Going fully standalone (no dcmdlaw.com, no WordPress)

The site is built to be **deleted-old-site ready**: nothing has to resolve back
to the WordPress install. Here's the complete dependency picture and how each
piece is already handled or closed out.

### Fonts — done (self-hosted)

`/assets/fonts/fonts.css` holds `@font-face` rules pointing at local woff2 files
and `local()` sources, with the system-font stack as the fallback. No request
goes to Google Fonts. The woff2 files are populated by:

```bash
npm run fonts:vendor
```

Until you run that, the `@font-face` rules simply don't resolve and the site
uses San Francisco / Segoe UI / Roboto (body) and Georgia (headings). That looks
intentional, so vendoring fonts is polish, not a blocker.

### QR code — done (inline)

The desktop review-sheet phone-handoff QR is generated in-browser by a small
inline encoder in `app.js` (`qrSvg`). No third-party endpoint. It's a
convenience beside the primary "Open Google review box" button, so if it ever
fails to render it just hides itself — the button always works.

### Maps and video — done (click-to-load)

Google Maps embeds and the YouTube video sit behind facades: a static
placeholder loads on the page, and the real iframe is injected only when the
visitor clicks. No off-origin request fires on page load. Nothing to vendor.

### Images — one command

About 34 images plus the hero `.mp4` still hotlink from dcmdlaw.com. This is the
last cord. To cut it:

```bash
npm run media:vendor        # or: node scripts/vendor-images.mjs --dry
npm run build
```

`vendor-images.mjs` downloads every `dcmdlaw.com/wp-content/...` asset into
`assets/media/`, then rewrites the references in `content.mjs`, `content.es.mjs`
**and** `templates.mjs` (which is where the logo and favicon live) to local
paths. It sends browser-like headers, so hotlink protection that blocks a bare
request usually lets it through. Run it locally — it needs network.

If a handful fail (some hosts are strict), the script lists exactly which URLs.
Download those by hand into `assets/media/` using the printed local filenames,
then re-run `npm run build`.

After vendoring:

1. `npm run build`
2. Delete `https://dcmdlaw.com` from `img-src` in `_headers` and `vercel.json`.
3. Confirm nothing is left: `grep -r dcmdlaw.com site/` should return nothing.

At that point the old site can be deleted. This one has no runtime dependency on
it.

### Deploying to GitHub Pages / anywhere

The build emits all-relative paths and an explicit `index.html` in every folder,
so it works from any subpath without a server rewrite.

- **GitHub Pages** — push the contents of `site/` to your Pages branch (or point
  Pages at `/site`). Done. Add a `.nojekyll` file so Pages doesn't reprocess it.
- **Netlify** — `netlify.toml` already sets `publish = "site"`. Connect the repo.
- **Vercel** — `vercel.json` is included. Import the repo.
- **Any static host / S3 / nginx** — upload `site/`.

The only things that need a server are the two `/api/` functions (contact form
delivery and live Google reviews). On a pure-static host without them, the form
falls back gracefully and reviews use the bundled seed file — the site still
works, it just won't email leads or show live-updated reviews until those
endpoints exist.


## 5. The lead form

### 5.1 How it behaves

- **Without JS:** native `POST` to `/api/lead`. Everything still works.
- **With JS:** inline validation on blur, `fetch` submit, success panel swap.

### 5.2 Validation

Client rules live in the `LEAD FORM` IIFE. Server rules live in
`api/lead.js → validate()`. **They're intentionally duplicated.** The client
copy is for the human's benefit; the server copy is the one that matters. Never
delete the server copy on the grounds that the client already checks.

### 5.3 Delivery — you must wire this up

`api/lead.js` currently validates, filters bots, and returns `200`. **It does
not deliver anywhere.** Find the `---- DELIVERY ----` block and point it at the
firm's intake:

```js
await fetch(process.env.INTAKE_WEBHOOK_URL, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.INTAKE_TOKEN}`,
  },
  body: JSON.stringify({ ...out, receivedAt: new Date().toISOString(), source: 'dcmdlaw.com/' }),
});
```

Until `INTAKE_WEBHOOK_URL` is set, the function logs a warning on every
submission. Watch for it in your host's function logs — a silently-accepted lead
that goes nowhere is the worst possible failure mode on this page.

### 5.4 Bot filtering

Two silent filters, no CAPTCHA:

| Filter | How |
|---|---|
| **Honeypot** | A hidden `company` field. Humans never see it; bots fill it. If filled → return `200 {ok:true}` and drop the payload. Lying to the bot means it doesn't retry. |
| **Timing** | `formStart` is stamped on page load. Submissions under 3 seconds are dropped the same way. |

No CAPTCHA is a deliberate choice. Your visitors have concussions, broken wrists,
and are frequently on a phone in a hospital waiting room. Making them identify
traffic lights to ask a lawyer for help is a real cost, and these two filters
catch the overwhelming majority of automated spam without it.

If spam gets through anyway, add Cloudflare Turnstile in invisible mode before
you add a visible challenge.

### 5.5 Privacy — read this

**The case description is potentially privileged.** `api/lead.js` never logs the
request body, and it must stay that way.

- Don't add `console.log(body)` when debugging. Log field *names* if you must.
- Don't send form contents to GA4, GTM, or any session-replay tool. If GTM is
  reinstated, verify it isn't capturing form input.
- `/api/*` is `no-store` and `X-Robots-Tag: noindex` in the header configs.

---

## 6. The Google review system

### 6.1 Getting the Place IDs — do this first

Nothing in the review system works until this is done. Four IDs, ten minutes.

1. Open the **Place ID Finder**:
   https://developers.google.com/maps/documentation/places/web-service/place-id
2. Search each office by name + address:
   - `Alpert Schreyer Personal Injury Lawyers, 8 Post Office Rd, Waldorf MD 20602`
   - `Alpert Schreyer Personal Injury Lawyers, 4600 Forbes Blvd #200, Lanham MD 20706`
   - `Alpert Schreyer Personal Injury Lawyers, 25 E Patrick St, Frederick MD 21701`
   - `Alpert Schreyer Personal Injury Lawyers, 11140 Rockville Pike Suite 550-J, Rockville MD 20852`
3. Copy each `ChIJ...` string into `.env`:
   ```
   PLACE_ID_WALDORF=ChIJ...
   PLACE_ID_LANHAM=ChIJ...
   PLACE_ID_FREDERICK=ChIJ...
   PLACE_ID_ROCKVILLE=ChIJ...
   ```
4. In `index.html`, find the four `data-write` attributes in `#reviewSheet` and
   replace `PLACE_ID_WALDORF` etc. with the real IDs:
   ```html
   data-write="https://search.google.com/local/writereview?placeid=ChIJ..."
   ```

> **Verify each one.** Paste the finished `writereview` URL into a browser. It
> must open the review box for *that specific office*. Getting these wrong sends
> a client's five-star review to the wrong listing, and you can't move it.

**Until this is done**, the sheet falls back to each office's real Google Maps
short link (`data-fallback`). The buttons work; they just don't land on the
one-tap review box. Nothing is broken in the interim — it's just not the good
version.

### 6.2 Review gating — do not build it

**The rule:** every visitor gets the same Google link, unconditionally.

You will, at some point, be asked to add a star selector that sends happy
clients to Google and unhappy ones to a private form. Refuse, and point at this
section.

- **Google's review policy explicitly prohibits it.** "Review gating" —
  soliciting reviews selectively based on predicted sentiment — is prohibited
  content. Enforcement ranges from removing the affected reviews to suspending
  the listing.
- **The listing is a primary intake channel.** Trading it for a handful of
  filtered three-star reviews is a spectacularly bad trade.
- **There's a conduct angle.** Sentiment-filtered solicitation is arguably a
  misleading communication about the firm's services. Worth a conversation with
  ethics counsel before anyone gets creative here.

**What's built instead:** the private-feedback path in the sheet
(`.sheet__alt`) is shown to *everyone*, always, next to the Google button. An
unhappy client gets the same kindness. The firm gets none of the exposure.

This is not a technical constraint that can be engineered around. It's a policy
constraint. Leave it alone.

### 6.3 The QR code — vendor it before launch

`renderQR()` currently builds an `<img>` pointing at `api.qrserver.com`. That
means a third party is told which office a visitor is about to review.

Fine for preview. Not fine for launch. Replace with a local generator:

```bash
npm i qrcode
```

```js
import QRCode from 'qrcode';
QRCode.toCanvas(host, text, { width: 300, margin: 0 });
```

Then drop `https://api.qrserver.com` from `img-src` in `_headers` and
`vercel.json`.

The QR block is desktop-only (`pointer:coarse` check) — there's no point showing
a phone a QR code to scan with itself.

### 6.4 The five-review cap — know this before you promise anything

**The Google Places API returns a maximum of five reviews per place.** No
paging. No parameter. No pricing tier changes it. This is a hard product
limitation.

What we do about it: query all four offices and merge. Four places × 5 = up to
20 reviews, filtered to those with actual text, sorted into `top` and `recent`,
sliced to 9 each. That fills the rail well.

What we *cannot* do: show "all 247 reviews." If that's the requirement, the
options are:

| Option | Reality |
|---|---|
| Third-party aggregator (Reviews.io, Trustindex, EmbedSocial, etc.) | They scrape or use partner access. Monthly cost. You're trusting a third party with your listing data, and adding their JS to your page — which undoes a chunk of the performance and CSP work here. |
| Google Business Profile API | Different API from Places. Requires ownership verification of the listings. Gives fuller access to reviews on *your own* profiles, including replies. **This is the right answer if the firm wants the full set.** Non-trivial OAuth setup. |
| Manual curation | Paste selected reviews into a JSON file. Honest, free, and stale. Fine as a stopgap. |

If asked: **Google Business Profile API** is the correct path, because the firm
owns the listings.

### 6.5 Sorting

`top` and `recent` are computed server-side in `api/reviews.js`:

- **top** — `rating` descending, then text length descending. Google's own
  "most relevant" ordering isn't exposed as a field, so this approximates it.
  A long detailed five-star beats a bare five-star.
- **recent** — `publishTime` descending.

Reviews with no text are filtered out of both. They still count toward the
aggregate average (that comes from `userRatingCount` and `rating`, straight from
Google), they just don't make good cards.

### 6.6 Caching

Three layers, so the section is never empty:

```
1. In-memory memo in api/reviews.js       6 hours
2. CDN via Cache-Control s-maxage         6 hours, stale-while-revalidate 24h
3. Build-time cache (npm run reviews:cache)  written at deploy
4. data/reviews.sample.json               last resort — the firm's own testimonials
```

On upstream failure the function serves its stale copy rather than a 500. If it
has nothing, the client falls back to the seed file.

> **The seed file is labelled honestly.** Every record in
> `data/reviews.sample.json` is tagged `"source": "testimonial"`, and
> `srcBadge()` renders those as *"Client testimonial"* — not with a Google logo.
> These are the firm's own published testimonials, not Google reviews. **Never
> add fabricated Google reviews to that file, and never strip the `source` tag
> to make the fallback look more impressive.** Putting a Google logo on a review
> that isn't from Google is a false attribution — an FTC problem, a bar problem,
> and a Google problem all at once.

### 6.8 The demo/preview review data

`data/reviews.sample.json` ships with five records tagged `"source": "demo"` and
a top-level `"demo": true`. This exists so the reviews rail renders with real
layout — avatars, stars, dates, clamping — before the Places API is wired.

Two things happen because of those tags, and both must stay:

1. `"demo": true` renders the amber notice above the rail
   (`#reviewNotice`, built in `app.js → notice()`), which says plainly that this
   is sample data and not live Google reviews.
2. `"source": "demo"` on each record makes `srcBadge()` render
   **"Sample — not from Google"** instead of the Google logo.

**The words and names are the firm's own published testimonials.** They are real
client words. They are not Google reviews, and the dates are placeholders.

> **Do not** invent reviews here. **Do not** strip the `source` tag or flip
> `demo` to false to make the preview look more impressive. Putting a Google
> logo on a review that didn't come from Google is a false attribution — an FTC
> problem, a bar problem, and a Google policy problem at the same time.

Once `GOOGLE_PLACES_API_KEY` and the `PLACE_ID_*` values are set, `/api/reviews`
answers, the demo file is never read, and the notice disappears by itself. No
code change needed.

### 6.7 API key restrictions

In Google Cloud Console, restrict the key:

- **Application restrictions:** None. (Server-side calls carry no referrer —
  an HTTP-referrer restriction will break the function.)
- **API restrictions:** Places API (New) only.
- **Quota:** set a daily cap. If the key ever leaks, the cap is what stops it
  from becoming a five-figure invoice.

---

## 7. SEO and structured data

### 7.1 What's marked up

- `LegalService` with all four office `location` entries
- `FAQPage` matching the visible FAQ exactly

### 7.2 Content parity

Every piece of copy from the live homepage is preserved verbatim: case results,
testimonials, FAQ answers, the TCPA consent text, the legal disclaimer, office
addresses and phone numbers. All original URLs are intact. **Nothing was
rewritten.** If you're diffing against the old page for an SEO review, expect
content parity and structural change only.

### 7.3 Why there's no AggregateRating — leave it out

You'll be tempted to mark up the review score. Don't.

Google's structured data guidelines prohibit review snippets where the reviews
are collected from a third party and displayed on your own site to describe
yourself. Self-serving `AggregateRating` on a `LocalBusiness` is precisely the
pattern that triggers a manual action, and manual actions are painful to lift.

The reviews still display. They just don't get marked up as a rich result. The
star rating in your search listing comes from your Google Business Profile
anyway — which is the legitimate channel for exactly this, and it's already
working.

### 7.4 If you keep GTM

The old site runs GTM (`GTM-N6MHQLW`). It's **not** in this build — deliberately,
because it was the single biggest thing on the critical path.

If it goes back in:
- Load it after `load`, not in `<head>`.
- The CSP already allows `www.googletagmanager.com` in `script-src`.
- **Audit what it captures.** GTM's form-tracking will happily hoover up the
  case description field. See §5.5.

---

## 8. Security

### 8.1 Header policy

Set in `_headers` (Netlify/Cloudflare) and `vercel.json` (Vercel). Keep both in
sync — they're duplicated because the platforms don't share a format.

| Header | Value | Why |
|---|---|---|
| `Content-Security-Policy` | see file | The big one. |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | Two years. Submit to the preload list. |
| `X-Content-Type-Options` | `nosniff` | |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Don't leak paths to third parties. |
| `X-Frame-Options` | `DENY` | Belt and braces with `frame-ancestors`. |
| `Permissions-Policy` | geolocation/mic/camera/payment/usb all `()` | The page needs none of them. |
| `Cross-Origin-Opener-Policy` | `same-origin` | |

### 8.2 Tightening the CSP

The shipped policy is written for preview mode. After §4 and §6.3:

```diff
- style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
+ style-src 'self' 'unsafe-inline';
- font-src 'self' https://fonts.gstatic.com;
+ font-src 'self';
- img-src 'self' data: https://dcmdlaw.com https://*.googleusercontent.com https://*.ggpht.com https://api.qrserver.com https://www.googletagmanager.com;
+ img-src 'self' data: https://dcmdlaw.com https://*.googleusercontent.com https://*.ggpht.com;
```

Keep `googleusercontent.com` and `ggpht.com` — that's where Google review
avatars are hosted.

**`'unsafe-inline'` in `script-src`** is there because the JS is inline (§3).
When you extract it to a file, remove `'unsafe-inline'`. That's the single
biggest CSP win available. If you must keep inline JS, use a per-request nonce
instead.

### 8.3 Image hosts — the last cord to WordPress

Images point at `dcmdlaw.com/wp-content/...` — the live WordPress install.
Everything else is standalone: no navigation link, no form, no page depends on
it. Images are the only remaining tie.

That's fine in the sense that it's your own server. It is **not** fine if the
plan is to retire WordPress, because the day it goes away the new site loses all
24 of its images.

```bash
npm run media:vendor -- --dry   # list what would be downloaded
npm run media:vendor            # download + rewrite src/content.mjs
npm run build
```

Then:
1. Compress: `npx @squoosh/cli --webp auto assets/media/*.{jpg,png}`
2. Drop `https://dcmdlaw.com` from `img-src` in `_headers` and `vercel.json`
3. The hero `.mp4` is the heavy one — consider re-encoding to a shorter loop

Verify with DevTools → Network: nothing should come from a domain you don't own.

### 8.4 Dependencies

There are none. No npm packages ship to the browser. The `devDependencies` used
by the scripts (`serve`, `lighthouse`, `pa11y`, `linkinator`) run via `npx` and
never reach production.

This is worth protecting. Every library added to this page is a supply-chain
risk on a site handling privileged intake. The bar for adding one should be high.

---

## 8.5 Redirects — the highest-risk item in the whole migration

URLs changed. The old site used flat, Waldorf-prefixed slugs; this one uses a
hierarchy. Every one of these needs a **301** (permanent), not a 302:

| Old | New |
|---|---|
| `/waldorf-car-accident-lawyer/` | `/practice-areas/car-accidents/` |
| `/waldorf-truck-accident-lawyer/` | `/practice-areas/truck-accidents/` |
| `/marylands-top-semi-truck-accident-lawyers/` | `/practice-areas/semi-truck-accidents/` |
| `/waldorf-motorcycle-accident-lawyer/` | `/practice-areas/motorcycle-accidents/` |
| `/waldorf-dog-bites-lawyer/` | `/practice-areas/dog-bites/` |
| `/waldorf-slip-and-fall-lawyer/` | `/practice-areas/slip-and-fall/` |
| `/waldorf-workers-compensation-lawyer/` | `/practice-areas/workers-compensation/` |
| `/waldorf-premises-liability-lawyer/` | `/practice-areas/premises-liability/` |
| `/waldorf-construction-accident-lawyer/` | `/practice-areas/construction-accidents/` |
| `/maryland-hit-run-accident-lawyers/` | `/practice-areas/hit-and-run-accidents/` |
| `/maryland-rideshare-accident-lawyers/` | `/practice-areas/rideshare-accidents/` |
| `/maryland-multi-car-accident-attorneys/` | `/practice-areas/multi-car-accidents/` |
| `/prince-georges-county-dui-lawyer/` | `/dui/prince-georges-county/` |
| `/montgomery-county-dui-lawyer/` | `/dui/montgomery-county/` |
| `/charles-county-dui-lawyer/` | `/dui/charles-county/` |
| `/frederick-county-dui-lawyer/` | `/dui/frederick-county/` |
| `/lanham-personal-injury-lawyer/` | `/areas-we-serve/lanham/` |
| `/waldorf-personal-injury-lawyer/` | `/areas-we-serve/waldorf/` |
| `/charles-county-personal-injury-lawyer/` | `/areas-we-serve/charles-county/` |
| `/prince-georges-county-personal-injury-lawyer/` | `/areas-we-serve/prince-georges-county/` |

Netlify — add to `_redirects`:
```
/waldorf-car-accident-lawyer/    /practice-areas/car-accidents/    301!
```
Vercel — add to the `redirects` array in `vercel.json` with `"permanent": true`.

**Crawl the old site first.** The table above covers what's in the nav. There
will be more — old blog URLs, area pages, campaign landing pages. Run a crawler
against the live site, export every indexed URL, and map all of them. Anything
you miss becomes a 404 that used to rank.

Do not skip this and do not use 302s. This is the single easiest way to lose the
organic traffic the firm has spent years building, and it is very hard to undo.

## 11. The Spanish site

`/es/` is generated from `src/content.es.mjs` + `src/templates.es.mjs`.

**The content is imported, not translated.** The firm runs professionally
translated pages at dcmdlaw.com/es/; the testimonials, case results, FAQs, TCPA
consent text and disclaimer below are their translator's words, verbatim. Do not
replace them with machine output. "Contributory negligence" and "statute of
limitations" are terms of art, and in a state where 1% fault bars recovery
entirely, a mistranslation is a liability rather than a typo.

### Why a separate template file

The Spanish tree is smaller: 6 practice areas not 12, no DUI county pages, no
blog. That mirrors what the firm publishes in Spanish. Threading a `lang` flag
through the English templates would have meant generating Spanish URLs for
content with no Spanish copy — thin pages Google penalises, in a language nobody
proofread.

### The language map

`ES_ALT` in build.mjs maps English paths to Spanish equivalents. It drives three
things at once: the Español link in the header/drawer, the hreflang alternates,
and the English link back.

```js
'/contact/': '/es/contacto/',
'/practice-areas/car-accidents/': '/es/areas-de-practica/accidentes-de-auto/',
```

Pages absent from the map get **no hreflang** and their Español link falls back
to the Spanish home page. That is deliberate: hreflang pointing at a page that
isn't a real translation is a Search Console error, and claiming an alternate
that doesn't exist is worse than not claiming one.

**When you add a Spanish page, add it to `ES_ALT`.** Otherwise the link exists
but nothing points back at it.

## 12. The blog — no WordPress dependency

The blog runs off **`data/blog.json`**. If that file exists, the build renders
from it and nothing touches WordPress. If it doesn't, the build falls back to
the ten seed posts in `content.mjs`, so a fresh clone still builds.

```
data/blog.json  ──▶  scripts/build.mjs  ──▶  site/blog/**
      ▲
      ├── written by the editor at /blog/admin/  (hand-authored posts)
      └── written by  npm run import:blog          (bulk WordPress import)
```

Both writers emit the **same file shape**, so you can import the whole archive
once, then maintain it by hand in the editor forever after. WordPress is a
one-time source, not a runtime dependency.

### The editor — /blog/admin/

A standalone page (`src/admin/editor.html`, copied to `site/blog/admin/`). It:

- lists, creates, edits and deletes posts, with a live HTML preview
- writes to the browser's localStorage as you work
- **exports `blog.json`** — the button downloads the file; drop it in `data/`
  and rebuild
- **imports WordPress** — drag in either a REST API JSON response
  (`/wp-json/wp/v2/posts?per_page=100&_embed`) or a WXR/XML export from
  `Tools → Export`. Posts merge by slug, so re-importing updates rather than
  duplicates.

The authoring loop is: **edit → Export blog.json → drop in `data/` → `npm run
build` → deploy.** There is no live database and nothing to run server-side.

### About the passphrase — read this

The editor opens with a passphrase gate (`alpert2026`, set in `editor.html`).
**On a static host this is not security.** Anyone who opens DevTools can read the
passphrase and the posts. It only stops a casual visitor who wanders to the URL.

Real protection has to come from the host. Options, best first:

1. **Don't deploy it.** Build with `BLOG_ADMIN=off npm run build` and the editor
   is left out of `site/` entirely. Run it locally, export, commit the JSON.
2. **Host access control** — Netlify Identity, Cloudflare Access, or HTTP Basic
   Auth scoped to `/blog/admin/*`. This is real auth; the gate is not.
3. Leave the cosmetic gate and accept it hides the page but doesn't secure it.

The page is `noindex` and blocked in `robots.txt` either way, so search engines
won't surface it — but that is obscurity, not protection.

### Bulk import, the first time

```bash
npm run import:blog -- --dry       # report, write nothing
npm run import:blog                # everything -> data/blog.json
npm run build
```

Reads `dcmdlaw.com/wp-json/wp/v2/posts`. Needs network, so run it locally and
commit `data/blog.json`. Two things to expect:

1. **Shortcodes.** WordPress bodies contain `[contact-form]`-style shortcodes
   that render as literal text outside WordPress. Both the importer and the
   editor's import flag how many posts contain them; grep `data/blog.json` for
   `[` and clean them.
2. **Slug changes.** If a slug differs from the live URL it needs a 301 — add it
   to the redirect map in §8.5.

If the REST API is disabled, use the WXR export (`Tools → Export`) and drop it
into the editor's import instead.

## 9. Launch checklist

**Blocking — do not launch without these**

- [ ] **Redirect map built from a crawl of the live site, all 301s** (§8.5)
- [ ] `npm run import:blog` run, shortcodes cleaned, blog slugs in redirect map (§12)
- [ ] Spanish `/es/` URLs mapped from the old `/es/` slugs — they changed too (§11)
- [ ] `npm run media:vendor` run, images local, CSP tightened (§8.3)
- [ ] Place IDs found, entered in `.env`, and **each `writereview` URL opened in a browser to confirm it hits the right office** (§6.1)
- [ ] `GOOGLE_PLACES_API_KEY` set, restricted to Places API (New), daily quota cap set (§6.7)
- [ ] `npm run fonts:vendor`, `<link>` swapped, CSP tightened (§4)
- [ ] QR generator vendored, `api.qrserver.com` removed from CSP (§6.3)
- [ ] `INTAKE_WEBHOOK_URL` wired and **a test lead confirmed received by intake** (§5.3)
- [ ] Reviews rail shows real Google data, not the testimonial fallback
- [ ] `curl -I https://dcmdlaw.com` shows every header from §8.1
- [ ] Reviews rail shows NO amber "sample data" notice (means the API answered)
- [ ] Real privacy policy migrated and reviewed by counsel
- [ ] `npm run check:links` clean across all 45 pages

**Should do**

- [ ] Lighthouse ≥ 95 on mobile
- [ ] `npm run check:a11y` clean
- [ ] `npm run check:links` clean
- [ ] Tested on a real iPhone and a real Android — the action bar and bottom sheet behave differently in simulators
- [ ] Keyboard-only pass: tab through hero → nav → drawer → review sheet → form
- [ ] Reduced-motion pass (macOS: System Settings → Accessibility → Display → Reduce motion)
- [ ] JS disabled: page still readable, form still posts
- [ ] Scheduled nightly deploy for `npm run reviews:cache`

**Watch after launch**

- [ ] Function logs for the `INTAKE_WEBHOOK_URL not set` warning
- [ ] Places API quota
- [ ] Bounce rate on the hero vs. the old page

---

## 10. Common tasks

**Change the accent colour**
`:root` → `--crimson`. One line, whole site. Don't touch `--star` (§2).

**Add a case result**
Duplicate a `.ledger__row` in the case results section. `.ledger__row--feature`
is the big dark one — one per grid.

**Add a practice area**
Duplicate a `.pcard` in `.pgrid`. Keep `.pcard--all` last.

**Add a fifth office**
1. `.office` card in the offices grid
2. `.offpick__opt` radio in `#reviewSheet`
3. `OFFICES` array in `api/reviews.js`
4. `OFFICES` array in `scripts/fetch-reviews.mjs`
5. `PLACE_ID_*` in `.env` and your host
6. `location` entry in the `LegalService` JSON-LD
7. Footer phone list

**Change the gap bar numbers**
The bars are drawn to *true proportion*. If the numbers change, recompute:
`--w: (smaller / larger * 100)%`. Currently `5000 / 543000 = 0.92%`. Update the
`108×` chip too. **Don't fudge the sliver to make it more visible** — the
accuracy is the entire argument.

**Swap the hero video**
`#heroVideo` → `data-src`. Keep `preload="none"`. Update the `poster` and
`#heroPoster` to a matching frame.

---

## 11. Troubleshooting

**Reviews show testimonials instead of Google reviews**
Expected until §6.1 is done. Otherwise: `curl https://yoursite.com/api/reviews`.
`{"error":"not_configured","missing":[...]}` tells you exactly what's unset.

**`/api/reviews` returns 502**
Upstream failure. Check function logs. Usual causes: key not restricted to
Places API (New); an HTTP-referrer restriction on the key (§6.7); a wrong Place
ID.

**Review button opens Google Maps instead of the review box**
Place IDs still contain `PLACE_ID_` placeholders, so `data-fallback` is being
used. §6.1.

**Fonts flash then swap**
`display=swap`, working as intended. Reduce it by self-hosting and preloading
the above-the-fold face (§4).

**Gap bar doesn't animate**
Reduced motion is on — correct behaviour. Bars render at full width instantly.

**Nav overlaps the logo between 1000–1180px**
Seven nav items is a lot. Either shorten a label or raise the 1180px breakpoint.

**Form submits but nothing arrives**
§5.3 — `INTAKE_WEBHOOK_URL` isn't wired. The function returns 200 regardless,
which is why this is on the blocking checklist.

**Bottom sheet sits behind the action bar on iOS**
`env(safe-area-inset-bottom)` needs `viewport-fit=cover` in the viewport meta.
It's there — check it survived any edit.
