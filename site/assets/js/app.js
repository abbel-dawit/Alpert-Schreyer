/* ==========================================================================
   ALPERT SCHREYER — app
   No framework, no dependencies. Everything degrades: with JS off you still
   get every link, the full lead form (native POST), and all page content.
   ========================================================================== */
(function(){
"use strict";

var $  = function(s,c){ return (c||document).querySelector(s); };
var $$ = function(s,c){ return Array.prototype.slice.call((c||document).querySelectorAll(s)); };
var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- toast ---------- */
var toastEl = $('#toast'), toastT;
function toast(msg){
  if(!toastEl) return;
  toastEl.textContent = msg; toastEl.hidden = false;
  requestAnimationFrame(function(){ toastEl.classList.add('is-in'); });
  clearTimeout(toastT);
  toastT = setTimeout(function(){
    toastEl.classList.remove('is-in');
    setTimeout(function(){ toastEl.hidden = true; }, 400);
  }, 3600);
}

/* ---------- stars ---------- */
var STAR = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2 15 8.9l7.1.6-5.4 4.7 1.6 7L12 17.4 5.7 21.2l1.6-7L2 9.5l7.1-.6Z"/></svg>';
function paintStars(el, n){
  n = Math.round(Number(n) || 0);
  var out = '';
  for (var i = 1; i <= 5; i++) out += STAR.replace('<svg', '<svg' + (i > n ? ' data-off' : ''));
  el.innerHTML = out;
  if (n < 5) el.setAttribute('data-empty','');
}
$$('[data-stars]').forEach(function(el){ paintStars(el, el.getAttribute('data-stars')); });

/* ---------- sticky header ---------- */
var header = $('#siteHeader');
var onScrollHeader = function(){
  if (!header) return;
  header.classList.toggle('is-stuck', window.scrollY > 8);
};
onScrollHeader();
window.addEventListener('scroll', onScrollHeader, {passive:true});

/* ---------- desktop mega menus ---------- */
var menus = $$('[data-menu]');
function closeMenus(except){
  menus.forEach(function(m){
    if (m === except) return;
    m.setAttribute('data-open','false');
    var b = $('.nav__link', m); if (b) b.setAttribute('aria-expanded','false');
  });
}
menus.forEach(function(m){
  var btn = $('.nav__link', m);
  if (!btn) return;
  btn.addEventListener('click', function(e){
    e.stopPropagation();
    var open = m.getAttribute('data-open') === 'true';
    closeMenus(m);
    m.setAttribute('data-open', open ? 'false' : 'true');
    btn.setAttribute('aria-expanded', open ? 'false' : 'true');
  });
  m.addEventListener('mouseenter', function(){
    if (window.matchMedia('(hover:hover)').matches){ closeMenus(m); m.setAttribute('data-open','true'); btn.setAttribute('aria-expanded','true'); }
  });
  m.addEventListener('mouseleave', function(){
    if (window.matchMedia('(hover:hover)').matches){ m.setAttribute('data-open','false'); btn.setAttribute('aria-expanded','false'); }
  });
});
document.addEventListener('click', function(){ closeMenus(); });
document.addEventListener('keydown', function(e){ if (e.key === 'Escape') closeMenus(); });

/* ---------- mobile drawer ---------- */
var drawer = $('#drawer'), burger = $('#burger'), drawerClose = $('#drawerClose');
function setDrawer(open){
  if (!drawer) return;
  drawer.classList.toggle('is-open', open);
  if (open) { drawer.removeAttribute('inert'); } else { drawer.setAttribute('inert',''); }
  burger.setAttribute('aria-expanded', String(open));
  burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  document.body.classList.toggle('is-locked', open);
  if (open) { var f = $('a,button', drawer); if (f) f.focus(); } else { burger.focus(); }
}
if (burger) burger.addEventListener('click', function(){ setDrawer(!drawer.classList.contains('is-open')); });
if (drawerClose) drawerClose.addEventListener('click', function(){ setDrawer(false); });
document.addEventListener('keydown', function(e){ if (e.key === 'Escape' && drawer && drawer.classList.contains('is-open')) setDrawer(false); });
$$('[data-drawer-close]').forEach(function(a){ a.addEventListener('click', function(){ setDrawer(false); }); });

/* ---------- smooth scroll for in-page links ---------- */
$$('[data-scroll]').forEach(function(a){
  a.addEventListener('click', function(e){
    var id = a.getAttribute('href');
    if (!id || id.charAt(0) !== '#') return;
    var t = document.querySelector(id);
    if (!t) return;
    e.preventDefault();
    setDrawer(false);
    t.scrollIntoView({behavior: reduceMotion ? 'auto' : 'smooth', block:'start'});
    var focusable = t.matches('input,select,textarea,a,button') ? t : $('input,select,textarea', t);
    if (focusable) setTimeout(function(){ focusable.focus({preventScroll:true}); }, reduceMotion ? 0 : 620);
  });
});

/* ---------- scroll reveals + gap bar ---------- */
if ('IntersectionObserver' in window && !reduceMotion){
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(en){
      if (!en.isIntersecting) return;
      en.target.classList.add('is-in');
      io.unobserve(en.target);
    });
  }, {rootMargin:'0px 0px -8% 0px', threshold:0.08});
  $$('.rv').forEach(function(el){ io.observe(el); });
  var gb = $('#gapbar'); if (gb) io.observe(gb);
} else {
  $$('.rv').forEach(function(el){ el.classList.add('is-in'); });
  var gb2 = $('#gapbar'); if (gb2) gb2.classList.add('is-in');
}

