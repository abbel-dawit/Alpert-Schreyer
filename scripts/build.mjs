#!/usr/bin/env node
/**
 * scripts/build.mjs
 * ---------------------------------------------------------------------------
 * Renders the whole site into dist/ from src/content.mjs + src/templates.mjs.
 *
 * Run:  npm run build
 *
 * Every page shares one header, footer, review sheet and form because they all
 * come from one template. Change the nav once, it changes on every page.
 * Never edit dist/ — it is generated and will be overwritten.
 */

import { writeFile, mkdir, copyFile, rm } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  firm, offices, attorneys, caseResults, testimonials, faqs, practiceAreas,
  duiPages, areaPages, servedCities, trustBadges, awards, disclaimer,
  aboutBlurb, areasBlurb, whyHire, sectionImages, freeDownloads, videoCenter,
} from '../src/content.mjs';
import { es } from '../src/content.es.mjs';

import {
  layout, esc, icon, pageHero, ctaBanner, testimonialStage, reviewsSection,
  askBand, officeCards, faqBlock, leadForm, splitFigure, reasonsGrid,
  videoFacade, band, overviewMap,
  ldLegalService, ldFaq, ldBreadcrumbs, ldAttorney,
} from '../src/templates.mjs';
import { esLayout, esLeadForm } from '../src/templates.es.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');


/* Build identity. Stamped into every page as an HTML comment and written to
   /version.txt, so you can tell at a glance whether the thing you're looking at
   in a browser is the build you think it is. Bump BUILD.v on every delivery. */
const BUILD = {
  v: '3.7.0',
  name: 'uniform-table-rules + back-to-top',
  at: new Date().toISOString().replace('T', ' ').slice(0, 16) + ' UTC',
};

/* Two build modes.
 *
 *   npm run build          -> dist/     root-relative paths, external CSS/JS.
 *                                       Correct for a real server. Breaks on
 *                                       file:// because href="/assets/..."
 *                                       resolves to the FILESYSTEM root.
 *
 *   npm run build:preview  -> preview/  self-contained. CSS and JS inlined,
 *                                       every link rewritten relative and
 *                                       pointed at index.html, review seed data
 *                                       inlined (fetch is CORS-blocked on
 *                                       file://). Open preview/index.html
 *                                       straight off disk and click around —
 *                                       no server, no npm install.
 *
 * Ship dist/. Use preview/ to look at it.
 */
/* ONE build, one output: site/
 *
 * Everything is RELATIVE and every directory link is explicit about index.html.
 * That is deliberate, and it is the fix for a real problem: root-relative paths
 * (`/assets/css/site.css`) only work when the server root happens to be the
 * site root. Open the folder in an IDE, preview from a subfolder, double-click
 * the file, or deploy under a sub-path, and every asset and every link 404s —
 * which looks exactly like "missing page parts and buttons that go nowhere".
 *
 * Relative + explicit index.html works in all of them:
 *   - double-clicked from disk (file://)
 *   - any IDE live preview, whatever the project root is
 *   - a static server at the domain root
 *   - a deploy under a sub-path (/staging/, GitHub Pages project sites)
 *
 * Cost: URLs read /about-our-firm/index.html rather than /about-our-firm/.
 * Canonical tags point at the clean URL, so search engines index the clean one.
 * If you want clean URLs in the address bar on production, build with
 * --clean-urls once the host is configured to serve directory indexes.
 */
const CLEAN = process.argv.includes('--clean-urls');
const DIST = resolve(ROOT, 'site');

const pages = [];
const page = (path, html) => pages.push({ path, html });


/* ---------------------------------------------------------------------------
   LANGUAGE MAP
   English path -> Spanish equivalent. Drives three things at once: the
   "Español" link in the header and drawer, the hreflang alternates, and the
   "English" link back from the Spanish side.

   Pages absent from this map (blog, DUI counties, reviews, legal) have no
   Spanish equivalent, so they get no hreflang and their Español link falls back
   to the Spanish home page. That is honest: claiming an alternate that doesn't
   exist is worse than not claiming one, and hreflang pointing at a 404 or an
   unrelated page is a Search Console error.
   --------------------------------------------------------------------------- */
const ES_ALT = {
  '/': '/es/',
  '/about-our-firm/': '/es/sobre-nosotros/',
  '/about-our-firm/case-results/': '/es/resultados-de-casos/',
  '/about-our-firm/our-attorneys/': '/es/nuestros-abogados/',
  '/about-our-firm/testimonials/': '/es/testimonios/',
  '/practice-areas/': '/es/areas-de-practica/',
  '/areas-we-serve/': '/es/areas-de-servicio/',
  '/contact/': '/es/contacto/',
  ...Object.fromEntries(es.practiceAreas.map((p) => [`/practice-areas/${p.enSlug}/`, `/es/areas-de-practica/${p.slug}/`])),
  ...Object.fromEntries(es.areaPages.map((a) => [`/areas-we-serve/${a.enSlug}/`, `/es/areas-de-servicio/${a.slug}/`])),
};
const esAlt = (path) => ES_ALT[path] || null;
const money = (n) => '$' + n.toLocaleString('en-US');

/* ---------- shared partials ---------- */
function ledgerHtml(items) {
  return `<div class="ledger rv">
    ${items.map((c) => `<div class="ledger__row${c.feature ? ' ledger__row--feature' : ''}">
      <div class="ledger__amt">${c.amt}</div>
      <p class="ledger__desc">${c.label ? `<em>${esc(c.label)}</em>` : ''}${c.desc}</p>
    </div>`).join('\n    ')}
  </div>`;
}

function attorneyGrid() {
  return `<div class="attys rv">
    ${attorneys.map((a) => `<a class="atty" href="/about-our-firm/our-attorneys/${a.slug}/">
      <div class="atty__ph"><img src="${a.photo}" alt="${esc(a.alt)}" width="300" height="400" loading="lazy" decoding="async"></div>
      <div class="atty__body"><div class="atty__name">${esc(a.name)}</div><div class="atty__role">${esc(a.role)}</div></div>
    </a>`).join('\n    ')}
  </div>`;
}

function trialsHtml(trials) {
  return `<div class="trials rv">
    ${trials.map((t) => `<div class="trial">
      <p class="trial__what">${esc(t.what)}</p>
      <div class="trial__nums">
        <span class="trial__off">${money(t.offer)}</span>
        <span class="trial__arrow">&rarr;</span>
        <span class="trial__ver">${money(t.verdict)}</span>
        <span class="trial__x">${(t.verdict / t.offer).toFixed(1)}&times;</span>
      </div>
    </div>`).join('\n    ')}
  </div>`;
}

function gapSection() {
  return `<section class="section gap" aria-labelledby="gap-h">
  <div class="wrap gap__grid">
    <div class="rv">
      <p class="eyebrow">Proven experience</p>
      <h2 id="gap-h">What the insurer offered.<br>What the jury <em>awarded.</em></h2>
      <p class="gap__note">A jury awarded <strong style="color:#fff">$543,000</strong> in Prince George's County after the defense only offered <strong style="color:#fff">$5,000</strong> for our client's injuries. The bars below are drawn to scale.</p>
      <p style="margin-top:2rem"><a class="btn btn--ghost" href="/about-our-firm/case-results/">View all case results</a></p>
    </div>
    <div class="gapbar rv" id="gapbar">
      <div class="gapbar__row gapbar__row--them">
        <div class="gapbar__meta"><span class="gapbar__who">Defense offer</span><span class="gapbar__amt">$5,000</span></div>
        <div class="gapbar__track"><div class="gapbar__fill" style="--w:0.92%"></div></div>
      </div>
      <div class="gapbar__row gapbar__row--us">
        <div class="gapbar__meta"><span class="gapbar__who">Jury award</span><span class="gapbar__amt">$543,000</span></div>
        <div class="gapbar__track"><div class="gapbar__fill" style="--w:100%"></div></div>
      </div>
      <span class="gapbar__x"><b>108&times;</b> the offer</span>
    </div>
  </div>
</section>`;
}

const trustStrip = () => `<div class="trust"><div class="wrap trust__in">
  ${trustBadges.map((b) => `<img src="${b.src}" alt="${esc(b.alt)}" width="160" height="62" loading="lazy" decoding="async">`).join('\n  ')}
</div></div>`;

/* =========================================================================
   HOME
   ========================================================================= */
