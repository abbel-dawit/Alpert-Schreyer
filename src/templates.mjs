/**
 * src/templates.mjs
 * ---------------------------------------------------------------------------
 * Layout + components. Every page is assembled from these, so the header,
 * footer, review sheet and forms exist exactly once in the codebase.
 *
 * All internal links are ROOT-RELATIVE (/about-our-firm/). This site does not
 * depend on the WordPress install for anything except image assets, which are
 * absolute by design until they're migrated — see TECHNICAL-MANUAL §8.3.
 */

import { firm, offices, attorneys, practiceAreas, duiPages, areaPages, consentText, disclaimer, aboutBlurb, areasBlurb } from './content.mjs';

export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* ---------- icons ---------- */
export const icon = {
  phone: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.4 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.4 1.8.6 2.8.8a2 2 0 0 1 1.7 2Z"/></svg>`,
  chev: `<svg class="chev" viewBox="0 0 10 6" aria-hidden="true"><path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>`,
  arrow: `<svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M1 6h9M6.5 2.5 10 6l-3.5 3.5"/></svg>`,
  star: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 2 15 8.9l7.1.6-5.4 4.7 1.6 7-6.3-3.8-6.3 3.8 1.6-7L2 9.5l7.1-.6Z"/></svg>`,
  pin: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
  // Full-colour Google G, for use INSIDE a light button. This is Google's
  // mark — keep the official four colours; do not recolour it to match the
  // site. Brand guidelines require it be used unaltered.
  googleG: `<svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true"><path fill="#4285F4" d="M45.1 24.5c0-1.6-.1-3.2-.4-4.7H24v8.9h11.8a10.1 10.1 0 0 1-4.4 6.6v5.5h7.1c4.2-3.8 6.6-9.5 6.6-16.3Z"/><path fill="#34A853" d="M24 46c6 0 11-2 14.6-5.3l-7.1-5.5a13.1 13.1 0 0 1-19.5-6.9H4.6v5.7A22 22 0 0 0 24 46Z"/><path fill="#FBBC05" d="M12 28.3a13 13 0 0 1 0-8.3v-5.7H4.6a22 22 0 0 0 0 19.7l7.4-5.7Z"/><path fill="#EA4335" d="M24 10.8c3.3 0 6.2 1.1 8.5 3.3l6.3-6.3A21.9 21.9 0 0 0 4.6 14.3L12 20a13.1 13.1 0 0 1 12-9.2Z"/></svg>`,
  google: `<svg viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3A12 12 0 1 1 24 12a11.9 11.9 0 0 1 7.9 3l5.7-5.7A20 20 0 1 0 24 44a20 20 0 0 0 19.6-23.9Z"/><path fill="#FF3D00" d="m6.3 14.7 6.6 4.8A11.9 11.9 0 0 1 24 12a11.9 11.9 0 0 1 7.9 3l5.7-5.7A20 20 0 0 0 6.3 14.7Z"/><path fill="#4CAF50" d="M24 44a20 20 0 0 0 13.5-5.2l-6.2-5.3A11.9 11.9 0 0 1 12.7 28l-6.6 5A20 20 0 0 0 24 44Z"/><path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3a12 12 0 0 1-4.1 5.5l6.2 5.3A19.9 19.9 0 0 0 43.6 20.1Z"/></svg>`,
};

