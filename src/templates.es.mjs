/**
 * src/templates.es.mjs
 * ---------------------------------------------------------------------------
 * Spanish shell: header, footer, form, review sheet and page layout.
 *
 * Deliberately a separate file rather than a `lang` flag threaded through every
 * English template. The Spanish site has a different information architecture —
 * fewer practice areas, no DUI county pages, no blog — because that is what the
 * firm actually publishes in Spanish. Pretending the two trees are identical
 * and toggling labels would mean generating Spanish pages for content that does
 * not exist in Spanish, which is worse than not having them.
 */

import { firm, offices, attorneys } from './content.mjs';
import { es } from './content.es.mjs';
import { esc, icon } from './templates.mjs';

const P = firm.mainPhoneHref;

export const esHeader = (altHref = '/') => `
<div class="utilbar">
  <div class="wrap utilbar__in">
    <div class="utilbar__left">
      <span class="pulse" aria-hidden="true"></span>
      <b>${es.ui.open247}</b>
      <span class="hide-sm">${es.ui.open247sub}</span>
    </div>
    <div class="utilbar__right">
      <a href="${altHref}" hreflang="en">English</a>
      <a href="/es/contacto/">${es.ui.contact}</a>
    </div>
  </div>
</div>

<header class="site-header" id="siteHeader">
  <div class="wrap site-header__in">
    <a class="brand" href="/es/" aria-label="${esc(firm.name)}">
      <img src="${firm.logo}" alt="${esc(firm.name)}" width="220" height="42" fetchpriority="high">
    </a>
    <nav class="nav" aria-label="Principal">
      ${es.nav.map((g) => `<div class="nav__item" data-menu>
        <button class="nav__link" aria-expanded="false" aria-haspopup="true">${esc(g.label)} ${icon.chev}</button>
        <div class="nav__panel" role="group">
          ${g.items.map((i) => `<a href="${i.h}"${i.all ? ' class="is-all"' : ''}>${esc(i.t)}</a>`).join('\n          ')}
        </div>
      </div>`).join('')}
      <div class="nav__item"><a class="nav__link" href="/es/contacto/">${es.ui.contact}</a></div>
    </nav>
    <div class="header__cta">
      <a class="btn btn--call btn--sm btn--desk" href="${P}">${icon.phone} ${firm.mainPhone}</a>
      <a class="btn btn--primary btn--sm btn--desk" href="/es/contacto/">${es.ui.freeConsult}</a>
      <button class="burger" id="burger" aria-expanded="false" aria-controls="drawer" aria-label="Abrir menú"><span></span></button>
    </div>
  </div>
</header>

<div class="drawer" id="drawer" role="dialog" aria-modal="true" aria-label="Menú" inert>
  <div class="drawer__top">
    <img src="${firm.logo}" alt="" width="170" height="32">
    <button class="drawer__close" id="drawerClose" aria-label="Cerrar menú">&#10005;</button>
  </div>
  <div class="drawer__body">
    ${es.nav.map((g) => `<details><summary>${esc(g.label)}</summary><div class="drawer__sub">
      ${g.items.map((i) => `<a href="${i.h}">${esc(i.t)}</a>`).join('\n      ')}
    </div></details>`).join('\n    ')}
    <a class="drawer__flat" href="/es/contacto/">${es.ui.contact}</a>
    <a class="drawer__flat" href="${altHref}" hreflang="en">English</a>
    <div class="drawer__foot">
      <a class="btn btn--primary btn--block" href="/es/contacto/" data-drawer-close>${es.ui.freeConsult}</a>
      <a class="btn btn--call btn--block" href="${P}">${icon.phone} ${firm.mainPhone}</a>
    </div>
  </div>
</div>`;