page('/', layout({
  title: 'Maryland Personal Injury Lawyers at Alpert Schreyer',
  desc: "Personal injury attorneys serving Prince George's County, Charles County, Anne Arundel County, St. Mary's County, & surrounding areas.",
  path: '/',
  alt: '/es/',
  ld: [ldLegalService(), ldFaq(faqs)],
  body: `
<section class="hero">
  <div class="hero__media">
    <img id="heroPoster" src="${firm.images.team1}" alt="" width="1600" height="900" fetchpriority="high" decoding="async">
    <video id="heroVideo" muted loop playsinline preload="none" aria-hidden="true" tabindex="-1"
           poster="${firm.images.team1}" data-src="${firm.heroVideo}"></video>
  </div>
  <div class="hero__veil" aria-hidden="true"></div>
  <div class="wrap hero__in">
    <div class="hero__grid">
      <div>
        <p class="eyebrow">Maryland &middot; Personal Injury &amp; DUI</p>
        <h1>Maryland Personal&nbsp;Injury <em>Lawyers</em></h1>
        <p class="hero__sub">${esc(firm.tagline)}</p>
        <div class="btn-row">
          <a class="btn btn--primary" href="/contact/">Free case review</a>
          <a class="btn btn--call" href="${firm.mainPhoneHref}">${icon.phone} ${firm.mainPhone}</a>
        </div>
        <div class="ledger-strip">
          <div class="ledger-strip__item"><div class="ledger-strip__n">$100M+</div><div class="ledger-strip__l">Recovered for clients</div></div>
          <div class="ledger-strip__rule" aria-hidden="true"></div>
          <div class="ledger-strip__item"><div class="ledger-strip__n">125+</div><div class="ledger-strip__l">Years combined</div></div>
          <div class="ledger-strip__rule" aria-hidden="true"></div>
          <div class="ledger-strip__item"><div class="ledger-strip__n">4</div><div class="ledger-strip__l">Maryland offices</div></div>
          <div class="ledger-strip__rule" aria-hidden="true"></div>
          <a class="grating" href="${firm.reviewsLink}" target="_blank" rel="noopener">
            <svg class="grating__g" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3A12 12 0 1 1 24 12a11.9 11.9 0 0 1 7.9 3l5.7-5.7A20 20 0 1 0 24 44a20 20 0 0 0 19.6-23.9Z"/><path fill="#FF3D00" d="m6.3 14.7 6.6 4.8A11.9 11.9 0 0 1 24 12a11.9 11.9 0 0 1 7.9 3l5.7-5.7A20 20 0 0 0 6.3 14.7Z"/><path fill="#4CAF50" d="M24 44a20 20 0 0 0 13.5-5.2l-6.2-5.3A11.9 11.9 0 0 1 12.7 28l-6.6 5A20 20 0 0 0 24 44Z"/><path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3a12 12 0 0 1-4.1 5.5l6.2 5.3A19.9 19.9 0 0 0 43.6 20.1Z"/></svg>
            <span class="stars" aria-hidden="true" data-stars="5"></span>
            <span class="grating__score" data-g-rating>&mdash;</span>
            <span class="grating__count"><span data-g-count>&mdash;</span> Google reviews</span>
          </a>
        </div>
      </div>
      ${leadForm()}
    </div>
  </div>
</section>

${gapSection()}
${trustStrip()}

<section class="section" aria-labelledby="intro-h">
  <div class="wrap split">
    <div>
      <p class="eyebrow rv">Top-rated personal injury lawyers in Maryland</p>
      <h2 class="h-section rv" id="intro-h" style="max-width:20ch;margin-bottom:2rem">When you're injured, you need strong representation.</h2>
      <div class="prose rv">
        <p>When you're injured due to someone else's negligence in Maryland, you need strong legal representation on your side. <a href="/about-our-firm/">Alpert Schreyer Personal Injury Lawyers</a> has over 125 years of combined experience fighting for the rights of Marylanders. Contact our Maryland personal injury lawyers at <a href="${firm.mainPhoneHref}">${firm.mainPhone}</a> for a free consultation.</p>
        <p>Our firm has a proven track record of success, recovering over $100 million for our clients in a wide range of personal injury cases. Our practice areas include everything from <a href="/practice-areas/car-accidents/">car accidents</a> and <a href="/practice-areas/truck-accidents/">truck accidents</a> to <a href="/practice-areas/slip-and-fall/">slips and falls</a> and wrongful death. No matter how complex your situation may seem, we have the skills and expertise to build a strong case on your behalf.</p>
        <p>If you've been injured in Maryland, don't wait to seek legal help. <a href="/contact/">Contact us today for a free consultation</a>. We're ready to stand up for you.</p>
      </div>
    </div>
    ${splitFigure(sectionImages.intro, { n: '$100M+', l: 'Recovered for our clients' })}
  </div>
</section>

<section class="section section--tight" aria-labelledby="results-h" style="background:var(--paper-2);border-block:1px solid var(--rule)">
  <div class="wrap">
    <p class="eyebrow rv">Case results</p>
    <h2 class="h-section rv" id="results-h" style="margin-bottom:2rem">Proven experience</h2>
    ${ledgerHtml(caseResults)}
    <p class="rv" style="margin-top:1.5rem"><a class="btn btn--ghost" href="/about-our-firm/case-results/">View all case results</a></p>
    <p class="rv" style="margin-top:1.25rem;font-size:var(--t-xs);color:var(--ink-400);max-width:70ch">Prior results do not guarantee a similar outcome. Every case is different and depends on its own facts.</p>
  </div>
</section>

${reviewsSection()}
${askBand()}

<section class="section" aria-labelledby="why-h">
  <div class="wrap">
    <div class="split" style="margin-bottom:clamp(2.5rem,5vw,4rem)">
      <div>
        <p class="eyebrow rv">Why Alpert Schreyer</p>
        <h2 class="h-section rv" id="why-h" style="max-width:26ch;margin-bottom:1.5rem">Why choose Alpert Schreyer to handle my personal injury case in Maryland?</h2>
        <div class="prose rv">
          <p>At Alpert Schreyer Personal Injury Lawyers, we have decades of experience helping clients in Maryland recover compensation for their injuries. Our firm's reputation for success and professionalism sets us apart from others.</p>
          <p>Our attorneys are not only experienced but also highly respected in the legal community. We are committed to fighting for the rights of injury victims and holding negligent parties accountable for their actions.</p>
          <p>Whether you were injured in a car crash, <a href="/practice-areas/workers-compensation/">hurt on the job</a>, or suffered a <a href="/practice-areas/slip-and-fall/">slip and fall</a>, we're here to help you seek the compensation you deserve. We take pride in providing personalized attention to each client and ensuring that their legal rights are fully protected.</p>
        </div>
      </div>
      ${splitFigure(sectionImages.why, { n: '125+', l: 'Years of combined experience' })}
    </div>
    <p class="eyebrow rv" style="margin-bottom:.35rem">Representation. Results. Recovery.</p>
    <h3 class="h-card rv" style="margin-bottom:1.5rem;max-width:34ch">Six reasons injured Marylanders choose us.</h3>
    ${reasonsGrid(whyHire, true)}
  </div>
</section>

<section class="section" id="practice" aria-labelledby="pa-h" style="background:var(--paper-2);border-block:1px solid var(--rule)">
  <div class="wrap">
    <p class="eyebrow rv">Practice areas</p>
    <h2 class="h-section rv" id="pa-h" style="margin-bottom:2rem">Our Maryland practice areas</h2>
    <div class="pgrid rv">
      ${practiceAreas.filter((p) => p.featured).map((p) => `<a class="pcard" href="/practice-areas/${p.slug}/">
        <img class="pcard__ico" src="${p.icon}" alt="" width="38" height="38" loading="lazy" decoding="async">
        <h3>${esc(p.name)}</h3>
        <p>${esc(p.blurb)}</p>
        <span class="pcard__go">More info ${icon.arrow}</span>
      </a>`).join('\n      ')}
      <a class="pcard pcard--all" href="/practice-areas/">
        <svg class="pcard__ico" width="38" height="38" viewBox="0 0 38 38" fill="none" aria-hidden="true"><rect x="3" y="3" width="13" height="13" rx="2" stroke="currentColor" stroke-width="2"/><rect x="22" y="3" width="13" height="13" rx="2" stroke="currentColor" stroke-width="2"/><rect x="3" y="22" width="13" height="13" rx="2" stroke="currentColor" stroke-width="2"/><path d="M28.5 22.5v10M23.5 27.5h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        <h3>View More</h3>
        <p>Premises liability, construction accidents, rideshare, hit &amp; run and more &mdash; see everything we handle across Maryland.</p>
        <span class="pcard__go">All practice areas ${icon.arrow}</span>
      </a>
    </div>
  </div>
</section>

<section class="section" id="attorneys" aria-labelledby="at-h">
  <div class="wrap">
    <p class="eyebrow rv">Our attorneys</p>
    <h2 class="h-section rv" id="at-h" style="max-width:24ch">Our clients select our attorneys over all other firms.</h2>
    <p class="lede rv" style="margin:1rem 0 2rem">Because we have proven outstanding client relations and successful results.</p>
    ${attorneyGrid()}
    <p class="rv" style="margin-top:1.75rem"><a class="btn btn--ghost" href="/about-our-firm/our-attorneys/">Meet the full team</a></p>
  </div>
</section>

${testimonialStage(testimonials)}

<section class="section" id="faq" aria-labelledby="faq-h">
  <div class="wrap wrap-narrow" style="margin-inline:auto">
    <p class="eyebrow rv">Personal injury FAQ</p>
    <h2 class="h-section rv" id="faq-h" style="margin-bottom:2rem">Questions people ask us first</h2>
    ${faqBlock(faqs)}
  </div>
</section>

${ctaBanner()}

<section class="section" id="contact" aria-labelledby="ct-h">
  <div class="wrap">
    <p class="eyebrow rv">Contact</p>
    <h2 class="h-section rv" id="ct-h" style="max-width:24ch;margin-bottom:1.5rem">Contact our Maryland injury lawyers for a free consultation</h2>
    <div class="prose rv" style="margin-bottom:2.5rem">
      <p>If you've been injured in an accident, don't wait to get the help you need. Contact Alpert Schreyer Personal Injury Lawyers for a free consultation. Our team is here to listen to your story, evaluate your case, and help you take the next steps in seeking compensation. With over 125 years of combined experience, we have the knowledge and skill to fight for the justice you deserve.</p>
      <p><a href="/contact/">Contact our office</a> today at <a href="${firm.mainPhoneHref}">${firm.mainPhone}</a> to schedule your free consultation!</p>
    </div>
    <p class="eyebrow rv">Our offices</p>
    <h3 class="h-card rv" style="margin-bottom:1.5rem">Four locations across Maryland</h3>
    ${officeCards()}
  </div>
</section>`,
}));

/* =========================================================================
   ABOUT
   ========================================================================= */
page('/about-our-firm/', layout({
  title: 'About Our Firm | Alpert Schreyer Personal Injury Lawyers',
  desc: aboutBlurb.slice(0, 155),
  path: '/about-our-firm/',
  alt: esAlt('/about-our-firm/'),
  ld: [ldLegalService(), ldBreadcrumbs([{ t: 'About Our Firm' }])],
  body: `
${pageHero({ h1: 'About our firm', sub: '125+ years of combined experience fighting for injured Marylanders.', crumbs: [{ t: 'About Our Firm' }], img: firm.images.aboutHero })}
<section class="section">
  <div class="wrap">
    <div class="prose rv" style="font-size:var(--t-lg)">
      <p>${esc(aboutBlurb)}</p>
      <p>Our firm has a proven track record of success, recovering over $100 million for our clients in a wide range of personal injury cases. Our practice areas include everything from <a href="/practice-areas/car-accidents/">car accidents</a> and <a href="/practice-areas/truck-accidents/">truck accidents</a> to <a href="/practice-areas/slip-and-fall/">slips and falls</a> and wrongful death.</p>
      <p>Our attorneys are not only experienced but also highly respected in the legal community. We are committed to fighting for the rights of injury victims and holding negligent parties accountable for their actions.</p>
    </div>
  </div>
</section>
${trustStrip()}
<section class="section section--tight" style="background:var(--paper-2);border-block:1px solid var(--rule)">
  <div class="wrap">
    <p class="eyebrow rv">The record</p>
    <h2 class="h-section rv" style="margin-bottom:2rem">Case results</h2>
    ${ledgerHtml(caseResults.slice(0, 4))}
    <p class="rv" style="margin-top:1.5rem"><a class="btn btn--ghost" href="/about-our-firm/case-results/">View all case results</a></p>
  </div>
</section>
<section class="section">
  <div class="wrap">
    <p class="eyebrow rv">Our attorneys</p>
    <h2 class="h-section rv" style="margin-bottom:2rem">The people who would handle your case</h2>
    ${attorneyGrid()}
  </div>
</section>
${testimonialStage(testimonials)}
${ctaBanner()}`,
}));

page('/about-our-firm/case-results/', layout({
  title: 'Case Results | Alpert Schreyer Personal Injury Lawyers',
  desc: 'Verdicts and settlements recovered by Alpert Schreyer Personal Injury Lawyers across Maryland — over $100 million for our clients.',
  path: '/about-our-firm/case-results/',
  alt: esAlt('/about-our-firm/case-results/'),
  ld: [ldBreadcrumbs([{ t: 'About Our Firm', h: '/about-our-firm/' }, { t: 'Case Results' }])],
  body: `
${pageHero({ h1: 'Case results', sub: 'Over $100 million recovered for our clients.', crumbs: [{ t: 'About Our Firm', h: '/about-our-firm/' }, { t: 'Case Results' }] })}
${gapSection()}
<section class="section">
  <div class="wrap">
    <p class="eyebrow rv">Verdicts &amp; settlements</p>
    <h2 class="h-section rv" style="margin-bottom:2rem">Proven experience</h2>
    ${ledgerHtml(caseResults)}
    <p class="rv" style="margin-top:1.5rem;font-size:var(--t-xs);color:var(--ink-400);max-width:70ch">Prior results do not guarantee a similar outcome. Every case is different and depends on its own facts.</p>
  </div>
</section>
<section class="section" style="background:var(--paper-2);border-block:1px solid var(--rule)">
  <div class="wrap">
    <p class="eyebrow rv">Trial record</p>
    <h2 class="h-section rv" style="margin-bottom:.75rem">Offers refused, verdicts won</h2>
    <p class="lede rv" style="margin-bottom:2rem">A selection of ${esc(attorneys[1].name)}'s trial results &mdash; what the insurance company offered, and what the jury returned.</p>
    ${trialsHtml(attorneys[1].trials)}
    <p class="rv" style="margin-top:1.25rem;font-size:var(--t-xs);color:var(--ink-400)">Prior results do not guarantee a similar outcome.</p>
  </div>
</section>
${ctaBanner()}`,
}));

page('/about-our-firm/awards-recognition/', layout({
  title: 'Awards & Recognition | Alpert Schreyer Personal Injury Lawyers',
  desc: 'Awards, honors and peer recognition earned by the attorneys of Alpert Schreyer Personal Injury Lawyers in Maryland.',
  path: '/about-our-firm/awards-recognition/',
  ld: [ldBreadcrumbs([{ t: 'About Our Firm', h: '/about-our-firm/' }, { t: 'Awards & Recognition' }])],
  body: `
${pageHero({ h1: 'Awards &amp; recognition', sub: 'Peer-rated, board certified, and recognised across two decades.', crumbs: [{ t: 'About Our Firm', h: '/about-our-firm/' }, { t: 'Awards & Recognition' }] })}
<section class="section">
  <div class="wrap">
    <div class="awards rv">
      ${awards.map((a) => `<div class="award">
        ${a.yr ? `<div class="award__yr">${esc(a.yr)}</div>` : ''}
        <h3>${esc(a.h)}</h3>
        <p>${esc(a.p)}</p>
      </div>`).join('\n      ')}
    </div>
  </div>
</section>
${trustStrip()}
${ctaBanner()}`,
}));