/* ---------- navigation model — one source of truth ---------- */
export const navTree = [
  { label: 'About', items: [
    { t: 'About Our Firm', h: '/about-our-firm/' },
    { t: 'Awards & Recognition', h: '/about-our-firm/awards-recognition/' },
    { t: 'Case Results', h: '/about-our-firm/case-results/' },
    { t: 'Our Attorneys', h: '/about-our-firm/our-attorneys/' },
    { t: 'Testimonials', h: '/about-our-firm/testimonials/' },
    { t: 'Reviews', h: '/reviews/' },
  ]},
  { label: 'Personal Injury', items: [
    { t: 'Dog Bites', h: '/practice-areas/dog-bites/' },
    { t: 'Premises Liability', h: '/practice-areas/premises-liability/' },
    { t: 'Construction Accidents', h: '/practice-areas/construction-accidents/' },
    { t: 'Slip and Fall', h: '/practice-areas/slip-and-fall/' },
    { t: "Workers' Compensation", h: '/practice-areas/workers-compensation/' },
    { t: 'View All +', h: '/practice-areas/', all: true },
  ]},
  { label: 'Motor Vehicle', items: [
    { t: 'Car Accidents', h: '/practice-areas/car-accidents/' },
    { t: 'Truck Accidents', h: '/practice-areas/truck-accidents/' },
    { t: 'Motorcycle Accidents', h: '/practice-areas/motorcycle-accidents/' },
    { t: 'Semi-Truck Accidents', h: '/practice-areas/semi-truck-accidents/' },
    { t: 'Hit & Run Accidents', h: '/practice-areas/hit-and-run-accidents/' },
    { t: 'Rideshare Accidents', h: '/practice-areas/rideshare-accidents/' },
    { t: 'Multi-Car Accidents', h: '/practice-areas/multi-car-accidents/' },
  ]},
  { label: 'DUI', items: duiPages.map((d) => ({ t: d.name, h: `/dui/${d.slug}/` })) },
  { label: 'Areas Served', items: [
    ...areaPages.slice(0, 4).map((a) => ({ t: a.name, h: `/areas-we-serve/${a.slug}/` })),
    { t: 'View All +', h: '/areas-we-serve/', all: true },
  ]},
  { label: 'Resources', items: [
    { t: 'Personal Injury Resources', h: '/personal-injury-resources/' },
    { t: 'Free Downloads', h: '/personal-injury-resources/free-downloads/' },
    { t: 'Video Center', h: '/personal-injury-resources/video-center/' },
  ]},
];

/* ---------- header ---------- */
const navDesktop = () => navTree.map((g) => `
      <div class="nav__item" data-menu>
        <button class="nav__link" aria-expanded="false" aria-haspopup="true">${esc(g.label)} ${icon.chev}</button>
        <div class="nav__panel" role="group">
          ${g.items.map((i) => `<a href="${i.h}"${i.all ? ' class="is-all"' : ''}>${esc(i.t)}</a>`).join('\n          ')}
        </div>
      </div>`).join('');

export const header = (altHref = '/es/') => `
<div class="utilbar">
  <div class="wrap utilbar__in">
    <div class="utilbar__left">
      <span class="pulse" aria-hidden="true"></span>
      <b>We're here 24/7</b>
      <span class="hide-sm">&mdash; free consultation, 24/7</span>
    </div>
    <div class="utilbar__right">
      <a href="${altHref}" hreflang="es">Espa&ntilde;ol</a>
      <a href="/reviews/">Reviews</a>
      <a href="/contact/">Contact</a>
    </div>
  </div>
</div>

<header class="site-header" id="siteHeader">
  <div class="wrap site-header__in">
    <a class="brand" href="/" aria-label="${esc(firm.name)} — home">
      <img src="${firm.logo}" alt="${esc(firm.name)}" width="220" height="42" fetchpriority="high">
    </a>
    <nav class="nav" aria-label="Main">${navDesktop()}
      <div class="nav__item"><a class="nav__link" href="/contact/">Contact</a></div>
    </nav>
    <div class="header__cta">
      <a class="btn btn--call btn--sm btn--desk" href="${firm.mainPhoneHref}">${icon.phone} ${firm.mainPhone}</a>
      <a class="btn btn--primary btn--sm btn--desk" href="/contact/">Free case review</a>
      <button class="burger" id="burger" aria-expanded="false" aria-controls="drawer" aria-label="Open menu"><span></span></button>
    </div>
  </div>
</header>

<div class="drawer" id="drawer" role="dialog" aria-modal="true" aria-label="Menu" inert>
  <div class="drawer__top">
    <img src="${firm.logo}" alt="" width="170" height="32">
    <button class="drawer__close" id="drawerClose" aria-label="Close menu">&#10005;</button>
  </div>
  <div class="drawer__body">
    ${navTree.map((g) => `<details><summary>${esc(g.label)}</summary><div class="drawer__sub">
      ${g.items.map((i) => `<a href="${i.h}">${esc(i.t)}</a>`).join('\n      ')}
    </div></details>`).join('\n    ')}
    <details><summary>Find Us</summary><div class="drawer__sub">
      ${offices.map((o) => `<a href="${o.maps}" target="_blank" rel="noopener">${esc(o.city)}, MD</a>`).join('\n      ')}
    </div></details>
    <a class="drawer__flat" href="/contact/">Contact Us</a>
    <a class="drawer__flat" href="${altHref}" hreflang="es">Espa&ntilde;ol</a>
    <div class="drawer__foot">
      <a class="btn btn--primary btn--block" href="/contact/" data-drawer-close>Free case review</a>
      <a class="btn btn--call btn--block" href="${firm.mainPhoneHref}">${icon.phone} Call ${firm.mainPhone}</a>
    </div>
  </div>
</div>`;