/* ---------- hero video: opt-in, never on metered or reduced-motion ---------- */
(function(){
  var v = $('#heroVideo');
  if (!v) return;
  var conn = navigator.connection || {};
  var cheap = conn.saveData === true || /2g|slow-2g/.test(conn.effectiveType || '');
  if (reduceMotion || cheap) return;
  var start = function(){
    if (v.dataset.loaded) return;
    v.dataset.loaded = '1';
    v.src = v.getAttribute('data-src');
    v.load();
    var p = v.play();
    if (p && p.catch) p.catch(function(){ /* autoplay refused; poster stands in */ });
    v.addEventListener('playing', function(){ v.classList.add('is-ready'); }, {once:true});
  };
  if ('requestIdleCallback' in window) requestIdleCallback(start, {timeout:2500});
  else window.addEventListener('load', function(){ setTimeout(start, 900); });
})();

/* ---------- maps ----------
   Auto-load: the iframe is inserted on page load so visitors see the map
   immediately without clicking. Uses lazy loading so off-screen maps don't
   fetch until scrolled near. */
function loadMap(btn){
  if (btn.dataset.loaded) return;
  btn.dataset.loaded = '1';
  var f = document.createElement('iframe');
  f.src = btn.getAttribute('data-map');
  f.title = btn.getAttribute('data-map-title') || 'Office map';
  f.loading = 'lazy';
  f.referrerPolicy = 'no-referrer-when-downgrade';
  f.setAttribute('allowfullscreen','');
  btn.parentNode.appendChild(f);
  btn.remove();
}
$$('[data-map]').forEach(function(btn){ loadMap(btn); });

/* ---------- consent expander ---------- */
$$('[data-consent-toggle]').forEach(function(btn){
  btn.addEventListener('click', function(){
    var full = $('[data-consent-full]', btn.parentNode);
    if (!full) return;
    var open = !full.hidden;
    full.hidden = open;
    btn.setAttribute('aria-expanded', String(!open));
    btn.textContent = open ? 'Read full terms' : 'Hide full terms';
  });
});

/* ---------- mobile action bar ---------- */
(function(){
  var bar = $('#actionbar');
  if (!bar) return;
  var last = 0;
  var tick = function(){
    var y = window.scrollY;
    bar.classList.toggle('is-in', y > 420 || y < last);
    last = y;
  };
  tick();
  window.addEventListener('scroll', tick, {passive:true});
})();

/* ==========================================================================
   REVIEW SHEET
   ========================================================================== */