page('/about-our-firm/testimonials/', layout({
  title: 'Client Testimonials | Alpert Schreyer Personal Injury Lawyers',
  desc: 'Read what clients say about working with Alpert Schreyer Personal Injury Lawyers in Maryland.',
  path: '/about-our-firm/testimonials/',
  alt: esAlt('/about-our-firm/testimonials/'),
  ld: [ldBreadcrumbs([{ t: 'About Our Firm', h: '/about-our-firm/' }, { t: 'Testimonials' }])],
  body: `
${pageHero({ h1: 'Client testimonials', sub: 'In their words.', crumbs: [{ t: 'About Our Firm', h: '/about-our-firm/' }, { t: 'Testimonials' }], img: firm.images.duiTeam })}
${testimonialStage(testimonials)}
${reviewsSection()}
${askBand()}
${ctaBanner()}`,
}));

page('/about-our-firm/our-attorneys/', layout({
  title: 'Alpert Schreyer Personal Injury & DUI Lawyers in Maryland',
  desc: 'Meet the experienced personal injury and DUI defense attorneys at Alpert Schreyer Personal Injury Lawyers in Maryland. Contact us today!',
  path: '/about-our-firm/our-attorneys/',
  alt: esAlt('/about-our-firm/our-attorneys/'),
  ld: [ldBreadcrumbs([{ t: 'About Our Firm', h: '/about-our-firm/' }, { t: 'Our Attorneys' }])],
  body: `
${pageHero({ h1: 'Our attorneys', sub: 'Our clients select our attorneys over all other firms because we have proven outstanding client relations and successful results.', crumbs: [{ t: 'About Our Firm', h: '/about-our-firm/' }, { t: 'Our Attorneys' }] })}
<section class="section">
  <div class="wrap">${attorneyGrid()}</div>
</section>
${testimonialStage(testimonials)}
${ctaBanner()}`,
}));

for (const a of attorneys) {
  page(`/about-our-firm/our-attorneys/${a.slug}/`, layout({
    title: a.title,
    desc: a.metaDesc,
    path: `/about-our-firm/our-attorneys/${a.slug}/`,
    ld: [ldAttorney(a), ldBreadcrumbs([{ t: 'About Our Firm', h: '/about-our-firm/' }, { t: 'Our Attorneys', h: '/about-our-firm/our-attorneys/' }, { t: a.name }])],
    body: `
${pageHero({ h1: esc(a.name), sub: a.motto, crumbs: [{ t: 'About Our Firm', h: '/about-our-firm/' }, { t: 'Our Attorneys', h: '/about-our-firm/our-attorneys/' }, { t: a.name }] })}
<section class="section">
  <div class="wrap bio">
    <aside class="bio__side rv">
      <div class="bio__ph"><img src="${a.photo}" alt="${esc(a.alt)}" width="640" height="853" fetchpriority="high"></div>
      <dl class="bio__facts">
        <div class="bio__fact"><dt>Role</dt><dd>${esc(a.role)}</dd></div>
        ${a.facts.map((f) => `<div class="bio__fact"><dt>${esc(f.k)}</dt><dd>${esc(f.v)}</dd></div>`).join('\n        ')}
      </dl>
      <a class="btn btn--call btn--block" href="${firm.mainPhoneHref}">${icon.phone} ${firm.mainPhone}</a>
      <a class="btn btn--primary btn--block" href="/contact/">Free case review</a>
    </aside>
    <div class="bio__body rv">
      <p class="bio__lede">${esc(a.lede)}</p>
      <div class="prose" style="max-width:68ch">
        ${a.bio.map((p) => `<p>${p}</p>`).join('\n        ')}
      </div>
      ${a.trials ? `<div>
        <p class="eyebrow" style="margin-top:1rem">Trial results</p>
        <h2 class="h-card" style="margin-bottom:1rem">What the insurer offered, and what the jury returned</h2>
        ${trialsHtml(a.trials)}
        <p style="margin-top:1rem;font-size:var(--t-xs);color:var(--ink-400)">Prior results do not guarantee a similar outcome.</p>
      </div>` : ''}
      ${a.creds.length ? `<div class="credlist">
        ${a.creds.map((c) => `<div class="credgroup${c.long ? ' credgroup--long' : ''}">
          <h3>${esc(c.h)}</h3>
          <ul>${c.items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>
        </div>`).join('\n        ')}
      </div>` : ''}
    </div>
  </div>
</section>
${ctaBanner()}`,
  }));
}

/* =========================================================================
   PRACTICE AREAS
   ========================================================================= */
page('/practice-areas/', layout({
  title: 'Maryland Personal Injury Practice Areas | Alpert Schreyer',
  desc: "Alpert Schreyer's personal injury attorneys in Maryland are dedicated to helping clients get the compensation they deserve.",
  path: '/practice-areas/',
  alt: esAlt('/practice-areas/'),
  ld: [ldBreadcrumbs([{ t: 'Practice Areas' }])],
  body: `
${pageHero({ h1: 'Practice areas', sub: 'Cases we cover across Maryland.', crumbs: [{ t: 'Practice Areas' }] })}
<section class="section">
  <div class="wrap">
    <p class="eyebrow rv">Cases we cover</p>
    <h2 class="h-section rv" style="margin-bottom:2rem">Everything we handle</h2>
    <div class="pgrid rv">
      ${practiceAreas.map((p) => `<a class="pcard" href="/practice-areas/${p.slug}/">
        ${p.icon ? `<img class="pcard__ico" src="${p.icon}" alt="" width="38" height="38" loading="lazy" decoding="async">` : ''}
        <h3>${esc(p.name)}</h3>
        <p>${esc(p.blurb)}</p>
        <span class="pcard__go">More info ${icon.arrow}</span>
      </a>`).join('\n      ')}
    </div>
  </div>
</section>
<section class="section section--tight" style="background:var(--paper-2);border-block:1px solid var(--rule)">
  <div class="wrap">
    <p class="eyebrow rv">Also handled</p>
    <h2 class="h-card rv" style="margin-bottom:1.5rem">DUI defense across Maryland</h2>
    <div class="linkgrid rv">
      ${duiPages.map((d) => `<a href="/dui/${d.slug}/">${esc(d.name)} ${icon.arrow}</a>`).join('\n      ')}
    </div>
  </div>
</section>
${reviewsSection()}
${askBand()}
${ctaBanner()}`,
}));

for (const p of practiceAreas) {
  const related = practiceAreas.filter((x) => x.slug !== p.slug).slice(0, 6);
  page(`/practice-areas/${p.slug}/`, layout({
    title: `${p.title} | Alpert Schreyer`,
    desc: p.metaDesc,
    path: `/practice-areas/${p.slug}/`,
    alt: esAlt(`/practice-areas/${p.slug}/`),
    ld: [ldBreadcrumbs([{ t: 'Practice Areas', h: '/practice-areas/' }, { t: p.name }]), ldFaq(faqs.slice(0, 3))],
    body: `
${pageHero({ h1: esc(p.title), sub: 'Free consultation, 24/7.', crumbs: [{ t: 'Practice Areas', h: '/practice-areas/' }, { t: p.name }] })}
<section class="section">
  <div class="wrap" style="display:grid;gap:2.5rem">
    <div class="prose rv" style="font-size:var(--t-lg)">
      ${p.body.map((b) => `<p>${esc(b)}</p>`).join('\n      ')}
    </div>
    ${p.checklist ? `<div class="rv">
      <p class="eyebrow">What helps your case</p>
      <h2 class="h-card" style="margin-bottom:1rem">Practical steps</h2>
      <div class="faq__a" style="padding:0">
        <ul>${p.checklist.map((c) => `<li>${esc(c)}</li>`).join('')}</ul>
      </div>
    </div>` : ''}
    <div class="rv">
      <p class="eyebrow">Common questions</p>
      <h2 class="h-card" style="margin-bottom:1rem">What people ask us</h2>
      ${faqBlock(faqs.slice(0, 3))}
    </div>
  </div>
</section>
<section class="section section--tight" style="background:var(--paper-2);border-block:1px solid var(--rule)">
  <div class="wrap">
    <p class="eyebrow rv">Related</p>
    <h2 class="h-card rv" style="margin-bottom:1.5rem">Other cases we handle</h2>
    <div class="linkgrid rv">
      ${related.map((r) => `<a href="/practice-areas/${r.slug}/">${esc(r.name)} ${icon.arrow}</a>`).join('\n      ')}
    </div>
  </div>
</section>
${testimonialStage(testimonials)}
${ctaBanner()}`,
  }));
}

/* =========================================================================
   DUI
   ========================================================================= */
for (const d of duiPages) {
  page(`/dui/${d.slug}/`, layout({
    title: `${d.name} | Alpert Schreyer`,
    desc: `Charged with DUI in ${d.county}, Maryland? Andrew D. Alpert is Maryland's first Board Certified DUI Defense Lawyer. Free consultation.`,
    path: `/dui/${d.slug}/`,
    ld: [ldBreadcrumbs([{ t: 'Practice Areas', h: '/practice-areas/' }, { t: d.name }])],
    body: `
${pageHero({ h1: esc(d.name), sub: `Board certified DUI defense in ${d.county}.`, crumbs: [{ t: 'Practice Areas', h: '/practice-areas/' }, { t: d.name }], img: firm.images.duiTeam })}
<section class="section">
  <div class="wrap">
    <div class="prose rv" style="font-size:var(--t-lg)">
      <p>A DUI charge in ${esc(d.county)} carries consequences that reach well past the courtroom &mdash; your licence, your insurance, your job, and in some cases your record for good.</p>
      <p><a href="/about-our-firm/our-attorneys/andrew-d-alpert/">Andrew D. Alpert</a> is Maryland's first and only attorney to become <strong>Board Certified in DUI Defense Law</strong> by the National College for DUI Defense. He is a former prosecutor, a Certified NHTSA Standardized Field Sobriety Test Instructor, and has defended thousands of DUI/DWI cases.</p>
      <p>Two clocks start the moment you're charged: the criminal case, and a separate MVA administrative process that can suspend your licence before you ever see a judge. Both matter, and the MVA deadline is short. Call <a href="${firm.mainPhoneHref}">${firm.mainPhone}</a> &mdash; the consultation is free.</p>
    </div>
    <div class="rv" style="margin-top:2.5rem;max-width:820px">
      <p class="eyebrow">Why it matters who defends you</p>
      <div class="faq__a" style="padding:0">
        <ul>
          <li>Field sobriety testing follows a federal protocol &mdash; administered wrong, the results are challengeable</li>
          <li>Breath testing instruments require calibration records and certified operators</li>
          <li>The traffic stop itself must have been lawful in the first place</li>
          <li>The MVA hearing runs on its own short deadline, separate from the criminal case</li>
        </ul>
      </div>
    </div>
  </div>
</section>
<section class="section section--tight" style="background:var(--paper-2);border-block:1px solid var(--rule)">
  <div class="wrap">
    <p class="eyebrow rv">Your defense</p>
    <h2 class="h-card rv" style="margin-bottom:1.5rem">The attorneys who would handle your case</h2>
    ${attorneyGrid()}
  </div>
</section>
<section class="section section--tight">
  <div class="wrap">
    <p class="eyebrow rv">DUI defense elsewhere in Maryland</p>
    <div class="linkgrid rv" style="margin-top:1rem">
      ${duiPages.filter((x) => x.slug !== d.slug).map((x) => `<a href="/dui/${x.slug}/">${esc(x.name)} ${icon.arrow}</a>`).join('\n      ')}
    </div>
  </div>
</section>
${ctaBanner()}`,
  }));
}

/* =========================================================================
   AREAS SERVED
   ========================================================================= */