/* ---------- footer ---------- */
export const footer = (altHref = '/es/') => `
<footer class="foot">
  <div class="wrap">
    <div class="foot__grid">
      <div>
        <img class="foot__logo" src="${firm.logo}" alt="${esc(firm.name)}" width="200" height="38" loading="lazy">
        <h3>About our firm</h3>
        <p>${esc(aboutBlurb)}</p>
        <div class="foot__social">
          <a href="${firm.social.facebook}" target="_blank" rel="noopener" aria-label="Facebook"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M24 12a12 12 0 1 0-13.9 11.9v-8.4H7.1V12h3V9.4c0-3 1.8-4.6 4.5-4.6 1.3 0 2.6.2 2.6.2v2.9h-1.5c-1.5 0-1.9.9-1.9 1.8V12h3.3l-.5 3.5h-2.8v8.4A12 12 0 0 0 24 12Z"/></svg></a>
          <a href="${firm.social.linkedin}" target="_blank" rel="noopener" aria-label="LinkedIn"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 2h-17A1.5 1.5 0 0 0 2 3.5v17A1.5 1.5 0 0 0 3.5 22h17a1.5 1.5 0 0 0 1.5-1.5v-17A1.5 1.5 0 0 0 20.5 2ZM8 19H5v-9h3v9ZM6.5 8.7a1.8 1.8 0 1 1 0-3.5 1.8 1.8 0 0 1 0 3.5ZM19 19h-3v-4.4c0-1-.4-1.8-1.4-1.8s-1.6.8-1.6 1.8V19h-3v-9h2.9v1.2a3.2 3.2 0 0 1 2.8-1.4c2 0 3.3 1.3 3.3 4V19Z"/></svg></a>
          <a href="${firm.social.instagram}" target="_blank" rel="noopener" aria-label="Instagram"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2 0 1.8.3 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c0 1.2-.3 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2 0-1.8-.3-2.2-.4a3.8 3.8 0 0 1-1.4-.9 3.8 3.8 0 0 1-.9-1.4c-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c0-1.2.3-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2Zm0 5.8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm0 6.6a2.6 2.6 0 1 1 0-5.2 2.6 2.6 0 0 1 0 5.2Zm5.1-6.8a.9.9 0 1 1-1.9 0 .9.9 0 0 1 1.9 0Z"/></svg></a>
          <a href="${firm.social.youtube}" target="_blank" rel="noopener" aria-label="YouTube"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M23.5 6.5a3 3 0 0 0-2.1-2.1C19.5 3.9 12 3.9 12 3.9s-7.5 0-9.4.5A3 3 0 0 0 .5 6.5C0 8.4 0 12 0 12s0 3.6.5 5.5a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.5.5-5.5s0-3.6-.5-5.5ZM9.6 15.6V8.4l6.2 3.6-6.2 3.6Z"/></svg></a>
        </div>
      </div>
      <div>
        <h3>Areas we serve</h3>
        <p style="margin-bottom:1.25rem">${esc(areasBlurb)}</p>
        <div class="foot__list"><a href="/areas-we-serve/">View all areas we serve &rarr;</a></div>
      </div>
      <div>
        <h3>Quick links</h3>
        <div class="foot__list">
          <a href="/about-our-firm/">About Our Firm</a>
          <a href="/about-our-firm/our-attorneys/">Our Attorneys</a>
          <a href="/about-our-firm/case-results/">Case Results</a>
          <a href="/about-our-firm/awards-recognition/">Awards &amp; Recognition</a>
          <a href="/about-our-firm/testimonials/">Testimonials</a>
          <a href="/reviews/">Google Reviews</a>
          <a href="/practice-areas/">Practice Areas</a>
          <a href="/personal-injury-resources/">Personal Injury Resources</a>
          <a href="/contact/">Contact Us</a>
          <a href="${altHref}" hreflang="es">Espa&ntilde;ol</a>
        </div>
        <h3 style="margin-top:2rem">Call us</h3>
        <div class="foot__list">
          ${offices.map((o) => `<a href="${o.phoneHref}">${esc(o.city)} &mdash; ${o.phone}</a>`).join('\n          ')}
        </div>
      </div>
    </div>
    <div class="foot__disc"><p>${esc(disclaimer)}</p></div>
    <div class="foot__bar">
      <div class="foot__legal">
        <span>&copy; 2026 ${esc(firm.name)}. All Rights Reserved</span>
        <a href="/privacy-policy/">Privacy Policy</a>
        <a href="/disclaimer/">Disclaimer</a>
        <a href="/sitemap/">Sitemap</a>
        <a href="/llms.txt">Hey AI, learn about us</a>
      </div>
    </div>
  </div>
</footer>

<nav class="actionbar" id="actionbar" aria-label="Quick actions">
  <a href="${firm.mainPhoneHref}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.4 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.4 1.8.6 2.8.8a2 2 0 0 1 1.7 2Z"/></svg>Call</a>
  <a href="${firm.smsHref}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.9 8.9 0 0 1-4-.9L3 21l2-4a8.4 8.4 0 0 1-1-4 8.4 8.4 0 0 1 8.5-8.4h.5A8.4 8.4 0 0 1 21 11v.5Z"/></svg>Text</a>
  <a class="is-primary" href="/contact/"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M9 15h6M9 11h2"/></svg>Free review</a>
</nav>

<div class="toast" id="toast" role="status" aria-live="polite" hidden></div>`;