(function(){
  var sheet = $('#reviewSheet');
  if (!sheet || !sheet.showModal) return;
  var go = $('#rsGo');
  var lastFocus = null;

  function currentOffice(){ return $('input[name="office"]:checked', sheet); }

  function syncLink(){
    var o = currentOffice();
    if (!o || !go) return;
    var write = o.getAttribute('data-write');
    // Placeholder Place IDs ship unresolved on purpose — fall back to the
    // office's real Google Maps link so the button is never broken in the
    // interim. Replace PLACE_ID_* per TECHNICAL-MANUAL §6.1.
    var href = /PLACE_ID_/.test(write) ? o.getAttribute('data-fallback') : write;
    go.setAttribute('href', href);
    renderQR(href);
  }

  function open(){
    lastFocus = document.activeElement;
    syncLink();
    sheet.showModal();
    var first = currentOffice();
    if (first) first.focus();
  }
  function close(){ sheet.close(); }

  $$('[data-review-open]').forEach(function(b){ b.addEventListener('click', open); });
  $$('[data-review-close]', sheet).forEach(function(b){ b.addEventListener('click', close); });
  $$('input[name="office"]', sheet).forEach(function(r){ r.addEventListener('change', syncLink); });

  // click on backdrop closes
  sheet.addEventListener('click', function(e){ if (e.target === sheet) close(); });
  sheet.addEventListener('close', function(){ if (lastFocus) lastFocus.focus(); });

  if (go) go.addEventListener('click', function(){
    setTimeout(function(){ close(); toast('Thank you — your review means a lot.'); }, 250);
  });

  /* QR: desktop-only handoff to phone. Inline SVG generator, no library, no
     network — so the site stays fully standalone. */
  function renderQR(text){
    var block = $('[data-qr-block]', sheet);
    var host  = $('[data-qr]', sheet);
    if (!block || !host) return;
    if (window.matchMedia('(pointer:coarse)').matches){ block.hidden = true; return; }
    var svg = qrSvg(text, 150);
    if (svg){ block.hidden = false; host.innerHTML = svg; }
    else { block.hidden = true; } // if generation fails, hide rather than show a broken code
  }
})();

/* ==========================================================================
   GOOGLE REVIEWS — fetch, cache, render
   Data comes from /api/reviews (server-side proxy). The API key never reaches
   the browser. If the endpoint is unavailable we fall back to the bundled
   seed file so the section is never empty or broken.
   ========================================================================== */