page('/areas-we-serve/', layout({
  title: 'Areas We Serve | Alpert Schreyer Personal Injury Lawyers',
  desc: areasBlurb.slice(0, 155),
  path: '/areas-we-serve/',
  alt: esAlt('/areas-we-serve/'),
  ld: [ldLegalService(), ldBreadcrumbs([{ t: 'Areas We Serve' }])],
  body: `
${pageHero({ h1: 'Areas we serve', sub: 'Four offices. All of Maryland.', crumbs: [{ t: 'Areas We Serve' }] })}
<section class="section">
  <div class="wrap">
    <div class="prose rv" style="margin-bottom:2.5rem"><p>${esc(areasBlurb)}</p></div>
    <p class="eyebrow rv">Our offices</p>
    <h2 class="h-section rv" style="margin-bottom:1.5rem">Where to find us</h2>
    ${officeCards()}
  </div>
</section>
<section class="section section--tight" style="background:var(--paper-2);border-block:1px solid var(--rule)">
  <div class="wrap">
    <p class="eyebrow rv">By location</p>
    <h2 class="h-card rv" style="margin-bottom:1.5rem">Personal injury representation near you</h2>
    <div class="linkgrid rv">
      ${areaPages.map((a) => `<a href="/areas-we-serve/${a.slug}/">${esc(a.name)} ${icon.arrow}</a>`).join('\n      ')}
    </div>
  </div>
</section>
<section class="section section--tight">
  <div class="wrap">
    <p class="eyebrow rv">We also serve</p>
    <div class="linkgrid rv" style="margin-top:1rem">
      ${servedCities.map((c) => `<a href="/contact/">${esc(c)}, MD ${icon.arrow}</a>`).join('\n      ')}
    </div>
  </div>
</section>
${ctaBanner()}`,
}));

for (const a of areaPages) {
  const o = offices.find((x) => x.key === a.office) || offices[0];
  page(`/areas-we-serve/${a.slug}/`, layout({
    title: `${a.name} Personal Injury Lawyer | Alpert Schreyer`,
    desc: `Personal injury lawyers serving ${a.name}, Maryland. Free consultation. Call ${firm.mainPhone}.`,
    path: `/areas-we-serve/${a.slug}/`,
    alt: esAlt(`/areas-we-serve/${a.slug}/`),
    ld: [ldBreadcrumbs([{ t: 'Areas We Serve', h: '/areas-we-serve/' }, { t: a.name }])],
    body: `
${pageHero({ h1: `${esc(a.name)} personal injury lawyer`, sub: `Serving ${esc(a.name)} from our ${esc(o.city)} office.`, crumbs: [{ t: 'Areas We Serve', h: '/areas-we-serve/' }, { t: a.name }] })}
<section class="section">
  <div class="wrap">
    <div class="prose rv" style="font-size:var(--t-lg)">
      <p>If you've been injured in ${esc(a.name)}, Alpert Schreyer Personal Injury Lawyers is close by. Our ${esc(o.city)} office is at <a href="${o.maps}" target="_blank" rel="noopener">${esc(o.addr)}</a>, and you can reach it at <a href="${o.phoneHref}">${o.phone}</a>.</p>
      <p>We have over 125 years of combined experience and have recovered more than $100 million for our clients. The consultation is free.</p>
      <p>One thing worth knowing before you speak to any insurer: Maryland's contributory negligence rule is unforgiving. If the insurance company can pin even 1% of the blame on you, your claim can be barred entirely. That makes early advice unusually valuable here compared with most states.</p>
    </div>
  </div>
</section>
<section class="section section--tight" style="background:var(--paper-2);border-block:1px solid var(--rule)">
  <div class="wrap">
    <p class="eyebrow rv">Nearest office</p>
    <h2 class="h-card rv" style="margin-bottom:1.5rem">${esc(o.name)}</h2>
    <div class="offices rv" style="max-width:420px">
      <div class="office">
        <div class="office__map">
          <button class="mapfacade" data-map="${o.embed}" data-map-title="Map of the ${esc(o.city)} office"><span>${icon.pin} Load map</span></button>
        </div>
        <div class="office__body">
          <div class="office__name">${esc(o.name)}</div>
          <a class="office__addr" href="${o.maps}" target="_blank" rel="noopener">${esc(o.addr)}</a>
          <div class="office__links"><a href="${o.phoneHref}">${o.phone}</a><a href="${o.maps}" target="_blank" rel="noopener">Directions</a></div>
        </div>
      </div>
    </div>
  </div>
</section>
<section class="section section--tight">
  <div class="wrap">
    <p class="eyebrow rv">Cases we handle in ${esc(a.name)}</p>
    <div class="linkgrid rv" style="margin-top:1rem">
      ${practiceAreas.slice(0, 9).map((p) => `<a href="/practice-areas/${p.slug}/">${esc(p.name)} ${icon.arrow}</a>`).join('\n      ')}
    </div>
  </div>
</section>
${ctaBanner()}`,
  }));
}

/* =========================================================================
   CONTACT
   ========================================================================= */
page('/contact/', layout({
  title: 'Contact Us | Alpert Schreyer Personal Injury Lawyers',
  desc: `Contact Alpert Schreyer Personal Injury Lawyers for a free consultation. Four Maryland offices. Call ${firm.mainPhone} — we answer 24/7.`,
  path: '/contact/',
  alt: esAlt('/contact/'),
  ld: [ldLegalService(), ldBreadcrumbs([{ t: 'Contact' }])],
  body: `
${pageHero({ h1: 'Contact us', sub: "Free consultation. We're here 24/7.", crumbs: [{ t: 'Contact' }] })}
<section class="section">
  <div class="wrap">
    <div class="contact-grid">
      <div class="contact-grid__intro rv">
        <p class="eyebrow">Free consultation</p>
        <h2 class="h-section" style="margin-bottom:1.25rem">Tell us what happened</h2>
        <div class="prose">
          <p>If you've been injured in an accident, don't wait to get the help you need. Our team is here to listen to your story, evaluate your case, and help you take the next steps in seeking the compensation you're owed.</p>
          <p>With over 125 years of combined experience and more than $100 million recovered for Marylanders, we have the knowledge and the resources to take on any insurer &mdash; and the consultation is always free.</p>
          <p>Call <a href="${firm.mainPhoneHref}">${firm.mainPhone}</a> to speak with someone now, or fill out the form and we'll reach out the same business day. If your injuries make it hard to come to us, we'll come to you.</p>
        </div>
        <div class="contact-grid__quick">
          <a class="btn btn--call" href="${firm.mainPhoneHref}">${icon.phone} ${firm.mainPhone}</a>
          <a class="btn btn--ghost" href="${firm.smsHref}">Text us</a>
        </div>
      </div>
      <div class="contact-grid__form rv">
        ${leadForm('leadForm', 'Get a free consultation', "Free consultation. We reply the same business day.")}
      </div>
    </div>
  </div>
</section>
<section class="section" style="background:var(--paper-2);border-block:1px solid var(--rule)">
  <div class="wrap">
    <p class="eyebrow rv">Our offices</p>
    <h2 class="h-section rv" style="margin-bottom:1.5rem">Four locations across Maryland</h2>
    ${officeCards()}
    <div style="margin-top:clamp(2rem,4vw,3rem)">
      <p class="eyebrow rv" style="margin-bottom:1rem">Find us on the map</p>
      ${overviewMap()}
    </div>
  </div>
</section>
${ctaBanner()}`,
}));

/* =========================================================================
   REVIEWS — dedicated page
   ========================================================================= */
page('/reviews/', layout({
  title: 'Client Reviews | Alpert Schreyer Personal Injury Lawyers',
  desc: 'Read Google reviews for Alpert Schreyer Personal Injury Lawyers, and leave one of your own in about 30 seconds.',
  path: '/reviews/',
  ld: [ldBreadcrumbs([{ t: 'Reviews' }])],
  body: `
${pageHero({ h1: 'Client reviews', sub: 'What people say after their case is over.', crumbs: [{ t: 'Reviews' }], img: firm.images.duiTeam })}
${reviewsSection()}
${askBand()}
<section class="section">
  <div class="wrap wrap-narrow" style="margin-inline:auto">
    <p class="eyebrow rv">Leaving a review</p>
    <h2 class="h-section rv" style="margin-bottom:1.5rem">How it works</h2>
    <div class="prose rv">
      <p>Each of our four offices has its own Google listing, which means there are four different review boxes. Rather than make you hunt for the right one, tap <strong>Write a Google review</strong>, pick the office that handled your case, and we'll take you straight there.</p>
      <p>It takes about thirty seconds. You'll need to be signed in to a Google account &mdash; if you have Gmail or an Android phone, you already have one. Two sentences is plenty.</p>
      <p>A note on what we will and won't do: we can't write a review for you, and we wouldn't want to. The specific details &mdash; who you worked with, what you were dealing with, whether we kept you informed &mdash; are the only part that actually helps the next person decide. We also don't offer anything in exchange for a review, and we don't screen people before asking. Everyone gets the same link, whatever they plan to say.</p>
      <p>If you'd rather tell us something privately instead of, or as well as, posting publicly, <a href="/contact/">get in touch</a> and it goes straight to the managing partner.</p>
    </div>
  </div>
</section>
${testimonialStage(testimonials)}
${ctaBanner()}`,
}));

/* =========================================================================
   LEGAL + UTILITY
   ========================================================================= */
page('/disclaimer/', layout({
  title: 'Disclaimer | Alpert Schreyer Personal Injury Lawyers',
  desc: 'Legal disclaimer for the Alpert Schreyer Personal Injury Lawyers website.',
  path: '/disclaimer/',
  ld: [ldBreadcrumbs([{ t: 'Disclaimer' }])],
  body: `
${pageHero({ h1: 'Disclaimer', crumbs: [{ t: 'Disclaimer' }] })}
<section class="section">
  <div class="wrap">
    <div class="doc rv">
      <p>${esc(disclaimer)}</p>
      <h2>Prior results</h2>
      <p>Prior results do not guarantee a similar outcome. Every case is different and depends on its own facts. Case results described on this site were dependent on the facts of those cases, and the results will differ if based on different facts.</p>
      <h2>No attorney-client relationship</h2>
      <p>Contacting us through this website, by telephone, or by electronic mail does not create an attorney-client relationship. Please do not send any confidential information to us until such time as an attorney-client relationship has been established.</p>
      <h2>Jurisdiction</h2>
      <p>This web site is not intended to solicit clients for matters outside of the state of Maryland. We serve all of Maryland.</p>
    </div>
  </div>
</section>`,
}));

page('/privacy-policy/', layout({
  title: 'Privacy Policy | Alpert Schreyer Personal Injury Lawyers',
  desc: 'How Alpert Schreyer Personal Injury Lawyers collects, uses and protects information submitted through this website.',
  path: '/privacy-policy/',
  ld: [ldBreadcrumbs([{ t: 'Privacy Policy' }])],
  body: `
${pageHero({ h1: 'Privacy policy', crumbs: [{ t: 'Privacy Policy' }] })}
<section class="section">
  <div class="wrap">
    <div class="doc rv">
      <div class="demoflag" style="margin-bottom:2rem">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 9v4M12 17h.01"/><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/></svg>
        <span><b>To be replaced before launch.</b>The firm's existing privacy policy should be migrated here verbatim, and reviewed by counsel against what this build actually collects. The summary below describes the build's real behaviour and is offered as a starting point for that review, not as a policy.</span>
      </div>
      <h2>What this site collects</h2>
      <p>When you submit the free case review form, we collect the name, telephone number, email address, ZIP code and case description you provide, along with how you heard about us if you tell us.</p>
      <h2>How it is handled</h2>
      <ul>
        <li>Form submissions are transmitted over TLS and delivered to our intake system.</li>
        <li>The case description is treated as sensitive. It is not written to server logs and is not sent to any analytics or session-recording tool.</li>
        <li>We do not sell personal information.</li>
      </ul>
      <h2>Text messages</h2>
      <p>If you check the consent box, you agree to receive text messages from Alpert Schreyer Injury Accident Lawyers, including appointment reminders, case status updates, document requests, billing notifications, and general client communication. Message frequency may vary. Message and data rates may apply. Reply STOP to opt out at any time or HELP for assistance.</p>
      <h2>Third parties</h2>
      <p>Google reviews displayed on this site are retrieved from Google. Office maps load from Google Maps only after you choose to load them. Where fonts are served from a third party in a preview build, they are self-hosted before launch.</p>
      <h2>Contact</h2>
      <p>Questions about this policy can be directed to our office at <a href="${firm.mainPhoneHref}">${firm.mainPhone}</a>.</p>
    </div>
  </div>
</section>`,
}));