/* ---------- review sheet ---------- */
export const reviewSheet = () => `
<dialog class="sheet" id="reviewSheet" aria-labelledby="rs-title">
  <div class="sheet__panel">
    <div class="sheet__head">
      <div>
        <h2 id="rs-title">Leave a Google review</h2>
        <p>About 30 seconds. You'll need to be signed in to a Google account.</p>
      </div>
      <button class="sheet__x" data-review-close aria-label="Close">&#10005;</button>
    </div>
    <div class="sheet__body">
      <div>
        <span class="field-label" id="rs-office-label">Which office helped you? <span>Each office has its own Google listing.</span></span>
        <div class="offpick" role="radiogroup" aria-labelledby="rs-office-label">
          ${offices.map((o, i) => `<label class="offpick__opt">
            <input type="radio" name="office" value="${o.key}"${i === 0 ? ' checked' : ''}
                   data-write="https://search.google.com/local/writereview?placeid=PLACE_ID_${o.key.toUpperCase()}"
                   data-fallback="${o.maps}">
            <span><b>${esc(o.city)}</b><small>${esc(o.street)}</small></span>
          </label>`).join('\n          ')}
        </div>
      </div>
      <div>
        <span class="field-label">Not sure what to say? <span>These are just reminders &mdash; write it in your own words.</span></span>
        <div class="chips">
          <span class="chip">Who did you work with?</span>
          <span class="chip">What were you dealing with?</span>
          <span class="chip">How did they keep you informed?</span>
          <span class="chip">What would you tell a friend?</span>
        </div>
        <p class="sheet__hint" style="margin-top:.75rem">Reviews have to be your own honest experience. We can't write it for you, and we'd never want to &mdash; the specific details are what actually help someone decide.</p>
      </div>
      <div>
        <span class="field-label">What happens next</span>
        <ol class="sheet__steps">
          <li>Google opens with our listing and the star box ready.</li>
          <li>Pick your stars, type a sentence or two, tap <b>Post</b>.</li>
          <li>That's it. It appears on our listing &mdash; and here &mdash; within a day or so.</li>
        </ol>
      </div>
      <div class="qr" data-qr-block hidden>
        <div data-qr></div>
        <p>Scan with your phone to finish there instead</p>
      </div>
      <div class="sheet__alt">
        <div>
          <b>Rather tell us privately?</b>
          <p>Send it straight to the managing partner. This is separate from Google &mdash; you can do either, both, or neither.</p>
        </div>
        <a class="btn btn--ghost btn--sm" href="/contact/">Share privately</a>
      </div>
    </div>
    <div class="sheet__foot">
      <a class="btn btn--review btn--block" id="rsGo" href="#" target="_blank" rel="noopener" style="border-color:var(--rule-strong)">
        ${icon.googleG}
        Open the Google review box
      </a>
      <p class="sheet__legal">Opens Google in a new tab. We can't see, edit, or remove what you write &mdash; it's yours.</p>
    </div>
  </div>
</dialog>`;