(function(){
  var rail = $('#reviewRail');
  var tabs = $('#revTabs');
  if (!rail) return;

  var state = { sort:'top', data:null };

  function initials(name){
    return String(name||'?').trim().split(/\s+/).slice(0,2).map(function(w){ return w.charAt(0); }).join('').toUpperCase();
  }
  function esc(s){
    return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }
  function when(r){
    if (r.relative) return r.relative;
    if (!r.time) return '';
    var d = (Date.now() - new Date(r.time).getTime()) / 86400000;
    if (d < 1)  return 'Today';
    if (d < 30) return Math.round(d) + ' days ago';
    if (d < 365)return Math.round(d/30) + ' months ago';
    return Math.round(d/365) + ' years ago';
  }

  var GLOGO = '<svg viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3A12 12 0 1 1 24 12a11.9 11.9 0 0 1 7.9 3l5.7-5.7A20 20 0 1 0 24 44a20 20 0 0 0 19.6-23.9Z"/><path fill="#FF3D00" d="m6.3 14.7 6.6 4.8A11.9 11.9 0 0 1 24 12a11.9 11.9 0 0 1 7.9 3l5.7-5.7A20 20 0 0 0 6.3 14.7Z"/><path fill="#4CAF50" d="M24 44a20 20 0 0 0 13.5-5.2l-6.2-5.3A11.9 11.9 0 0 1 12.7 28l-6.6 5A20 20 0 0 0 24 44Z"/><path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3a12 12 0 0 1-4.1 5.5l6.2 5.3A19.9 19.9 0 0 0 43.6 20.1Z"/></svg>';

  /* Only claim "Posted on Google" when the record actually came from the
     Places API. The seed file is the firm's own testimonials — labelling
     those as Google reviews would be a false attribution, and it is exactly
     the kind of thing that gets a listing pulled. */
  function srcBadge(r){
    /* Only claim "Posted on Google" when the record actually came from the
       Places API. Demo/testimonial records are labelled as what they are —
       putting a Google logo on a review that isn't from Google is a false
       attribution, and it is exactly what gets a listing pulled. */
    if (r.source === 'demo'){
      return '<span class="rcard__src--demo">Sample \u2014 not from Google</span>'
           + (r.office ? ' &middot; ' + esc(r.office) : '');
    }
    if (r.source === 'testimonial'){
      return 'Client testimonial &middot; ' + esc(r.office || 'Alpert Schreyer');
    }
    return GLOGO + 'Posted on Google' + (r.office ? ' &middot; ' + esc(r.office) : '');
  }

  function card(r){
    var el = document.createElement('article');
    el.className = 'rcard';
    var av = r.photo
      ? '<img class="rcard__av" src="' + esc(r.photo) + '" alt="" width="40" height="40" loading="lazy" referrerpolicy="no-referrer">'
      : '<div class="rcard__av" aria-hidden="true">' + esc(initials(r.author)) + '</div>';
    el.innerHTML =
      '<div class="rcard__top">' + av +
        '<div class="rcard__who">' +
          '<div class="rcard__name">' + esc(r.author) + '</div>' +
          '<div class="rcard__when">' + esc(when(r)) + '</div>' +
        '</div>' +
      '</div>' +
      '<span class="stars" data-stars="' + esc(r.rating) + '" role="img" aria-label="' + esc(r.rating) + ' out of 5 stars"></span>' +
      '<p class="rcard__body is-clamped">' + esc(r.text) + '</p>' +
      '<div class="rcard__src">' + srcBadge(r) + '</div>';
    paintStars($('.stars', el), r.rating);

    // "Read more" only when the text is actually cut off
    var body = $('.rcard__body', el);
    requestAnimationFrame(function(){
      if (body.scrollHeight - body.clientHeight > 4){
        var b = document.createElement('button');
        b.className = 'rcard__more';
        b.type = 'button';
        b.textContent = 'Read more';
        b.addEventListener('click', function(){
          var clamped = body.classList.toggle('is-clamped');
          b.textContent = clamped ? 'Read more' : 'Show less';
        });
        el.insertBefore(b, $('.rcard__src', el));
      }
    });
    return el;
  }

  function render(){
    // Toggle removed — always show top-rated. Fall back to recent, then any.
    var list = (state.data && (state.data.top || state.data.recent)) || [];
    rail.setAttribute('aria-busy','false');
    rail.innerHTML = '';
    if (!list.length){
      rail.innerHTML = '<article class="rcard"><p class="rcard__body">Reviews are loading from Google. '
        + '<a href="https://maps.app.goo.gl/9uhp2Fn8Ci9NxzY49" target="_blank" rel="noopener" style="color:var(--crimson);font-weight:600">Read them on Google</a> in the meantime.</p></article>';
      return;
    }
    list.forEach(function(r){ rail.appendChild(card(r)); });
    rail.scrollTo({left:0, behavior:'auto'});
  }

  function setSummary(d){
    if (!d) return;
    // When the API isn't configured yet the seed file has no aggregate numbers.
    // Don't print an em dash at people — collapse to a plain, true label.
    if (d.rating == null || d.total == null){
      // no aggregate available (unconfigured API, no demo data)
      $$('.grating').forEach(function(el){
        el.innerHTML = '<svg class="grating__g" viewBox="0 0 48 48" aria-hidden="true">'
          + '<path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3A12 12 0 1 1 24 12a11.9 11.9 0 0 1 7.9 3l5.7-5.7A20 20 0 1 0 24 44a20 20 0 0 0 19.6-23.9Z"/>'
          + '<path fill="#FF3D00" d="m6.3 14.7 6.6 4.8A11.9 11.9 0 0 1 24 12a11.9 11.9 0 0 1 7.9 3l5.7-5.7A20 20 0 0 0 6.3 14.7Z"/>'
          + '<path fill="#4CAF50" d="M24 44a20 20 0 0 0 13.5-5.2l-6.2-5.3A11.9 11.9 0 0 1 12.7 28l-6.6 5A20 20 0 0 0 24 44Z"/>'
          + '<path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3a12 12 0 0 1-4.1 5.5l6.2 5.3A19.9 19.9 0 0 0 43.6 20.1Z"/></svg>'
          + '<span class="grating__count" style="color:#fff;font-weight:600">Read our Google reviews</span>';
      });
      var head = $('.reviews__score');
      if (head) head.style.display = 'none';
      return;
    }
    if (d.rating != null){
      $$('[data-g-rating]').forEach(function(el){ el.textContent = Number(d.rating).toFixed(1); });
      $$('[data-stars]').forEach(function(el){
        if (el.closest('.rcard')) return;
        paintStars(el, d.rating);
      });
    }
    if (d.total != null){
      $$('[data-g-count]').forEach(function(el){ el.textContent = Number(d.total).toLocaleString(); });
    }
    if (d.fetchedAt){
      $$('[data-g-fresh]').forEach(function(el){
        el.textContent = new Date(d.fetchedAt).toLocaleDateString(undefined,{month:'short',day:'numeric'});
      });
    }
  }

  /* Tabs */
  if (tabs){
    var thumb = $('.segtabs__thumb', tabs);
    var btns  = $$('.segtabs__btn', tabs);
    function moveThumb(){
      var active = btns.filter(function(b){ return b.getAttribute('aria-selected') === 'true'; })[0] || btns[0];
      if (!thumb || !active) return;
      thumb.style.width = active.offsetWidth + 'px';
      thumb.style.transform = 'translateX(' + (active.offsetLeft - 3) + 'px)';
    }
    btns.forEach(function(b){
      b.addEventListener('click', function(){
        btns.forEach(function(x){ x.setAttribute('aria-selected', String(x === b)); });
        state.sort = b.getAttribute('data-sort');
        rail.setAttribute('aria-labelledby', b.id);
        moveThumb();
        render();
      });
      b.addEventListener('keydown', function(e){
        var i = btns.indexOf(b);
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft'){
          e.preventDefault();
          var n = btns[(i + (e.key === 'ArrowRight' ? 1 : btns.length - 1)) % btns.length];
          n.focus(); n.click();
        }
      });
    });
    requestAnimationFrame(moveThumb);
    window.addEventListener('resize', moveThumb, {passive:true});
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(moveThumb);
  }

  function notice(d){
    var host = $('#reviewNotice');
    if (!host) return;
    if (!d || !d.demo){ host.innerHTML = ''; return; }
    host.innerHTML =
      '<div class="demoflag" role="status">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 9v4M12 17h.01"/>' +
        '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/></svg>' +
        '<span><b>Preview: this is sample data, not live Google reviews.</b>' +
        'This is what the section looks like once the Places API is connected. The words and names are the firm\u2019s own published testimonials standing in for Google data; the dates are placeholders. ' +
        'Set <code>GOOGLE_PLACES_API_KEY</code> and the four <code>PLACE_ID_*</code> values to pull the real thing. See TECHNICAL-MANUAL &sect;6.1.</span>' +
      '</div>';
  }

  function hydrate(d){
    state.data = d;
    notice(d);
    setSummary(d);
    render();
  }

  /* Data resolution, in order of preference:
       1. /api/reviews          — live Google data via the server-side proxy
       2. /data/reviews.sample.json — bundled seed, fetched over HTTP
       3. window.__REVIEWS_SEED__   — inlined by `npm run build:preview`, so the
          preview build works from file:// where fetch() is blocked by CORS
       4. empty                 — rail shows a link to Google rather than breaking */
  function seed(){
    return (typeof window !== 'undefined' && window.__REVIEWS_SEED__) || null;
  }

  fetch('/api/reviews', {headers:{'Accept':'application/json'}})
    .then(function(r){ if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(hydrate)
    .catch(function(){
      return fetch('/data/reviews.sample.json')
        .then(function(r){ if (!r.ok) throw new Error(r.status); return r.json(); })
        .then(hydrate)
        .catch(function(){
          var s = seed();
          hydrate(s || {top:[], recent:[]});
        });
    });
})();

/* ==========================================================================
   LEAD FORM
   Progressive enhancement: without JS the form still posts to /api/lead.
   ========================================================================== */
(function(){
  var form = $('#leadForm');
  if (!form) return;
  var ok = $('#leadOk');
  var started = $('#formStart');
  if (started) started.value = String(Date.now());

  var rules = {
    'f-name':    function(v){ return v.trim().length >= 2 || 'Please enter your name.'; },
    'f-phone':   function(v){ return (v.replace(/\D/g,'').length >= 10) || 'Enter a 10-digit phone number.'; },
    'f-email':   function(v){ return /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(v.trim()) || 'Enter a valid email address.'; },
    'f-zip':     function(v){ return /^\d{5}$/.test(v.trim()) || 'Enter a 5-digit ZIP code.'; },
    'f-case':    function(v){ return v.trim().length >= 10 || 'Tell us briefly what happened.'; },
    'f-consent': function(v, el){ return el.checked || 'Please check the consent box so we can contact you.'; }
  };

  function setErr(id, msg){
    var el = document.getElementById(id);
    var box = $('[data-err-for="' + id + '"]');
    if (box) box.textContent = msg || '';
    if (el && el.type !== 'checkbox') el.setAttribute('aria-invalid', msg ? 'true' : 'false');
  }
  function checkOne(id){
    var el = document.getElementById(id);
    if (!el) return true;
    var res = rules[id](el.value, el);
    setErr(id, res === true ? '' : res);
    return res === true;
  }

  Object.keys(rules).forEach(function(id){
    var el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('blur', function(){ checkOne(id); });
    el.addEventListener('input', function(){ if ($('[data-err-for="' + id + '"]').textContent) checkOne(id); });
    if (el.type === 'checkbox') el.addEventListener('change', function(){ checkOne(id); });
  });

  form.addEventListener('submit', function(e){
    e.preventDefault();
    var bad = Object.keys(rules).filter(function(id){ return !checkOne(id); });
    if (bad.length){
      var first = document.getElementById(bad[0]);
      if (first){ first.focus(); first.scrollIntoView({behavior: reduceMotion?'auto':'smooth', block:'center'}); }
      toast('Please fix the highlighted fields.');
      return;
    }
    var btn = $('button[type="submit"]', form);
    var label = btn.textContent;
    btn.disabled = true; btn.textContent = 'Sending…';

    fetch(form.action, {
      method: 'POST',
      headers: {'Content-Type':'application/json','Accept':'application/json'},
      body: JSON.stringify(Object.fromEntries(new FormData(form).entries()))
    })
    .then(function(r){ if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function(){
      form.hidden = true;
      if (ok){ ok.hidden = false; ok.scrollIntoView({behavior: reduceMotion?'auto':'smooth', block:'center'}); }
      toast('Request sent.');
    })
    .catch(function(){
      btn.disabled = false; btn.textContent = label;
      toast('Something went wrong. Please call (301) 932-9997.');
    });
  });
})();


/* ==========================================================================
   TESTIMONIAL STAGE
   One quote lit at a time. Autoplay pauses on hover, on focus, and whenever
   the tab is hidden — and never starts at all under reduced-motion.
   ========================================================================== */
(function(){
  var stage = $('#tstage');
  if (!stage) return;
  var slides = $$('[data-tslide]', stage);
  var dots   = $$('[data-tdot]', stage);
  if (slides.length < 2) return;

  var i = 0, timer = null, paused = false;
  var DELAY = 7000;

  function show(n){
    i = (n + slides.length) % slides.length;
    slides.forEach(function(s, k){
      var live = k === i;
      s.classList.toggle('is-live', live);
      if (live) s.removeAttribute('aria-hidden'); else s.setAttribute('aria-hidden','true');
    });
    dots.forEach(function(d, k){ d.setAttribute('aria-selected', String(k === i)); });
  }
  function next(){ show(i + 1); }
  function prev(){ show(i - 1); }

  function start(){
    if (reduceMotion || paused || timer) return;
    timer = setInterval(next, DELAY);
  }
  function stop(){ clearInterval(timer); timer = null; }

  dots.forEach(function(d, k){
    d.addEventListener('click', function(){ stop(); show(k); });
  });
  var nx = $('[data-tnext]', stage), pv = $('[data-tprev]', stage);
  if (nx) nx.addEventListener('click', function(){ stop(); next(); });
  if (pv) pv.addEventListener('click', function(){ stop(); prev(); });

  stage.addEventListener('mouseenter', function(){ paused = true; stop(); });
  stage.addEventListener('mouseleave', function(){ paused = false; start(); });
  stage.addEventListener('focusin',  function(){ paused = true; stop(); });
  stage.addEventListener('focusout', function(){ paused = false; start(); });
  document.addEventListener('visibilitychange', function(){
    if (document.hidden) stop(); else start();
  });

  // Keyboard: arrows move between quotes when a dot has focus
  dots.forEach(function(d, k){
    d.addEventListener('keydown', function(e){
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      var n = (k + (e.key === 'ArrowRight' ? 1 : dots.length - 1)) % dots.length;
      stop(); show(n); dots[n].focus();
    });
  });

  // Swipe
  var x0 = null;
  stage.addEventListener('touchstart', function(e){ x0 = e.touches[0].clientX; }, {passive:true});
  stage.addEventListener('touchend', function(e){
    if (x0 === null) return;
    var dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 45){ stop(); dx < 0 ? next() : prev(); }
    x0 = null;
  }, {passive:true});

  show(0);
  start();
})();


/* ==========================================================================
   VIDEO FACADE
   Nothing is requested from YouTube until the visitor presses play. Uses the
   -nocookie host, which the CSP allows in frame-src.
   ========================================================================== */
(function(){
  $$('[data-video]').forEach(function(btn){
    btn.addEventListener('click', function(){
      var id = btn.getAttribute('data-video');
      var title = btn.getAttribute('data-video-title') || 'Video';
      if (!id || btn.dataset.loaded) return;
      btn.dataset.loaded = '1';
      var f = document.createElement('iframe');
      f.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(id) + '?autoplay=1&rel=0';
      f.title = title;
      f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      f.allowFullscreen = true;
      f.loading = 'lazy';
      btn.innerHTML = '';
      btn.appendChild(f);
    });
  });
})();

})();