/* =========================================================================
   RESOURCES
   ========================================================================= */
page('/personal-injury-resources/', layout({
  title: 'Personal Injury Resources | Alpert Schreyer',
  desc: 'Free guides, videos and answers for injured Marylanders from Alpert Schreyer Personal Injury Lawyers.',
  path: '/personal-injury-resources/',
  ld: [ldBreadcrumbs([{ t: 'Personal Injury Resources' }])],
  body: `
${pageHero({ h1: 'Personal injury resources', sub: 'Free to use, no strings. Written for people who did not plan on needing a lawyer.', crumbs: [{ t: 'Personal Injury Resources' }] })}
<section class="section">
  <div class="wrap">
    <div class="linkgrid rv" style="margin-bottom:3rem">
      <a href="/personal-injury-resources/free-downloads/">Free Downloads ${icon.arrow}</a>
      <a href="/personal-injury-resources/video-center/">Video Center ${icon.arrow}</a>
    </div>
    <p class="eyebrow rv">Why hire our firm</p>
    <h2 class="h-section rv" style="margin-bottom:.75rem">Representation. Results. Recovery.</h2>
    <p class="lede rv" style="margin-bottom:2rem;max-width:60ch">Six reasons people choose us.</p>
    ${reasonsGrid(whyHire, true)}
  </div>
</section>
<section class="section section--tight" style="background:var(--paper-2);border-block:1px solid var(--rule)">
  <div class="wrap">
    <div class="dl rv">
      <div class="dl__cover"><img src="${freeDownloads[0].cover}" alt="${esc(freeDownloads[0].title)}" width="500" height="640" loading="lazy" decoding="async"></div>
      <div class="dl__body">
        <p class="eyebrow">Free book</p>
        <h2>${esc(freeDownloads[0].title)}</h2>
        <p>${esc(freeDownloads[0].blurb)}</p>
        <a class="btn btn--primary" href="/personal-injury-resources/free-downloads/">${esc(freeDownloads[0].cta)}</a>
      </div>
    </div>
  </div>
</section>
<section class="section">
  <div class="wrap wrap-narrow" style="margin-inline:auto">
    <p class="eyebrow rv">Common questions</p>
    <h2 class="h-section rv" style="margin-bottom:2rem">Personal injury FAQ</h2>
    ${faqBlock(faqs)}
  </div>
</section>
${ctaBanner()}`,
}));

page('/personal-injury-resources/free-downloads/', layout({
  title: 'Free Downloads | Alpert Schreyer Personal Injury Lawyers',
  desc: "Download our Maryland Car Owner's Guide to Auto Insurance free ebook, and get valuable information for car owners in Maryland.",
  path: '/personal-injury-resources/free-downloads/',
  ld: [ldBreadcrumbs([{ t: 'Personal Injury Resources', h: '/personal-injury-resources/' }, { t: 'Free Downloads' }])],
  body: `
${pageHero({ h1: 'Free downloads', sub: 'No cost, no obligation.', crumbs: [{ t: 'Personal Injury Resources', h: '/personal-injury-resources/' }, { t: 'Free Downloads' }] })}
<section class="section">
  <div class="wrap">
    <div class="dl rv">
      <div class="dl__cover"><img src="${freeDownloads[0].cover}" alt="${esc(freeDownloads[0].title)}" width="500" height="640" fetchpriority="high"></div>
      <div class="dl__body">
        <p class="eyebrow">Free book</p>
        <h2>${esc(freeDownloads[0].title)}</h2>
        <p>${esc(freeDownloads[0].blurb)}</p>
        <form class="dlform" id="dlForm" novalidate action="/api/lead" method="post">
          <input type="hidden" name="intent" value="ebook:${freeDownloads[0].slug}">
          <div class="hp" aria-hidden="true"><label>Leave this empty<input type="text" name="company" tabindex="-1" autocomplete="off"></label></div>
          <div class="field">
            <label for="dl-name">Name <span class="rq">*</span></label>
            <input class="input" id="dl-name" name="name" type="text" autocomplete="name" required>
            <p class="err" data-err-for="dl-name" role="alert"></p>
          </div>
          <div class="field">
            <label for="dl-email">Email <span class="rq">*</span></label>
            <input class="input" id="dl-email" name="email" type="email" inputmode="email" autocomplete="email" required>
            <p class="err" data-err-for="dl-email" role="alert"></p>
          </div>
          <button class="btn btn--primary" type="submit">${esc(freeDownloads[0].cta)}</button>
          <p class="sheet__legal">We'll email you the book. Requesting it does not create an attorney-client relationship.</p>
        </form>
        <div id="dlOk" class="form__ok" hidden role="status">
          <b>On its way</b>
          <p>Check your inbox — if it's not there in a few minutes, look in spam, then call <a href="${firm.mainPhoneHref}" style="color:var(--crimson);font-weight:600">${firm.mainPhone}</a>.</p>
        </div>
      </div>
    </div>
  </div>
</section>
<section class="section section--tight" style="background:var(--paper-2);border-block:1px solid var(--rule)">
  <div class="wrap">
    <p class="eyebrow rv">Why hire our firm</p>
    <h2 class="h-card rv" style="margin-bottom:1.5rem">Representation. Results. Recovery.</h2>
    ${reasonsGrid(whyHire, true)}
  </div>
</section>
${testimonialStage(testimonials)}
${ctaBanner()}`,
}));

page('/personal-injury-resources/video-center/', layout({
  title: 'Video Center | Alpert Schreyer Personal Injury Lawyers',
  desc: 'Watch our attorneys answer common Maryland personal injury and DUI questions.',
  path: '/personal-injury-resources/video-center/',
  ld: [ldBreadcrumbs([{ t: 'Personal Injury Resources', h: '/personal-injury-resources/' }, { t: 'Video Center' }])],
  body: `
${pageHero({ h1: 'Video center', sub: 'Get to know us before you call.', crumbs: [{ t: 'Personal Injury Resources', h: '/personal-injury-resources/' }, { t: 'Video Center' }] })}
<section class="section">
  <div class="wrap">
    <p class="eyebrow rv">Featured</p>
    <h2 class="h-section rv" style="margin-bottom:1.5rem">${esc(videoCenter.featured.title)}</h2>
    ${videoFacade(videoCenter.featured.id, videoCenter.featured.title)}
    <p class="rv" style="margin-top:1.25rem;font-size:var(--t-sm);color:var(--ink-400);max-width:70ch">
      Nothing loads from YouTube until you press play — no cookies, no tracking, no request. That's the whole reason this is a poster and not an embed.
    </p>
    <p class="rv" style="margin-top:2rem"><a class="btn btn--ghost" href="${videoCenter.channel}" target="_blank" rel="noopener">More videos on YouTube ${icon.arrow}</a></p>
  </div>
</section>
<section class="section section--tight" style="background:var(--paper-2);border-block:1px solid var(--rule)">
  <div class="wrap">
    <p class="eyebrow rv">Also here</p>
    <div class="linkgrid rv" style="margin-top:1rem">
      <a href="/personal-injury-resources/free-downloads/">Free Downloads ${icon.arrow}</a>
      <a href="/personal-injury-resources/">All Resources ${icon.arrow}</a>
    </div>
  </div>
</section>
${ctaBanner()}`,
}));


/* =========================================================================
   SPANISH SITE — /es/
   Content imported from the firm's existing professionally translated pages.
   The tree is deliberately smaller than the English one because that is what
   the firm publishes in Spanish: no DUI county pages, no blog, six practice
   areas rather than twelve. Generating Spanish URLs for content that has no
   Spanish copy would be worse than not having them.
   ========================================================================= */
const esLedger = (items) => `<div class="ledger rv">
  ${items.map((c) => `<div class="ledger__row${c.feature ? ' ledger__row--feature' : ''}">
    <div class="ledger__amt">${c.amt}</div>
    <p class="ledger__desc">${c.label ? `<em>${esc(c.label)}</em>` : ''}${c.desc}</p>
  </div>`).join('\n  ')}
</div>`;

const esAttorneyGrid = () => `<div class="attys rv">
  ${attorneys.map((a) => `<a class="atty" href="/about-our-firm/our-attorneys/${a.slug}/" hreflang="en">
    <div class="atty__ph"><img src="${a.photo}" alt="${esc(a.name)}" width="300" height="400" loading="lazy" decoding="async"></div>
    <div class="atty__body"><div class="atty__name">${esc(a.name)}</div><div class="atty__role">${esc(es.attorneyRoles[a.slug] || a.role)}</div></div>
  </a>`).join('\n  ')}
</div>`;

const esOfficeCards = () => `<div class="offices rv">
  ${offices.map((o) => `<div class="office">
    <div class="office__map">
      <button class="mapfacade" data-map="${o.embed}" data-map-title="Mapa de la oficina de ${esc(o.city)}"><span>${icon.pin} ${es.ui.loadMap}</span></button>
    </div>
    <div class="office__body">
      <div class="office__name">Oficina de ${esc(o.city)}</div>
      <a class="office__addr" href="${o.maps}" target="_blank" rel="noopener">${esc(o.addr)}</a>
      <div class="office__links"><a href="${o.phoneHref}">${o.phone}</a><a href="${o.maps}" target="_blank" rel="noopener">${es.ui.directions}</a></div>
    </div>
  </div>`).join('\n  ')}
</div>`;

const esCta = () => `<section class="section cta">
  <div class="cta__bg" aria-hidden="true"><img src="${firm.images.team2}" alt="" width="1600" height="900" loading="lazy" decoding="async"></div>
  <div class="cta__veil" aria-hidden="true"></div>
  <div class="wrap"><div class="cta__in">
    <p class="cta__fee">${es.home.ctaSub}</p>
    <h2>${es.home.ctaH}</h2>
    <p style="color:rgba(255,255,255,.78)">${es.ui.open247}</p>
    <div class="btn-row">
      <a class="btn btn--primary" href="/es/contacto/">${es.ui.freeReview}</a>
      <a class="btn btn--call" href="${firm.mainPhoneHref}">${icon.phone} ${firm.mainPhone}</a>
    </div>
  </div></div>
</section>`;

const esStage = () => `<section class="tstage" aria-label="${es.home.reviewsH}" id="tstage">
  <div class="tstage__bg" aria-hidden="true"><img src="${firm.images.duiTeam}" alt="" width="1600" height="900" loading="lazy" decoding="async"></div>
  <div class="tstage__veil" aria-hidden="true"></div>
  <div class="wrap section tstage__in">
    <p class="eyebrow">${es.home.reviewsH}</p>
    <div class="tstage__quotes" id="tstageQuotes">
      ${es.testimonials.map((q, i) => `<figure class="tslide${i === 0 ? ' is-live' : ''}" data-tslide="${i}"${i === 0 ? '' : ' aria-hidden="true"'}>
        <div class="tslide__mark" aria-hidden="true">&ldquo;</div>
        <blockquote>${esc(q.text)}</blockquote>
        <figcaption class="tslide__by">
          <span class="tslide__av" aria-hidden="true">${esc(q.author.split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase())}</span>
          <span class="tslide__name">${esc(q.author)}</span>
          <span class="stars" data-stars="5" role="img" aria-label="5 de 5 estrellas"></span>
        </figcaption>
      </figure>`).join('\n      ')}
    </div>
    <div class="tstage__controls">
      <div class="tstage__dots" role="tablist" aria-label="Elegir testimonio">
        ${es.testimonials.map((q, i) => `<button class="tdot" role="tab" aria-selected="${i === 0}" data-tdot="${i}" aria-label="Testimonio ${i + 1}"></button>`).join('\n        ')}
      </div>
      <div class="tstage__arrows">
        <button class="tarrow" data-tprev aria-label="Anterior"><svg viewBox="0 0 12 12" aria-hidden="true"><path d="M7.5 2 4 6l3.5 4"/></svg></button>
        <button class="tarrow" data-tnext aria-label="Siguiente"><svg viewBox="0 0 12 12" aria-hidden="true"><path d="M4.5 2 8 6l-3.5 4"/></svg></button>
      </div>
    </div>
  </div>
</section>`;