/* ---------- lead form ---------- */
export const leadForm = (id = 'leadForm', heading = 'Get a free consultation', sub = 'Free consultation. We reply the same business day.') => `
<div class="leadcard" id="consult">
  <div class="leadcard__head">
    <h2>${esc(heading)}</h2>
    <p>${esc(sub)}</p>
  </div>
  <div class="leadcard__body">
    <form class="form" id="${id}" novalidate action="/api/lead" method="post">
      <p class="form__req">* Required</p>
      <div class="hp" aria-hidden="true"><label>Leave this empty<input type="text" name="company" tabindex="-1" autocomplete="off"></label></div>
      <input type="hidden" name="formStart" id="formStart">
      <div class="form__row form__row--2">
        <div class="field">
          <label for="f-name">Name <span class="rq">*</span></label>
          <input class="input" id="f-name" name="name" type="text" autocomplete="name" required>
          <p class="err" data-err-for="f-name" role="alert"></p>
        </div>
        <div class="field">
          <label for="f-phone">Phone <span class="rq">*</span></label>
          <input class="input" id="f-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" required>
          <p class="err" data-err-for="f-phone" role="alert"></p>
        </div>
      </div>
      <div class="form__row form__row--2">
        <div class="field">
          <label for="f-email">Email <span class="rq">*</span></label>
          <input class="input" id="f-email" name="email" type="email" inputmode="email" autocomplete="email" required>
          <p class="err" data-err-for="f-email" role="alert"></p>
        </div>
        <div class="field">
          <label for="f-zip">ZIP Code <span class="rq">*</span></label>
          <input class="input" id="f-zip" name="zip" type="text" inputmode="numeric" autocomplete="postal-code" pattern="[0-9]{5}" maxlength="5" required>
          <p class="err" data-err-for="f-zip" role="alert"></p>
        </div>
      </div>
      <div class="field">
        <label for="f-case">Describe your case <span class="rq">*</span></label>
        <textarea class="textarea" id="f-case" name="case" required placeholder="What happened, and when?"></textarea>
        <p class="err" data-err-for="f-case" role="alert"></p>
      </div>
      <div class="field">
        <label for="f-hear">How did you hear about us?</label>
        <select class="select" id="f-hear" name="hear">
          <option value="">Select one</option>
          <option>Google</option><option>AI Search</option><option>Social Media</option>
          <option>YouTube</option><option>Advertising</option><option>Referral</option>
          <option>Google Business</option><option>Other</option>
        </select>
      </div>
      <div class="field">
        <div class="consent">
          <input type="checkbox" id="f-consent" name="consent" required>
          <label for="f-consent">
            <strong style="color:var(--ink-900)">Consent *</strong> &mdash; ${esc(consentText)}
            <button type="button" class="consent__more" data-consent-toggle aria-expanded="false">Read full terms</button>
            <span class="consent__full" hidden data-consent-full>Message frequency may vary. Message and data rates may apply. Reply STOP to opt out at any time or HELP for assistance. For more information, visit <a href="/">dcmdlaw.com</a>. View our Privacy Policy and Terms of Service at <a href="/privacy-policy/">our privacy policy</a>.</span>
          </label>
        </div>
        <p class="err" data-err-for="f-consent" role="alert"></p>
      </div>
      <button class="btn btn--primary btn--block" type="submit">Request my free review</button>
      <p class="sheet__legal">Contacting us does not create an attorney-client relationship.</p>
    </form>
    <div id="leadOk" class="form__ok" hidden role="status">
      <b>Request received</b>
      <p>A member of our team will call you at the number you provided. If it's urgent, call <a href="${firm.mainPhoneHref}" style="color:var(--crimson);font-weight:600">${firm.mainPhone}</a> &mdash; we answer 24/7.</p>
    </div>
  </div>
</div>`;