/* ==========================================================================
   INLINE QR (byte mode, versions 1–10, ECC level M). No dependency, no
   network. Correct RS coding, masking, and format info — validated against
   known vectors. Used only for the desktop review-sheet phone handoff; if it
   ever fails it returns null and the caller hides the block.
   ========================================================================== */
function qrSvg(text, px){
  try {
    var m = qrMatrix(text); if (!m) return null;
    var n = m.length, quiet = 4, total = n + quiet*2, scale = px/total;
    var rects = '';
    for (var r=0;r<n;r++) for (var c=0;c<n;c++) if (m[r][c])
      rects += '<rect x="'+((c+quiet)*scale).toFixed(2)+'" y="'+((r+quiet)*scale).toFixed(2)+'" width="'+scale.toFixed(2)+'" height="'+scale.toFixed(2)+'"/>';
    return '<svg width="'+px+'" height="'+px+'" viewBox="0 0 '+px+' '+px+'" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="QR code to the Google review box">'
      + '<rect width="'+px+'" height="'+px+'" fill="#fff"/><g fill="#0E1A22">'+rects+'</g></svg>';
  } catch(e){ return null; }
}
var qrMatrix = (function(){
  var EXP=new Array(512), LOG=new Array(256);
  for(var i=0,x=1;i<255;i++){ EXP[i]=x; LOG[x]=i; x<<=1; if(x&256)x^=285; }
  for(i=255;i<512;i++) EXP[i]=EXP[i-255];
  function mul(a,b){ return (a===0||b===0)?0:EXP[LOG[a]+LOG[b]]; }
  function rsGen(n){ var g=[1]; for(var i=0;i<n;i++){ var ng=new Array(g.length+1).fill(0); for(var j=0;j<g.length;j++){ ng[j]^=mul(g[j],EXP[i]); ng[j+1]^=g[j]; } g=ng; } return g; }
  function rsEnc(data,n){ var res=new Array(n).fill(0); var g=rsGen(n);
    for(var i=0;i<data.length;i++){ var f=data[i]^res[0]; res.shift(); res.push(0); if(f) for(var j=0;j<n;j++) res[j]^=mul(g[j],f); } return res; }
  // capacity (data codewords) and ecc-per-block for level M, versions 1..10, single or dual block groups
  // [version]: {ec: eccPerBlock, groups:[[numBlocks, dataCwPerBlock],...]}
  var SPEC = {
    1:{ec:10,g:[[1,16]]}, 2:{ec:16,g:[[1,28]]}, 3:{ec:26,g:[[1,44]]},
    4:{ec:18,g:[[2,32]]}, 5:{ec:24,g:[[2,43]]},
    6:{ec:16,g:[[4,27]]}, 7:{ec:18,g:[[4,31]]},
    8:{ec:22,g:[[2,38],[2,39]]}, 9:{ec:22,g:[[3,36],[2,37]]},
    10:{ec:26,g:[[4,43],[1,44]]}
  };
  var ALIGN = {1:[],2:[6,18],3:[6,22],4:[6,26],5:[6,30],6:[6,34],7:[6,22,38],8:[6,24,42],9:[6,26,46],10:[6,28,50]};
  function pickVersion(len){ for(var v=1;v<=10;v++){ var s=SPEC[v]; var cap=0; s.g.forEach(function(gr){cap+=gr[0]*gr[1];}); var lenBits=(v<10)?8:16; var need=4+lenBits+len*8; if(Math.ceil(need/8)+ (v<10?0:0) <= cap) return v; } return null; }
  return function(text){
    var bytes=[]; for(var i=0;i<text.length;i++){ var c=text.charCodeAt(i); if(c<256) bytes.push(c); else { bytes.push(0x3F); } }
    var ver=pickVersion(bytes.length); if(!ver) return null;
    var spec=SPEC[ver], size=17+ver*4;
    var lenBits=(ver<10)?8:16;
    var bits=[]; function pb(v,n){ for(var i=n-1;i>=0;i--) bits.push((v>>i)&1); }
    pb(4,4); pb(bytes.length,lenBits); for(i=0;i<bytes.length;i++) pb(bytes[i],8);
    var cap=0; spec.g.forEach(function(gr){cap+=gr[0]*gr[1];});
    var termMax=cap*8; if(bits.length+4<=termMax) pb(0,4); else while(bits.length<termMax) bits.push(0);
    while(bits.length%8) bits.push(0);
    var dcw=[]; for(i=0;i<bits.length;i+=8){ var b=0; for(var j=0;j<8;j++) b=(b<<1)|bits[i+j]; dcw.push(b); }
    var pad=[236,17],pi=0; while(dcw.length<cap) dcw.push(pad[pi++%2]);
    // split into blocks
    var blocks=[],idx=0; spec.g.forEach(function(gr){ for(var b=0;b<gr[0];b++){ var d=dcw.slice(idx,idx+gr[1]); idx+=gr[1]; blocks.push({d:d,e:rsEnc(d,spec.ec)}); } });
    // interleave
    var maxD=Math.max.apply(null,blocks.map(function(b){return b.d.length;}));
    var final=[];
    for(i=0;i<maxD;i++) blocks.forEach(function(b){ if(i<b.d.length) final.push(b.d[i]); });
    for(i=0;i<spec.ec;i++) blocks.forEach(function(b){ final.push(b.e[i]); });
    // matrix
    var m=[],res=[]; for(var r=0;r<size;r++){ m.push(new Array(size).fill(null)); res.push(new Array(size).fill(false)); }
    function fp(r,c){ for(var i=-1;i<=7;i++)for(var j=-1;j<=7;j++){ var rr=r+i,cc=c+j; if(rr<0||cc<0||rr>=size||cc>=size)continue;
      var on=(i>=0&&i<=6&&(j===0||j===6))||(j>=0&&j<=6&&(i===0||i===6))||(i>=2&&i<=4&&j>=2&&j<=4); m[rr][cc]=on?1:0; res[rr][cc]=true; } }
    fp(0,0); fp(0,size-7); fp(size-7,0);
    // timing
    for(i=8;i<size-8;i++){ var t=(i%2===0)?1:0; if(m[6][i]===null){m[6][i]=t;res[6][i]=true;} if(m[i][6]===null){m[i][6]=t;res[i][6]=true;} }
    // alignment
    var ap=ALIGN[ver];
    for(var a=0;a<ap.length;a++)for(var b2=0;b2<ap.length;b2++){ var ar=ap[a],ac=ap[b2]; if(res[ar][ac])continue;
      for(i=-2;i<=2;i++)for(j=-2;j<=2;j++){ var on=Math.max(Math.abs(i),Math.abs(j))!==1; m[ar+i][ac+j]=on?1:0; res[ar+i][ac+j]=true; } }
    // dark module + format reserve
    m[size-8][8]=1; res[size-8][8]=true;
    for(i=0;i<9;i++){ if(!res[8][i]){res[8][i]=true;m[8][i]=0;} if(!res[i][8]){res[i][8]=true;m[i][8]=0;} }
    for(i=0;i<8;i++){ if(!res[8][size-1-i]){res[8][size-1-i]=true;m[8][size-1-i]=0;} if(!res[size-1-i][8]){res[size-1-i][8]=true;m[size-1-i][8]=0;} }
    // place data with mask 0
    var dir=-1,row=size-1,bi=0;
    for(var col=size-1;col>0;col-=2){ if(col===6)col--;
      for(;;){ for(var c2=0;c2<2;c2++){ var cc=col-c2; if(!res[row][cc]){ var v=0; if(bi<final.length*8) v=(final[bi>>3]>>(7-(bi&7)))&1; bi++; if((row+cc)%2===0) v^=1; m[row][cc]=v; res[row][cc]=true; } }
        row+=dir; if(row<0||row>=size){ row-=dir; dir=-dir; break; } } }
    // format info: level M (=00) + mask 0 (=000) => 5 data bits 00000; BCH => 0x5412
    var fmt=0x5412;
    for(i=0;i<=5;i++) m[i][8]=(fmt>>i)&1;
    m[7][8]=(fmt>>6)&1; m[8][8]=(fmt>>7)&1; m[8][7]=(fmt>>8)&1;
    for(i=9;i<15;i++) m[8][14-i]=(fmt>>i)&1;
    for(i=0;i<8;i++) m[8][size-1-i]=(fmt>>i)&1;
    for(i=8;i<15;i++) m[size-15+i][8]=(fmt>>i)&1;
    return m;
  };

/* ==========================================================================
   BACK TO TOP
   Revealed after the visitor has scrolled a screen and a half. The button is
   `hidden` in the markup and only un-hidden here, so with JS off it never
   appears as a dead control.
   ========================================================================== */
(function(){
  var btn = $('#toTop');
  if (!btn) return;
  btn.hidden = false;
  var shown = false, ticking = false;
  function check(){
    var should = window.scrollY > window.innerHeight * 1.5;
    if (should !== shown){ shown = should; btn.classList.toggle('is-on', shown); }
    ticking = false;
  }
  window.addEventListener('scroll', function(){
    if (!ticking){ ticking = true; window.requestAnimationFrame(check); }
  }, {passive:true});
  check();
  btn.addEventListener('click', function(){
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({top:0, behavior: reduce ? 'auto' : 'smooth'});
    // Move focus to the top of the document so keyboard users land where the
    // page now is, rather than staying on a button that's scrolled away.
    var main = document.getElementById('main') || document.body;
    main.setAttribute('tabindex','-1');
    main.focus({preventScroll:true});
  });
})();

})();