const esHero = ({ h1, sub, crumbs = [], img }) => `<section class="phero">
  <div class="phero__bg" aria-hidden="true"><img src="${img || firm.images.interiorHero}" alt="" width="1600" height="700" fetchpriority="high"></div>
  <div class="phero__veil" aria-hidden="true"></div>
  <div class="wrap phero__in">
    ${crumbs.length ? `<nav class="crumbs" aria-label="Ruta">
      <a href="/es/">${es.ui.home}</a>
      ${crumbs.map((c) => `<span aria-hidden="true">/</span>${c.h ? `<a href="${c.h}">${esc(c.t)}</a>` : `<span>${esc(c.t)}</span>`}`).join('')}
    </nav>` : ''}
    <h1>${h1}</h1>
    ${sub ? `<p>${esc(sub)}</p>` : ''}
    <div class="btn-row">
      <a class="btn btn--primary" href="/es/contacto/">${es.ui.freeReview}</a>
      <a class="btn btn--call" href="${firm.mainPhoneHref}">${icon.phone} ${firm.mainPhone}</a>
    </div>
  </div>
</section>`;

const esLd = () => JSON.stringify({
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: es.faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.aText } })),
});

/* ---- /es/ home ---- */
page('/es/', esLayout({
  title: es.home.title, desc: es.home.desc, path: '/es/', alt: '/',
  ld: [ldLegalService(), esLd()],
  body: `
<section class="hero">
  <div class="hero__media">
    <img id="heroPoster" src="${firm.images.team1}" alt="" width="1600" height="900" fetchpriority="high" decoding="async">
    <video id="heroVideo" muted loop playsinline preload="none" aria-hidden="true" tabindex="-1" poster="${firm.images.team1}" data-src="${firm.heroVideo}"></video>
  </div>
  <div class="hero__veil" aria-hidden="true"></div>
  <div class="wrap hero__in">
    <div class="hero__grid">
      <div>
        <p class="eyebrow">${es.home.eyebrow}</p>
        <h1>${es.home.h1}</h1>
        <p class="hero__sub">${esc(es.home.sub)}</p>
        <div class="btn-row">
          <a class="btn btn--primary" href="/es/contacto/">${es.ui.freeConsult}</a>
          <a class="btn btn--call" href="${firm.mainPhoneHref}">${icon.phone} ${firm.mainPhone}</a>
        </div>
        <div class="ledger-strip">
          ${es.home.ledger.map((l, i) => `${i ? '<div class="ledger-strip__rule" aria-hidden="true"></div>' : ''}
          <div class="ledger-strip__item"><div class="ledger-strip__n">${l.n}</div><div class="ledger-strip__l">${esc(l.l)}</div></div>`).join('')}
          <div class="ledger-strip__rule" aria-hidden="true"></div>
          <a class="grating" href="${firm.reviewsLink}" target="_blank" rel="noopener">
            <svg class="grating__g" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3A12 12 0 1 1 24 12a11.9 11.9 0 0 1 7.9 3l5.7-5.7A20 20 0 1 0 24 44a20 20 0 0 0 19.6-23.9Z"/><path fill="#FF3D00" d="m6.3 14.7 6.6 4.8A11.9 11.9 0 0 1 24 12a11.9 11.9 0 0 1 7.9 3l5.7-5.7A20 20 0 0 0 6.3 14.7Z"/><path fill="#4CAF50" d="M24 44a20 20 0 0 0 13.5-5.2l-6.2-5.3A11.9 11.9 0 0 1 12.7 28l-6.6 5A20 20 0 0 0 24 44Z"/><path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3a12 12 0 0 1-4.1 5.5l6.2 5.3A19.9 19.9 0 0 0 43.6 20.1Z"/></svg>
            <span class="stars" aria-hidden="true" data-stars="5"></span>
            <span class="grating__score" data-g-rating>&mdash;</span>
            <span class="grating__count"><span data-g-count>&mdash;</span> ${es.reviews.gReviews}</span>
          </a>
        </div>
      </div>
      ${esLeadForm()}
    </div>
  </div>
</section>

<section class="section gap">
  <div class="wrap gap__grid">
    <div class="rv">
      <p class="eyebrow">${es.gap.eyebrow}</p>
      <h2>${es.gap.h}</h2>
      <p class="gap__note">${es.gap.note}</p>
      <p style="margin-top:2rem"><a class="btn btn--ghost" href="/es/resultados-de-casos/">${es.ui.viewAll}</a></p>
    </div>
    <div class="gapbar rv" id="gapbar">
      <div class="gapbar__row gapbar__row--them">
        <div class="gapbar__meta"><span class="gapbar__who">${es.gap.them}</span><span class="gapbar__amt">$5,000</span></div>
        <div class="gapbar__track"><div class="gapbar__fill" style="--w:0.92%"></div></div>
      </div>
      <div class="gapbar__row gapbar__row--us">
        <div class="gapbar__meta"><span class="gapbar__who">${es.gap.us}</span><span class="gapbar__amt">$543,000</span></div>
        <div class="gapbar__track"><div class="gapbar__fill" style="--w:100%"></div></div>
      </div>
      <span class="gapbar__x"><b>108&times;</b> ${es.gap.x}</span>
    </div>
  </div>
</section>
${trustStrip()}

<section class="section">
  <div class="wrap split">
    <div>
      <p class="eyebrow rv">${esc(es.home.introEyebrow)}</p>
      <h2 class="h-section rv" style="max-width:22ch;margin-bottom:2rem">${esc(es.home.introH)}</h2>
      <div class="prose rv">${es.home.intro.map((p) => `<p>${esc(p)}</p>`).join('\n        ')}</div>
    </div>
    ${splitFigure(sectionImages.intro, { n: '$100M+', l: 'Recuperados para clientes' })}
  </div>
</section>

<section class="section section--tight" style="background:var(--paper-2);border-block:1px solid var(--rule)">
  <div class="wrap">
    <p class="eyebrow rv">${es.home.resultsH}</p>
    <h2 class="h-section rv" style="margin-bottom:2rem">${es.home.resultsH}</h2>
    ${esLedger(es.caseResults)}
    <p class="rv" style="margin-top:1.25rem;font-size:var(--t-xs);color:var(--ink-400);max-width:70ch">Los resultados anteriores no garantizan un resultado similar. Cada caso es diferente y depende de sus propios hechos.</p>
  </div>
</section>

<section class="section">
  <div class="wrap split split--wide-text">
    <div>
      <p class="eyebrow rv">${esc(es.home.helpLede.slice(0, 40))}…</p>
      <h2 class="h-section rv" style="max-width:26ch;margin-bottom:1.5rem">${esc(es.home.helpH)}</h2>
      <div class="prose rv" style="margin-bottom:1.5rem"><p>${esc(es.home.helpLede)}</p></div>
      <div class="faq__a rv" style="padding:0">
        <ul>${es.home.help.map((h) => `<li><strong>${esc(h.b)}</strong> ${esc(h.t)}</li>`).join('')}</ul>
      </div>
    </div>
    ${splitFigure(sectionImages.why, { n: '125+', l: 'Años de experiencia' })}
  </div>
</section>

${esStage()}

<section class="section" style="background:var(--paper-2);border-block:1px solid var(--rule)">
  <div class="wrap">
    <p class="eyebrow rv">Áreas de Práctica</p>
    <h2 class="h-section rv" style="margin-bottom:2rem">Casos que Manejamos</h2>
    <div class="pgrid rv">
      ${es.practiceAreas.map((p) => `<a class="pcard" href="/es/areas-de-practica/${p.slug}/">
        <img class="pcard__ico" src="${p.icon}" alt="" width="38" height="38" loading="lazy" decoding="async">
        <h3>${esc(p.name)}</h3>
        <p>${esc(p.blurb)}</p>
        <span class="pcard__go">Más información ${icon.arrow}</span>
      </a>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <p class="eyebrow rv">${es.home.whyH}</p>
    <h2 class="h-section rv" style="max-width:26ch;margin-bottom:2rem">${esc(es.home.whyH)}</h2>
    <div class="reasons rv" style="grid-template-columns:1fr">
      ${es.home.why.map((w) => `<div class="reason"><h3>${esc(w.h)}</h3><p>${esc(w.p)}</p></div>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="section" style="background:var(--paper-2);border-block:1px solid var(--rule)">
  <div class="wrap">
    <p class="eyebrow rv">${es.home.attorneysH}</p>
    <h2 class="h-section rv" style="max-width:26ch">${es.home.attorneysH}</h2>
    <p class="lede rv" style="margin:1rem 0 2rem;max-width:60ch">${esc(es.home.attorneysSub)}</p>
    ${esAttorneyGrid()}
  </div>
</section>

<section class="section">
  <div class="wrap wrap-narrow" style="margin-inline:auto">
    <p class="eyebrow rv">Preguntas Frecuentes</p>
    <h2 class="h-section rv" style="margin-bottom:2rem">Preguntas Frecuentes Sobre Lesiones Personales</h2>
    ${faqBlock(es.faqs)}
  </div>
</section>

${esCta()}

<section class="section">
  <div class="wrap">
    <p class="eyebrow rv">${es.ui.contact}</p>
    <h2 class="h-section rv" style="max-width:26ch;margin-bottom:1.5rem">${esc(es.home.contactH)}</h2>
    <div class="prose rv" style="margin-bottom:2.5rem">${es.home.contact.map((p) => `<p>${esc(p)}</p>`).join('\n      ')}</div>
    <p class="eyebrow rv">${es.ui.ourOffices}</p>
    <h3 class="h-card rv" style="margin-bottom:1.5rem">Cuatro oficinas en Maryland</h3>
    ${esOfficeCards()}
  </div>
</section>`,
}));

/* ---- /es/ inner pages ---- */
page('/es/sobre-nosotros/', esLayout({
  title: 'Acerca de Nosotros | Alpert Schreyer', desc: es.aboutBlurb.slice(0, 155),
  path: '/es/sobre-nosotros/', alt: '/about-our-firm/',
  ld: [ldLegalService()],
  body: `
${esHero({ h1: 'Acerca de Nosotros', sub: 'Más de 125 años de experiencia combinada luchando por las víctimas lesionadas.', crumbs: [{ t: 'Acerca de Nosotros' }], img: firm.images.aboutHero })}
<section class="section">
  <div class="wrap split">
    <div>
      <div class="prose rv" style="font-size:var(--t-lg)">
        <p>${esc(es.aboutBlurb)}</p>
        ${es.home.experience.map((p) => `<p>${esc(p)}</p>`).join('\n        ')}
      </div>
    </div>
    ${splitFigure(sectionImages.intro, { n: '$100M+', l: 'Recuperados para clientes' })}
  </div>
</section>
${trustStrip()}
<section class="section section--tight" style="background:var(--paper-2);border-block:1px solid var(--rule)">
  <div class="wrap">
    <p class="eyebrow rv">${es.home.resultsH}</p>
    <h2 class="h-section rv" style="margin-bottom:2rem">${es.home.resultsH}</h2>
    ${esLedger(es.caseResults.slice(0, 4))}
    <p class="rv" style="margin-top:1.5rem"><a class="btn btn--ghost" href="/es/resultados-de-casos/">${es.ui.viewAll}</a></p>
  </div>
</section>
${esStage()}
${esCta()}`,
}));

page('/es/resultados-de-casos/', esLayout({
  title: 'Resultados de Casos | Alpert Schreyer',
  desc: 'Veredictos y acuerdos obtenidos por Alpert Schreyer Personal Injury Lawyers en todo Maryland — más de $100 millones recuperados.',
  path: '/es/resultados-de-casos/', alt: '/about-our-firm/case-results/',
  body: `
${esHero({ h1: 'Resultados de Casos', sub: 'Más de $100 millones recuperados para nuestros clientes.', crumbs: [{ t: 'Resultados de Casos' }] })}
<section class="section gap">
  <div class="wrap gap__grid">
    <div class="rv">
      <p class="eyebrow">${es.gap.eyebrow}</p>
      <h2>${es.gap.h}</h2>
      <p class="gap__note">${es.gap.note}</p>
    </div>
    <div class="gapbar rv" id="gapbar">
      <div class="gapbar__row gapbar__row--them">
        <div class="gapbar__meta"><span class="gapbar__who">${es.gap.them}</span><span class="gapbar__amt">$5,000</span></div>
        <div class="gapbar__track"><div class="gapbar__fill" style="--w:0.92%"></div></div>
      </div>
      <div class="gapbar__row gapbar__row--us">
        <div class="gapbar__meta"><span class="gapbar__who">${es.gap.us}</span><span class="gapbar__amt">$543,000</span></div>
        <div class="gapbar__track"><div class="gapbar__fill" style="--w:100%"></div></div>
      </div>
      <span class="gapbar__x"><b>108&times;</b> ${es.gap.x}</span>
    </div>
  </div>
</section>
<section class="section">
  <div class="wrap">
    <p class="eyebrow rv">Veredictos y Acuerdos</p>
    <h2 class="h-section rv" style="margin-bottom:2rem">${es.home.resultsH}</h2>
    ${esLedger(es.caseResults)}
    <p class="rv" style="margin-top:1.5rem;font-size:var(--t-xs);color:var(--ink-400);max-width:70ch">Los resultados anteriores no garantizan un resultado similar. Cada caso es diferente y depende de sus propios hechos.</p>
  </div>
</section>
${esCta()}`,
}));

page('/es/nuestros-abogados/', esLayout({
  title: 'Nuestros Abogados | Alpert Schreyer',
  desc: 'Conoce a los abogados de lesiones personales de Alpert Schreyer Personal Injury Lawyers en Maryland.',
  path: '/es/nuestros-abogados/', alt: '/about-our-firm/our-attorneys/',
  body: `
${esHero({ h1: 'Nuestros Abogados', sub: es.home.attorneysSub, crumbs: [{ t: 'Nuestros Abogados' }] })}
<section class="section"><div class="wrap">
  ${esAttorneyGrid()}
  <p class="rv" style="margin-top:1.5rem;font-size:var(--t-sm);color:var(--ink-400)">Las biografías completas están disponibles en inglés.</p>
</div></section>
${esStage()}
${esCta()}`,
}));

page('/es/testimonios/', esLayout({
  title: 'Testimonios de Clientes | Alpert Schreyer',
  desc: 'Lee lo que dicen los clientes sobre trabajar con Alpert Schreyer Personal Injury Lawyers en Maryland.',
  path: '/es/testimonios/', alt: '/about-our-firm/testimonials/',
  body: `
${esHero({ h1: 'Testimonios de Clientes', sub: 'En sus propias palabras.', crumbs: [{ t: 'Testimonios' }], img: firm.images.duiTeam })}
${esStage()}
<section class="section"><div class="wrap">
  <p class="eyebrow rv">${es.home.reviewsH}</p>
  <h2 class="h-section rv" style="margin-bottom:2rem">Lo que nos dijeron nuestros clientes</h2>
  <div class="quotes rv">
    ${es.testimonials.map((t, i) => `<figure class="quote${i === 0 ? ' quote--wide' : ''}">
      <blockquote>${esc(t.text)}</blockquote>
      <figcaption>${esc(t.author)}</figcaption>
    </figure>`).join('\n    ')}
  </div>
</div></section>
${esCta()}`,
}));

page('/es/areas-de-practica/', esLayout({
  title: 'Áreas de Práctica | Alpert Schreyer',
  desc: 'Casos de lesiones personales que manejamos en Maryland: accidentes de auto, camión, moto, compensación laboral y más.',
  path: '/es/areas-de-practica/', alt: '/practice-areas/',
  body: `
${esHero({ h1: 'Áreas de Práctica', sub: 'Casos que manejamos en todo Maryland.', crumbs: [{ t: 'Áreas de Práctica' }] })}
<section class="section"><div class="wrap">
  <div class="pgrid rv">
    ${es.practiceAreas.map((p) => `<a class="pcard" href="/es/areas-de-practica/${p.slug}/">
      <img class="pcard__ico" src="${p.icon}" alt="" width="38" height="38" loading="lazy" decoding="async">
      <h3>${esc(p.name)}</h3>
      <p>${esc(p.blurb)}</p>
      <span class="pcard__go">Más información ${icon.arrow}</span>
    </a>`).join('\n    ')}
  </div>
</div></section>
${esCta()}`,
}));

for (const p of es.practiceAreas) {
  page(`/es/areas-de-practica/${p.slug}/`, esLayout({
    title: `Abogado de ${p.name} en Maryland | Alpert Schreyer`,
    desc: `${p.blurb.slice(0, 150)}`,
    path: `/es/areas-de-practica/${p.slug}/`, alt: `/practice-areas/${p.enSlug}/`,
    ld: [esLd()],
    body: `
${esHero({ h1: `Abogado de ${esc(p.name)}`, sub: 'Consulta gratuita.', crumbs: [{ t: 'Áreas de Práctica', h: '/es/areas-de-practica/' }, { t: p.name }] })}
<section class="section"><div class="wrap split">
  <div>
    <div class="prose rv" style="font-size:var(--t-lg)">
      <p>${esc(p.blurb)}</p>
      <p>Maryland aplica la norma de <strong>negligencia contributiva pura</strong>: si la aseguradora consigue atribuirte aunque sea el 1% de la culpa, puedes perder por completo el derecho a una indemnización. Por eso importa tanto lo que dices en los días posteriores al accidente, y por eso conviene hablar con un abogado antes que con un perito.</p>
      <p>Nos ocupamos de la compañía de seguros para que tú puedas concentrarte en recuperarte. Llámanos al <a href="${firm.mainPhoneHref}">${firm.mainPhone}</a> — la consulta es gratuita.</p>
    </div>
    <div class="rv" style="margin-top:2.5rem">
      <p class="eyebrow">Preguntas Frecuentes</p>
      <h2 class="h-card" style="margin-bottom:1rem">Lo que nos preguntan</h2>
      ${faqBlock(es.faqs.slice(0, 3))}
    </div>
  </div>
  ${splitFigure(sectionImages.why, { n: '125+', l: 'Años de experiencia' })}
</div></section>
<section class="section section--tight" style="background:var(--paper-2);border-block:1px solid var(--rule)">
  <div class="wrap">
    <p class="eyebrow rv">Relacionado</p>
    <h2 class="h-card rv" style="margin-bottom:1.5rem">Otros casos que manejamos</h2>
    <div class="linkgrid rv">
      ${es.practiceAreas.filter((x) => x.slug !== p.slug).map((x) => `<a href="/es/areas-de-practica/${x.slug}/">${esc(x.name)} ${icon.arrow}</a>`).join('\n      ')}
    </div>
  </div>
</section>
${esStage()}
${esCta()}`,
  }));
}

page('/es/areas-de-servicio/', esLayout({
  title: 'Áreas de Servicio | Alpert Schreyer', desc: es.areasBlurb.slice(0, 155),
  path: '/es/areas-de-servicio/', alt: '/areas-we-serve/',
  ld: [ldLegalService()],
  body: `
${esHero({ h1: 'Áreas de Servicio', sub: 'Cuatro oficinas. Todo Maryland.', crumbs: [{ t: 'Áreas de Servicio' }] })}
<section class="section"><div class="wrap">
  <div class="prose rv" style="margin-bottom:2.5rem"><p>${esc(es.areasBlurb)}</p></div>
  <p class="eyebrow rv">${es.ui.ourOffices}</p>
  <h2 class="h-section rv" style="margin-bottom:1.5rem">Dónde encontrarnos</h2>
  ${esOfficeCards()}
</div></section>
<section class="section section--tight" style="background:var(--paper-2);border-block:1px solid var(--rule)">
  <div class="wrap">
    <p class="eyebrow rv">Por ubicación</p>
    <div class="linkgrid rv" style="margin-top:1rem">
      ${es.areaPages.map((a) => `<a href="/es/areas-de-servicio/${a.slug}/">${esc(a.name)} ${icon.arrow}</a>`).join('\n      ')}
    </div>
  </div>
</section>
${esCta()}`,
}));

for (const a of es.areaPages) {
  const o = offices.find((x) => x.key === a.office) || offices[0];
  page(`/es/areas-de-servicio/${a.slug}/`, esLayout({
    title: `Abogado de Lesiones Personales en ${a.name} | Alpert Schreyer`,
    desc: `Abogados de lesiones personales que atienden ${a.name}, Maryland. Consulta gratuita. Llama al ${firm.mainPhone}.`,
    path: `/es/areas-de-servicio/${a.slug}/`, alt: `/areas-we-serve/${a.enSlug}/`,
    body: `
${esHero({ h1: `Abogado de Lesiones Personales en ${esc(a.name)}`, sub: `Te atendemos desde nuestra oficina de ${o.city}.`, crumbs: [{ t: 'Áreas de Servicio', h: '/es/areas-de-servicio/' }, { t: a.name }] })}
<section class="section"><div class="wrap split">
  <div class="prose rv" style="font-size:var(--t-lg)">
    <p>Si te lesionaste en ${esc(a.name)}, Alpert Schreyer Personal Injury Lawyers está cerca. Nuestra oficina de ${esc(o.city)} está en <a href="${o.maps}" target="_blank" rel="noopener">${esc(o.addr)}</a>, y puedes llamarnos al <a href="${o.phoneHref}">${o.phone}</a>.</p>
    <p>Tenemos más de 125 años de experiencia combinada y hemos recuperado más de $100 millones para nuestros clientes. La consulta es gratuita.</p>
    <p>Recuerda que la norma de negligencia contributiva de Maryland es implacable: si la aseguradora te atribuye aunque sea el 1% de la culpa, tu reclamo puede quedar anulado. Por eso el consejo temprano vale tanto aquí.</p>
  </div>
  ${splitFigure(sectionImages.intro, { n: '4', l: 'Oficinas en Maryland' })}
</div></section>
<section class="section section--tight" style="background:var(--paper-2);border-block:1px solid var(--rule)">
  <div class="wrap">
    <p class="eyebrow rv">Casos que manejamos en ${esc(a.name)}</p>
    <div class="linkgrid rv" style="margin-top:1rem">
      ${es.practiceAreas.map((x) => `<a href="/es/areas-de-practica/${x.slug}/">${esc(x.name)} ${icon.arrow}</a>`).join('\n      ')}
    </div>
  </div>
</section>
${esCta()}`,
  }));
}

page('/es/contacto/', esLayout({
  title: 'Contacto | Alpert Schreyer Personal Injury Lawyers',
  desc: `Ponte en contacto con Alpert Schreyer para una consulta gratuita. Cuatro oficinas en Maryland. Llama al ${firm.mainPhone}.`,
  path: '/es/contacto/', alt: '/contact/',
  ld: [ldLegalService()],
  body: `
${esHero({ h1: 'Contacto', sub: 'Consulta gratuita. Estamos aquí 24/7.', crumbs: [{ t: 'Contacto' }] })}
<section class="section"><div class="wrap">
  <div class="prose rv" style="margin-bottom:2.5rem;max-width:70ch">
    ${es.home.contact.map((p) => `<p>${esc(p)}</p>`).join('\n    ')}
  </div>
  <div class="rv" style="max-width:640px">${esLeadForm()}</div>
</div></section>
<section class="section" style="background:var(--paper-2);border-block:1px solid var(--rule)">
  <div class="wrap">
    <p class="eyebrow rv">${es.ui.ourOffices}</p>
    <h2 class="h-section rv" style="margin-bottom:1.5rem">Cuatro oficinas en Maryland</h2>
    ${esOfficeCards()}
  </div>
</section>
${esCta()}`,
}));

/* =========================================================================
   SITEMAP (human) — generated from the page list itself, so it can't drift
   ========================================================================= */
const sitemapGroups = () => {
  const g = (title, items) => `<div class="rv" style="margin-bottom:2.5rem">
    <p class="eyebrow">${esc(title)}</p>
    <div class="linkgrid" style="margin-top:1rem">
      ${items.map((i) => `<a href="${i.h}">${esc(i.t)} ${icon.arrow}</a>`).join('\n      ')}
    </div>
  </div>`;
  return [
    g('Main', [
      { t: 'Home', h: '/' },
      { t: 'Contact', h: '/contact/' },
      { t: 'Reviews', h: '/reviews/' },
    ]),
    g('About', [
      { t: 'About Our Firm', h: '/about-our-firm/' },
      { t: 'Awards & Recognition', h: '/about-our-firm/awards-recognition/' },
      { t: 'Case Results', h: '/about-our-firm/case-results/' },
      { t: 'Our Attorneys', h: '/about-our-firm/our-attorneys/' },
      { t: 'Testimonials', h: '/about-our-firm/testimonials/' },
      ...attorneys.map((a) => ({ t: a.name, h: `/about-our-firm/our-attorneys/${a.slug}/` })),
    ]),
    g('Practice Areas', [
      { t: 'All Practice Areas', h: '/practice-areas/' },
      ...practiceAreas.map((p) => ({ t: p.name, h: `/practice-areas/${p.slug}/` })),
    ]),
    g('DUI Defense', duiPages.map((d) => ({ t: d.name, h: `/dui/${d.slug}/` }))),
    g('Areas We Serve', [
      { t: 'All Areas', h: '/areas-we-serve/' },
      ...areaPages.map((a) => ({ t: a.name, h: `/areas-we-serve/${a.slug}/` })),
    ]),
    g('Resources', [
      { t: 'Personal Injury Resources', h: '/personal-injury-resources/' },
      { t: 'Free Downloads', h: '/personal-injury-resources/free-downloads/' },
      { t: 'Video Center', h: '/personal-injury-resources/video-center/' },
    ]),
    g('Español', [
      { t: 'Inicio', h: '/es/' },
      { t: 'Acerca de Nosotros', h: '/es/sobre-nosotros/' },
      { t: 'Resultados de Casos', h: '/es/resultados-de-casos/' },
      { t: 'Nuestros Abogados', h: '/es/nuestros-abogados/' },
      { t: 'Testimonios', h: '/es/testimonios/' },
      { t: 'Áreas de Práctica', h: '/es/areas-de-practica/' },
      ...es.practiceAreas.map((p) => ({ t: p.name, h: `/es/areas-de-practica/${p.slug}/` })),
      { t: 'Áreas de Servicio', h: '/es/areas-de-servicio/' },
      ...es.areaPages.map((a) => ({ t: a.name, h: `/es/areas-de-servicio/${a.slug}/` })),
      { t: 'Contacto', h: '/es/contacto/' },
    ]),
    g('Legal', [
      { t: 'Privacy Policy', h: '/privacy-policy/' },
      { t: 'Disclaimer', h: '/disclaimer/' },
      { t: 'Sitemap', h: '/sitemap/' },
    ]),
  ].join('\n');
};

page('/sitemap/', layout({
  title: 'Sitemap | Alpert Schreyer Personal Injury Lawyers',
  desc: 'Every page on the Alpert Schreyer Personal Injury Lawyers website.',
  path: '/sitemap/',
  ld: [ldBreadcrumbs([{ t: 'Sitemap' }])],
  body: `
${pageHero({ h1: 'Sitemap', crumbs: [{ t: 'Sitemap' }] })}
<section class="section"><div class="wrap">${sitemapGroups()}</div></section>`,
}));

/* =========================================================================
   404
   ========================================================================= */
page('/404', layout({
  title: 'Page not found | Alpert Schreyer Personal Injury Lawyers',
  desc: 'That page could not be found.',
  path: '/404',
  body: `
${pageHero({ h1: "That page doesn't exist", sub: "The link may be old, or the address slightly off. Here's how to get where you were going." })}
<section class="section">
  <div class="wrap">
    <div class="linkgrid rv">
      <a href="/">Home ${icon.arrow}</a>
      <a href="/practice-areas/">Practice Areas ${icon.arrow}</a>
      <a href="/about-our-firm/our-attorneys/">Our Attorneys ${icon.arrow}</a>
      <a href="/about-our-firm/case-results/">Case Results ${icon.arrow}</a>
      <a href="/reviews/">Reviews ${icon.arrow}</a>
      <a href="/contact/">Contact ${icon.arrow}</a>
      <a href="/sitemap/">Full sitemap ${icon.arrow}</a>
    </div>
  </div>
</section>
${ctaBanner()}`,
}));

/* =========================================================================
   WRITE
   ========================================================================= */
const llmsTxt = () => {
  const urls = pages.filter((p) => p.path !== '/404').map((p) => p.path);
  return `# ${firm.name}\n\n` +
    `> Personal injury and DUI attorneys serving all of Maryland. Over 125 years of combined experience and more than $100 million recovered for clients. Free consultation.\n\n` +
    `## Offices\n${offices.map((o) => `- ${o.name}: ${o.addr} — ${o.phone}`).join('\n')}\n\n` +
    `## Key pages\n${urls.map((u) => `- ${firm.domain}${u}`).join('\n')}\n\n` +
    `## Notes\n- Prior results do not guarantee a similar outcome.\n- Contacting the firm does not create an attorney-client relationship.\n- Maryland follows strict contributory negligence: 1% fault can bar recovery.\n`;
};

const outPath = (p) => {
  if (p === '/') return resolve(DIST, 'index.html');
  if (p === '/404') return resolve(DIST, '404.html');
  return resolve(DIST, p.replace(/^\/|\/$/g, ''), 'index.html');
};

/* Rewrite one page's absolute links/assets to relative ones. */
function relativise(html, pagePath, seedJson) {
  const depth = (pagePath === '/' || pagePath === '/404')
    ? 0
    : pagePath.replace(/^\/|\/$/g, '').split('/').length;
  const up = depth === 0 ? './' : '../'.repeat(depth);

  let out = html;

  // Build stamp — first thing in <head>, visible in View Source.
  out = out.replace('<meta charset="utf-8">',
    `<!-- BUILD ${BUILD.v} (${BUILD.name}) — ${BUILD.at} — check /version.txt -->\n<meta charset="utf-8">`);

  // assets + internal links
  const fix = (p) => {
    if (p === '') return `${up}index.html`;
    if (p.startsWith('assets/') || p.startsWith('data/')) return up + p;
    if (/\.[a-z0-9]+$/i.test(p)) return up + p;              // llms.txt, sitemap.xml
    if (p.startsWith('api/')) return '/' + p;                 // server route: leave absolute
    return up + p.replace(/\/$/, '') + (CLEAN ? '/' : '/index.html');
  };
  out = out.replace(/href="\/([^"#?]*?)"/g, (m, p) => `href="${fix(p)}"`);
  out = out.replace(/src="\/([^"#?]*?)"/g,  (m, p) => `src="${fix(p)}"`);
  out = out.replace(/action="\/([^"#?]*?)"/g, (m, p) => `action="${fix(p)}"`);

  // Inline the review seed. fetch() is CORS-blocked on file:// and the data
  // file may not resolve under an unusual root, so the rail must not depend on
  // a network request to render. /api/reviews still overrides this when live.
  out = out.replace('<script src="' + up + 'assets/js/app.js" defer></script>',
    '<script>window.__REVIEWS_SEED__=' + seedJson + '</script>\n' +
    '<script src="' + up + 'assets/js/app.js" defer></script>');

  return out;
}

async function copyDir(from, to) {
  const { readdir, stat } = await import('node:fs/promises');
  await mkdir(to, { recursive: true });
  for (const e of await readdir(from)) {
    const s = resolve(from, e), d = resolve(to, e);
    if ((await stat(s)).isDirectory()) await copyDir(s, d);
    else await copyFile(s, d);
  }
}

async function main() {
  await rm(DIST, { recursive: true, force: true });
  await mkdir(DIST, { recursive: true });

  const { readFile } = await import('node:fs/promises');
  const seedJson = (await readFile(resolve(ROOT, 'data/reviews.sample.json'), 'utf8')).trim();

  for (const { path, html } of pages) {
    const f = outPath(path);
    await mkdir(dirname(f), { recursive: true });
    await writeFile(f, relativise(html, path, seedJson));
  }

  // assets
  await mkdir(resolve(DIST, 'assets/css'), { recursive: true });
  await mkdir(resolve(DIST, 'assets/js'), { recursive: true });
  await copyFile(resolve(ROOT, 'src/styles.css'), resolve(DIST, 'assets/css/site.css'));
  await copyFile(resolve(ROOT, 'src/app.js'), resolve(DIST, 'assets/js/app.js'));

  // Self-hosted fonts (+ any vendored media). copyDir tolerates a missing dir.
  await copyDir(resolve(ROOT, 'assets/fonts'), resolve(DIST, 'assets/fonts')).catch(() => {});
  await copyDir(resolve(ROOT, 'assets/media'), resolve(DIST, 'assets/media')).catch(() => {});

  // Favicons. The full set lives under /assets/favicon/, and the two files
  // browsers request by convention (/favicon.ico, /site.webmanifest) are also
  // dropped at the site root so the tab icon works with zero config.
  await copyDir(resolve(ROOT, 'assets/favicon'), resolve(DIST, 'assets/favicon')).catch(() => {});
  await copyFile(resolve(ROOT, 'assets/favicon/favicon.ico'), resolve(DIST, 'favicon.ico')).catch(() => {});
  await copyFile(resolve(ROOT, 'assets/favicon/site.webmanifest'), resolve(DIST, 'site.webmanifest')).catch(() => {});
  await copyDir(resolve(ROOT, 'data'), resolve(DIST, 'data'));


  // header/deploy configs travel with the output
  for (const f of ['_headers', 'netlify.toml', 'vercel.json']) {
    try { await copyFile(resolve(ROOT, f), resolve(DIST, f)); } catch {}
  }

  // robots + xml sitemap
  const urls = pages.filter((p) => p.path !== '/404').map((p) => p.path);
  await writeFile(resolve(DIST, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.map((u) => `  <url><loc>${firm.domain}${u}</loc><changefreq>${u === '/' ? 'weekly' : 'monthly'}</changefreq><priority>${u === '/' ? '1.0' : '0.7'}</priority></url>`).join('\n') +
    `\n</urlset>\n`);

  // GitHub Pages runs Jekyll by default, which skips files/folders it doesn't
  // like. This empty file turns that off so the output ships verbatim.
  await writeFile(resolve(DIST, '.nojekyll'), '');

  await writeFile(resolve(DIST, 'version.txt'),
    `build:   ${BUILD.v}\nname:    ${BUILD.name}\nbuilt:   ${BUILD.at}\npages:   ${pages.length}\n` +
    `spanish: ${pages.filter((p) => p.path.startsWith('/es/')).length} pages\n` +
    `\n` +
    `If the site you are looking at does not match this, you are running an old\n` +
    `extract. Open /version.txt in the browser to check which build is served.\n`);

  await writeFile(resolve(DIST, 'robots.txt'),
    `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${firm.domain}/sitemap.xml\n`);

  // llms.txt — the old site linked one, so keep the route alive
  await writeFile(resolve(DIST, 'llms.txt'), llmsTxt());

  console.log(`\n  Built ${pages.length} pages -> site/   [build ${BUILD.v} — ${BUILD.name}]${CLEAN ? '  (clean URLs)' : ''}\n`);
  const byDir = {};
  for (const p of pages) {
    const k = p.path === '/' ? '(home)' : p.path.split('/')[1];
    byDir[k] = (byDir[k] || 0) + 1;
  }
  for (const [k, v] of Object.entries(byDir)) console.log(`    ${String(v).padStart(3)}  ${k}`);
  console.log('');
  console.log('  Open site/index.html directly, or point any local server at site/.');
  console.log('  Works from file://, any IDE root, and any deploy path.\n');
}

main().catch((e) => { console.error(e); process.exit(1); });