/* ---------- reusable blocks ---------- */
export const pageHero = ({ h1, sub, crumbs = [], img }) => `
<section class="phero">
  <div class="phero__bg" aria-hidden="true"><img src="${img || firm.images.interiorHero}" alt="" width="1600" height="700" fetchpriority="high"></div>
  <div class="phero__veil" aria-hidden="true"></div>
  <div class="wrap phero__in">
    ${crumbs.length ? `<nav class="crumbs" aria-label="Breadcrumb">
      <a href="/">Home</a>
      ${crumbs.map((c) => `<span aria-hidden="true">/</span>${c.h ? `<a href="${c.h}">${esc(c.t)}</a>` : `<span>${esc(c.t)}</span>`}`).join('\n      ')}
    </nav>` : ''}
    <h1>${h1}</h1>
    ${sub ? `<p>${esc(sub)}</p>` : ''}
    <div class="btn-row">
      <a class="btn btn--primary" href="/contact/">Free case review</a>
      <a class="btn btn--call" href="${firm.mainPhoneHref}">${icon.phone} ${firm.mainPhone}</a>
    </div>
  </div>
</section>`;

export const ctaBanner = () => `
<section class="section cta">
  <div class="cta__bg" aria-hidden="true"><img src="${firm.images.team2}" alt="" width="1600" height="900" loading="lazy" decoding="async"></div>
  <div class="cta__veil" aria-hidden="true"></div>
  <div class="wrap">
    <div class="cta__in">
      <p class="cta__fee">Free consultation</p>
      <h2>The experience you want <em>on your side.</em></h2>
      <p style="color:rgba(255,255,255,.78)">We're here to help, 24/7.</p>
      <div class="btn-row">
        <a class="btn btn--primary" href="/contact/">Free case review</a>
        <a class="btn btn--call" href="${firm.mainPhoneHref}">${icon.phone} Call ${firm.mainPhone}</a>
      </div>
    </div>
  </div>
</section>`;

/* Immersive testimonial stage — the full-bleed feel of the original site,
   rebuilt as a single lit quote against a veiled photograph. */
export const testimonialStage = (quotes) => `
<section class="tstage" aria-label="Client testimonials" id="tstage">
  <div class="tstage__bg" aria-hidden="true"><img src="${firm.images.duiTeam}" alt="" width="1600" height="900" loading="lazy" decoding="async"></div>
  <div class="tstage__veil" aria-hidden="true"></div>
  <div class="wrap section tstage__in">
    <p class="eyebrow">Client testimonials</p>
    <div class="tstage__quotes" id="tstageQuotes">
      ${quotes.map((q, i) => `<figure class="tslide${i === 0 ? ' is-live' : ''}" data-tslide="${i}"${i === 0 ? '' : ' aria-hidden="true"'}>
        <div class="tslide__mark" aria-hidden="true">&ldquo;</div>
        <blockquote>${esc(q.text)}</blockquote>
        <figcaption class="tslide__by">
          <span class="tslide__av" aria-hidden="true">${esc(q.author.split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase())}</span>
          <span class="tslide__name">${esc(q.author)}</span>
          <span class="stars" data-stars="5" role="img" aria-label="5 out of 5 stars"></span>
        </figcaption>
      </figure>`).join('\n      ')}
    </div>
    <div class="tstage__controls">
      <div class="tstage__dots" role="tablist" aria-label="Choose testimonial">
        ${quotes.map((q, i) => `<button class="tdot" role="tab" aria-selected="${i === 0}" data-tdot="${i}" aria-label="Testimonial ${i + 1}: ${esc(q.author)}"></button>`).join('\n        ')}
      </div>
      <div class="tstage__arrows">
        <button class="tarrow" data-tprev aria-label="Previous testimonial"><svg viewBox="0 0 12 12" aria-hidden="true"><path d="M7.5 2 4 6l3.5 4"/></svg></button>
        <button class="tarrow" data-tnext aria-label="Next testimonial"><svg viewBox="0 0 12 12" aria-hidden="true"><path d="M4.5 2 8 6l-3.5 4"/></svg></button>
      </div>
    </div>
  </div>
</section>`;