export const esFooter = () => `
<footer class="foot">
  <div class="wrap">
    <div class="foot__grid">
      <div>
        <img class="foot__logo" src="${firm.logo}" alt="${esc(firm.name)}" width="200" height="38" loading="lazy">
        <h3>${es.footer.about}</h3>
        <p>${esc(es.aboutBlurb)}</p>
        <div class="foot__social">
          <a href="${firm.social.facebook}" target="_blank" rel="noopener" aria-label="Facebook"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M24 12a12 12 0 1 0-13.9 11.9v-8.4H7.1V12h3V9.4c0-3 1.8-4.6 4.5-4.6 1.3 0 2.6.2 2.6.2v2.9h-1.5c-1.5 0-1.9.9-1.9 1.8V12h3.3l-.5 3.5h-2.8v8.4A12 12 0 0 0 24 12Z"/></svg></a>
          <a href="${firm.social.instagram}" target="_blank" rel="noopener" aria-label="Instagram"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2 0 1.8.3 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c0 1.2-.3 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2 0-1.8-.3-2.2-.4a3.8 3.8 0 0 1-1.4-.9 3.8 3.8 0 0 1-.9-1.4c-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c0-1.2.3-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2Zm0 5.8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm0 6.6a2.6 2.6 0 1 1 0-5.2 2.6 2.6 0 0 1 0 5.2Zm5.1-6.8a.9.9 0 1 1-1.9 0 .9.9 0 0 1 1.9 0Z"/></svg></a>
          <a href="${firm.social.youtube}" target="_blank" rel="noopener" aria-label="YouTube"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M23.5 6.5a3 3 0 0 0-2.1-2.1C19.5 3.9 12 3.9 12 3.9s-7.5 0-9.4.5A3 3 0 0 0 .5 6.5C0 8.4 0 12 0 12s0 3.6.5 5.5a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.5.5-5.5s0-3.6-.5-5.5ZM9.6 15.6V8.4l6.2 3.6-6.2 3.6Z"/></svg></a>
        </div>
      </div>
      <div>
        <h3>${es.footer.areas}</h3>
        <p style="margin-bottom:1.25rem">${esc(es.areasBlurb)}</p>
        <div class="foot__list">
          ${es.areaPages.map((a) => `<a href="/es/areas-de-servicio/${a.slug}/">${esc(a.name)}</a>`).join('\n          ')}
        </div>
      </div>
      <div>
        <h3>${es.footer.quick}</h3>
        <div class="foot__list">
          <a href="/es/sobre-nosotros/">${es.nav[0].items[0].t}</a>
          <a href="/es/resultados-de-casos/">${es.nav[0].items[1].t}</a>
          <a href="/es/nuestros-abogados/">${es.nav[0].items[2].t}</a>
          <a href="/es/testimonios/">${es.nav[0].items[3].t}</a>
          <a href="/es/areas-de-practica/">Áreas de Práctica</a>
          <a href="/es/contacto/">${es.ui.contact}</a>
          <a href="/" hreflang="en">English</a>
        </div>
        <h3 style="margin-top:2rem">${es.footer.call}</h3>
        <div class="foot__list">
          ${offices.map((o) => `<a href="${o.phoneHref}">${esc(o.city)} &mdash; ${o.phone}</a>`).join('\n          ')}
        </div>
      </div>
    </div>
    <div class="foot__disc"><p>${esc(es.disclaimer)}</p></div>
    <div class="foot__bar">
      <div class="foot__legal">
        <span>&copy; 2026 ${esc(firm.name)}. ${es.footer.rights}</span>
        <a href="/privacy-policy/">${es.footer.privacy}</a>
        <a href="/disclaimer/">${es.footer.disclaimer}</a>
      </div>
    </div>
  </div>
</footer>

<nav class="actionbar" id="actionbar" aria-label="Acciones rápidas">
  <a href="${P}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.4 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.4 1.8.6 2.8.8a2 2 0 0 1 1.7 2Z"/></svg>${es.ui.call}</a>
  <a href="${firm.smsHref}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.9 8.9 0 0 1-4-.9L3 21l2-4a8.4 8.4 0 0 1-1-4 8.4 8.4 0 0 1 8.5-8.4h.5A8.4 8.4 0 0 1 21 11v.5Z"/></svg>${es.ui.text}</a>
  <a class="is-primary" href="/es/contacto/"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M9 15h6M9 11h2"/></svg>${es.ui.freeConsult}</a>
</nav>

<div class="toast" id="toast" role="status" aria-live="polite" hidden></div>`;