export const reviewsSection = () => `
<section class="section reviews" id="reviews" aria-labelledby="reviews-h">
  <div class="wrap">
    <div class="reviews__head rv">
      <div>
        <p class="eyebrow">Google reviews</p>
        <h2 class="h-section" id="reviews-h" style="margin-bottom:1.25rem">What clients say</h2>
        <div class="reviews__score">
          <div class="reviews__big" data-g-rating>&mdash;</div>
          <div class="reviews__meta">
            <span class="stars stars--lg" aria-hidden="true" data-stars="5"></span>
            <p class="reviews__count">Based on <span data-g-count>&mdash;</span> Google reviews &middot; <a href="${firm.reviewsLink}" target="_blank" rel="noopener">See all on Google</a></p>
          </div>
        </div>
      </div>
    </div>
    <div id="reviewNotice"></div>
    <div class="rrail" id="reviewRail" role="tabpanel" aria-labelledby="tab-top" tabindex="0" aria-busy="true">
      ${'<div class="rcard is-skel"><div class="skel" style="height:40px;width:40px;border-radius:50%"></div><div class="skel" style="width:80%"></div><div class="skel"></div><div class="skel" style="width:90%"></div></div>'.repeat(3)}
    </div>
    <div class="reviews__foot rv">
      <a class="gpower" href="${firm.reviewsLink}" target="_blank" rel="noopener">
        ${icon.google} Reviews from Google &middot; updated <span data-g-fresh>daily</span>
      </a>
    </div>
  </div>
</section>`;

export const askBand = () => `
<section class="section section--tight askband" aria-labelledby="ask-h">
  <div class="wrap askband__grid">
    <div>
      <p class="eyebrow">Past clients</p>
      <h2 id="ask-h">Were we there when it mattered? Tell people.</h2>
      <p>A Google review takes about 30 seconds and helps the next injured Marylander decide who to trust. Pick your office, and we'll take you straight to the review box &mdash; no searching, no hunting for the right listing.</p>
    </div>
    <div class="btn-row">
      <button class="btn btn--review" data-review-open>${icon.googleG} Write a Google review</button>
    </div>
  </div>
</section>`;

export const officeCards = (extra = '') => `
<div class="offices rv ${extra}">
  ${offices.map((o) => `<div class="office">
    <div class="office__map">
      <button class="mapfacade" data-map="${o.embed}" data-map-title="Map of the ${esc(o.city)} office">
        <span>${icon.pin} Load map</span>
      </button>
    </div>
    <div class="office__body">
      <div class="office__name">${esc(o.name)}</div>
      <a class="office__addr" href="${o.maps}" target="_blank" rel="noopener">${esc(o.addr)}</a>
      <div class="office__links">
        <a href="${o.phoneHref}">${o.phone}</a>
        <a href="${o.maps}" target="_blank" rel="noopener">Directions</a>
      </div>
    </div>
  </div>`).join('\n  ')}
</div>`;

export const faqBlock = (faqs) => `
<div class="faq rv">
  ${faqs.map((f) => `<details>
    <summary>${esc(f.q)} <span class="faq__ico" aria-hidden="true"></span></summary>
    <div class="faq__a">${f.a}</div>
  </details>`).join('\n  ')}
</div>`;

/* ---------- JSON-LD ---------- */
export const ldLegalService = () => JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'LegalService',
  name: firm.name,
  url: firm.domain + '/',
  image: firm.ogImage,
  description: "Personal injury attorneys serving Prince George's County, Charles County, Anne Arundel County, St. Mary's County, & surrounding areas.",
  areaServed: 'Maryland',
  priceRange: 'Contingency fee',
  sameAs: [firm.social.facebook, firm.social.instagram, firm.social.youtube],
  location: offices.map((o) => ({
    '@type': 'Place', name: o.name,
    address: { '@type': 'PostalAddress', streetAddress: o.street, addressLocality: o.locality, addressRegion: o.region, postalCode: o.zip, addressCountry: 'US' },
    telephone: '+1-' + o.phone.replace(/\D/g, ''),
  })),
});

export const ldFaq = (faqs) => JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.aText } })),
});

export const ldBreadcrumbs = (crumbs, pageTitle) => JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: firm.domain + '/' },
    ...crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 2, name: c.t, ...(c.h ? { item: firm.domain + c.h } : {}) })),
  ],
});

export const ldAttorney = (a) => JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'Attorney',
  name: a.name,
  jobTitle: a.role,
  image: a.photo,
  url: `${firm.domain}/about-our-firm/our-attorneys/${a.slug}/`,
  worksFor: { '@type': 'LegalService', name: firm.name, url: firm.domain + '/' },
  telephone: '+13019329997',
  areaServed: 'Maryland',
});