export const esLeadForm = () => `
<div class="leadcard" id="consult">
  <div class="leadcard__head">
    <h2>${es.form.heading}</h2>
    <p>${es.form.sub}</p>
  </div>
  <div class="leadcard__body">
    <form class="form" id="leadForm" novalidate action="/api/lead" method="post" data-lang="es">
      <p class="form__req">${es.ui.required}</p>
      <div class="hp" aria-hidden="true"><label>Deja esto vacío<input type="text" name="company" tabindex="-1" autocomplete="off"></label></div>
      <input type="hidden" name="formStart" id="formStart">
      <input type="hidden" name="lang" value="es">
      <div class="form__row form__row--2">
        <div class="field">
          <label for="f-name">${es.form.name} <span class="rq">*</span></label>
          <input class="input" id="f-name" name="name" type="text" autocomplete="name" required>
          <p class="err" data-err-for="f-name" role="alert"></p>
        </div>
        <div class="field">
          <label for="f-phone">${es.form.phone} <span class="rq">*</span></label>
          <input class="input" id="f-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" required>
          <p class="err" data-err-for="f-phone" role="alert"></p>
        </div>
      </div>
      <div class="form__row form__row--2">
        <div class="field">
          <label for="f-email">${es.form.email} <span class="rq">*</span></label>
          <input class="input" id="f-email" name="email" type="email" inputmode="email" autocomplete="email" required>
          <p class="err" data-err-for="f-email" role="alert"></p>
        </div>
        <div class="field">
          <label for="f-zip">${es.form.zip} <span class="rq">*</span></label>
          <input class="input" id="f-zip" name="zip" type="text" inputmode="numeric" autocomplete="postal-code" pattern="[0-9]{5}" maxlength="5" required>
          <p class="err" data-err-for="f-zip" role="alert"></p>
        </div>
      </div>
      <div class="field">
        <label for="f-case">${es.form.case} <span class="rq">*</span></label>
        <textarea class="textarea" id="f-case" name="case" required placeholder="${es.form.casePh}"></textarea>
        <p class="err" data-err-for="f-case" role="alert"></p>
      </div>
      <div class="field">
        <div class="consent">
          <input type="checkbox" id="f-consent" name="consent" required>
          <label for="f-consent">
            <strong style="color:var(--ink-900)">${es.form.consent} *</strong> &mdash; ${esc(es.consentText)}
            <span class="consent__full" hidden data-consent-full>Para obtener asistencia, envía HELP por mensaje de texto o visita <a href="/es/">dcmdlaw.com</a>. Visita nuestra <a href="/privacy-policy/">Política de Privacidad</a> y Términos de Servicio.</span>
          </label>
        </div>
        <p class="err" data-err-for="f-consent" role="alert"></p>
      </div>
      <button class="btn btn--primary btn--block" type="submit">${es.form.submit}</button>
      <p class="sheet__legal">${es.form.noRel}</p>
    </form>
    <div id="leadOk" class="form__ok" hidden role="status">
      <b>${es.form.okB}</b>
      <p>${es.form.okP} <a href="${P}" style="color:var(--crimson);font-weight:600">${firm.mainPhone}</a>.</p>
    </div>
  </div>
</div>`;

export const esLayout = ({ title, desc, path, body, ld = [], alt = '/' }) => `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<script>document.documentElement.className+=' js'</script>
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${firm.domain}${path}">
<link rel="alternate" hreflang="en" href="${firm.domain}${alt}">
<link rel="alternate" hreflang="es" href="${firm.domain}${path}">
<link rel="alternate" hreflang="x-default" href="${firm.domain}${alt}">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta name="theme-color" content="#0E1A22">
<meta property="og:locale" content="es_US">
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
<!-- Self-hosted fonts — no external request; system fallback until vendored. -->
<link rel="stylesheet" href="/assets/fonts/fonts.css">
<link rel="stylesheet" href="/assets/css/site.css">
${ld.map((j) => `<script type="application/ld+json">${j}</script>`).join('\n')}
</head>
<body>
<a class="skip" href="#main">Saltar al contenido</a>
${esHeader(alt)}
<main id="main">
${body}
</main>
<button class="totop" id="toTop" type="button" aria-label="Volver arriba" hidden>
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
</button>
${esFooter()}
<script src="/assets/js/app.js" defer></script>
</body>
</html>
`;