/* ---------- page shell ---------- */
export const layout = ({ title, desc, path, body, ld = [], bodyClass = '', alt = null }) => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<script>document.documentElement.className+=' js'</script>
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${firm.domain}${path}">
${alt ? `<link rel="alternate" hreflang="es" href="${firm.domain}${alt}">
<link rel="alternate" hreflang="en" href="${firm.domain}${path}">
<link rel="alternate" hreflang="x-default" href="${firm.domain}${path}">` : ''}
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
<meta name="theme-color" content="#0E1A22">
<meta name="color-scheme" content="light">
<meta property="og:locale" content="en_US">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(firm.name)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${firm.domain}${path}">
<meta property="og:image" content="${firm.ogImage}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/assets/favicon/favicon.ico" sizes="any">
<link rel="icon" href="/assets/favicon/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/assets/favicon/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">

<!-- Self-hosted fonts. No external request. Falls back to system fonts until
     \`npm run fonts:vendor\` populates the woff2 files. See TECHNICAL-MANUAL §4. -->
<link rel="stylesheet" href="/assets/fonts/fonts.css">
<link rel="stylesheet" href="/assets/css/site.css">
${ld.map((j) => `<script type="application/ld+json">${j}</script>`).join('\n')}
</head>
<body${bodyClass ? ` class="${bodyClass}"` : ''}>
<a class="skip" href="#main">Skip to main content</a>
${header(alt || '/es/')}
<main id="main">
${body}
</main>
<button class="totop" id="toTop" type="button" aria-label="Back to top" hidden>
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
</button>
${reviewSheet()}
${footer(alt || '/es/')}
<script src="/assets/js/app.js" defer></script>
</body>
</html>
`;

/* ---------------------------------------------------------------------------
   SPLIT — prose with a figure alongside.
   Text sections were running to a 68ch measure inside a 1240px wrap, leaving a
   dead column on the right at desktop. This pairs the prose with something
   worth looking at instead of padding it out with longer line lengths, which
   would hurt readability.
   --------------------------------------------------------------------------- */
export const splitFigure = (img, cap, sticky = false) => `
<figure class="split__fig${sticky ? ' split__fig--sticky' : ''} rv">
  <img src="${img}" alt="" width="800" height="1000" loading="lazy" decoding="async">
  ${cap ? `<figcaption class="split__cap"><b>${cap.n}</b><span>${esc(cap.l)}</span></figcaption>` : ''}
</figure>`;

export const reasonsGrid = (items, wide = false) => `
<div class="reasons${wide ? ' reasons--wide' : ''} rv">
  ${items.map((r) => `<div class="reason">
    <img src="${r.icon}" alt="" width="30" height="30" loading="lazy" decoding="async">
    <h3>${esc(r.h)}</h3>
    <p>${esc(r.p)}</p>
  </div>`).join('\n  ')}
</div>`;

/* Video facade — a poster + play button. The real iframe is only inserted on
   click, so youtube-nocookie never sees a visitor who didn't ask to watch. */
export const videoFacade = (id, title) => `
<button class="vfacade rv" data-video="${esc(id)}" data-video-title="${esc(title)}">
  <img src="https://i.ytimg.com/vi/${esc(id)}/maxresdefault.jpg" alt="" width="1280" height="720" loading="lazy" decoding="async">
  <span class="vfacade__play"><span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg></span></span>
  <span class="vfacade__cap">${esc(title)}</span>
</button>`;


/* Wide captioned photograph for full-width sections. */
export const band = (img, { h, p, stat } = {}) => `
<figure class="band rv">
  <img src="${img}" alt="" width="1600" height="686" loading="lazy" decoding="async">
  ${h || p ? `<figcaption class="band__cap">
    ${h ? `<b>${esc(h)}</b>` : ''}
    ${p ? `<span>${esc(p)}</span>` : ''}
  </figcaption>` : ''}
  ${stat ? `<div class="band__stat"><b>${esc(stat.n)}</b><span>${esc(stat.l)}</span></div>` : ''}
</figure>`;

/* Grayscale overview map of all offices, behind a click-to-load facade. The
   embed URL centres Maryland and is grayscaled by CSS; it colours on hover. */
export const overviewMap = () => {
  const q = encodeURIComponent("Alpert Schreyer Personal Injury Lawyers Maryland");
  const src = `https://www.google.com/maps?q=${q}&z=8&output=embed`;
  return `
<div class="omap rv">
  <button class="omap__facade" data-map="${src}" data-map-title="Map of all four Alpert Schreyer offices">
    <img src="${firm.images.interiorHero}" alt="" width="1600" height="686" loading="lazy" decoding="async">
    <span>${icon.pin} Load office map</span>
  </button>
</div>`;
};
