// Real-Chrome verification for every page of the site. Run from a folder
// where playwright resolves (or with NODE_PATH set).
//   node check.cjs [outDir]            static build (file://)
//   CHECK_URL=http://host/ node check.cjs [outDir]   a running server
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const OUT = process.argv[2] || path.join(ROOT, 'shots');
fs.mkdirSync(OUT, { recursive: true });
const BASE = process.env.CHECK_URL || ('file:///' + ROOT.split(path.sep).join('/') + '/');
const WP = !!process.env.CHECK_URL;
const PAGES = WP
  ? [['home', ''], ['how', 'how-it-works/'], ['ind', 'industries/'], ['over', 'oversight/'], ['contact', 'contact/']]
  : [['home', 'index.html'], ['how', 'how-it-works.html'], ['ind', 'industries.html'], ['over', 'oversight.html'], ['contact', 'contact.html']];
const VIEWS = [
  { name: 'desktop', viewport: { width: 1440, height: 900 } },
  { name: 'laptop', viewport: { width: 1280, height: 720 } },
  { name: 'tablet', viewport: { width: 820, height: 1180 } },
  { name: 'mobile', viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
];

function lum(rgb) { const [r, g, b] = rgb.map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; }
function contrast(a, b) { const l1 = lum(a), l2 = lum(b); return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05); }

async function audit(page) {
  return page.evaluate(() => {
    const parse = (s) => { const m = s.match(/[\d.]+/g); return m ? m.slice(0, 4).map(Number) : null; };
    // effective background: nearest opaque colour, treating the known image/gradient panels as their base colour
    const bgOf = (el) => {
      for (let e = el; e; e = e.parentElement) {
        if (e.classList && (e.classList.contains('t2') || e.classList.contains('next-cta'))) return [26, 92, 176];
        const c = parse(getComputedStyle(e).backgroundColor);
        if (c && (c.length < 4 || c[3] > 0.6)) return c.slice(0, 3);
      }
      return [7, 11, 18];
    };
    const o = {};
    o.scrollWidth = document.documentElement.scrollWidth;
    o.clientWidth = document.documentElement.clientWidth;
    o.h1 = document.querySelectorAll('h1').length;
    o.emDashes = (document.body.innerText.match(/[—–]/g) || []).length;
    o.hashOnly = document.querySelectorAll('a[href="#"]').length;
    o.fonts = document.fonts.check('700 40px "Geist"');
    o.badSpans = [...document.querySelectorAll('span')].filter((s) => { const cs = getComputedStyle(s); return cs.display === 'inline' && (cs.aspectRatio !== 'auto' || cs.overflow === 'hidden' || parseFloat(cs.marginTop) > 0); }).length;
    const sel = 'h1,h2,h3,p,li,a,button,label,dt,dd,summary,.who,.said,.when,.k,.t';
    const fails = []; let min = 99;
    document.querySelectorAll(sel).forEach((el) => {
      if (!el.textContent.trim() || el.closest('[hidden]') || el.closest('[aria-hidden="true"]')) return;
      const r = el.getBoundingClientRect(); if (!r.width || !r.height) return;
      const cs = getComputedStyle(el);
      if (parseFloat(cs.opacity) < 0.5) return;
      const fg = parse(cs.color); if (!fg) return;
      const bg = bgOf(el);
      const L = (x) => { const [r2, g2, b2] = x.map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * r2 + 0.7152 * g2 + 0.0722 * b2; };
      const c = (Math.max(L(fg), L(bg)) + 0.05) / (Math.min(L(fg), L(bg)) + 0.05);
      const size = parseFloat(cs.fontSize); const large = size >= 24 || (size >= 18.66 && parseInt(cs.fontWeight, 10) >= 700);
      min = Math.min(min, c);
      if (c < (large ? 3 : 4.5)) fails.push((el.className || el.tagName) + ' "' + el.textContent.trim().slice(0, 24) + '" ' + c.toFixed(2));
    });
    o.contrastMin = +min.toFixed(2); o.contrastFails = fails.slice(0, 8);
    o.images = [...document.images].map((i) => ({ src: (i.currentSrc || i.src).split('/').pop(), ok: i.complete && i.naturalWidth > 0 }));
    o.links = [...document.querySelectorAll('a[href]')].map((a) => a.getAttribute('href')).filter((h) => !/^(https?:|mailto:|tel:|#)/.test(h));
    o.smallTargets = [...document.querySelectorAll('a,button,input,select,textarea,summary')].filter((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && r.height < 40 && !e.closest('.hp'); }).map((e) => (e.textContent.trim() || e.id).slice(0, 24) + ' ' + Math.round(e.getBoundingClientRect().height));
    o.gsap = !!window.gsap;
    return o;
  });
}

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: false });
  const report = {};
  const broken = new Set();
  for (const v of VIEWS) {
    const ctx = await browser.newContext({ viewport: v.viewport, isMobile: !!v.isMobile, hasTouch: !!v.hasTouch, deviceScaleFactor: v.deviceScaleFactor || 1 });
    for (const [key, rel] of PAGES) {
      const page = await ctx.newPage();
      const errors = [];
      page.on('pageerror', (e) => errors.push(e.message));
      page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 120)); });
      page.on('requestfailed', (r) => { if (!/fonts\.g/.test(r.url())) errors.push('failed ' + r.url().split('/').slice(-2).join('/')); });
      await page.goto(BASE + rel, { waitUntil: 'domcontentloaded', timeout: 60000 }); await page.waitForLoadState('load', { timeout: 20000 }).catch(() => errors.push('load event slow'));
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(1200);
      await page.screenshot({ path: path.join(OUT, `${v.name}-${key}-fold.png`) });
      const vh = v.viewport.height;
      if (key === 'home' && !v.isMobile) {
        for (const n of [1, 2, 3, 4, 5]) {
          const top = await page.evaluate((k) => { const a = document.querySelector('.act[data-act="' + k + '"]'); return a ? a.getBoundingClientRect().top + window.scrollY : null; }, n);
          if (top === null) continue;
          await page.evaluate((y) => { document.documentElement.style.scrollBehavior = 'auto'; window.scrollTo(0, y); }, Math.round(top + vh * 0.15));
          await page.waitForTimeout(n === 5 ? 3200 : 2200);
          await page.screenshot({ path: path.join(OUT, `${v.name}-home-act${n}.png`) });
        }
      }
      // walk the page so observers fire, then capture viewport by viewport
      await page.evaluate(async () => {
        document.documentElement.style.scrollBehavior = 'auto';
        document.querySelectorAll('img').forEach((i) => { i.loading = 'eager'; });
        const h = document.documentElement.scrollHeight;
        for (let y = 0; y < h; y += 350) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 80)); }
        await new Promise((r) => setTimeout(r, 500));
      });
      await page.waitForTimeout(800);
      const a = await audit(page);
      a.errors = errors;
      if (key === 'home') a.scene = await page.evaluate(() => { const s = document.querySelector('.scene'); const d = document.querySelector('.device'); return s && d ? { shifted: s.classList.contains('is-shifted'), state: d.getAttribute('data-state'), stamps: document.querySelectorAll('.stamps li.is-on').length, chips: document.querySelectorAll('.chips li').length } : null; });
      if (v.name === 'desktop' || v.name === 'mobile') {
        const total = await page.evaluate(() => document.documentElement.scrollHeight);
        let n = 0;
        for (let y = 0; y < total && n < 16; y += vh) {
          await page.evaluate((yy) => window.scrollTo(0, yy), y);
          await page.waitForTimeout(450);
          await page.screenshot({ path: path.join(OUT, `${v.name}-${key}-${String(n).padStart(2, '0')}.png`) });
          n++;
        }
      }
      if (key === 'contact' && v.name === 'mobile') {
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.click('#contact-form button[type=submit]');
        await page.waitForTimeout(300);
        a.invalidOnEmpty = await page.evaluate(() => document.querySelectorAll('.is-invalid').length);
      }
      if (key === 'ind' && v.name === 'desktop') {
        const card = await page.$('.card');
        const before = await page.evaluate(() => getComputedStyle(document.querySelector('.card .more')).gridTemplateRows);
        await card.hover();
        await page.waitForTimeout(700);
        a.hoverReveal = before + ' -> ' + (await page.evaluate(() => getComputedStyle(document.querySelector('.card .more')).gridTemplateRows));
        await page.screenshot({ path: path.join(OUT, 'desktop-ind-hover.png') });
      }
      if (key === 'home' && v.name === 'desktop') {
        const rctx = await browser.newContext({ viewport: v.viewport, reducedMotion: 'reduce' });
        const rp = await rctx.newPage();
        await rp.goto(BASE + rel, { waitUntil: 'domcontentloaded', timeout: 60000 }); await rp.waitForLoadState('load', { timeout: 20000 }).catch(() => {});
        await rp.waitForTimeout(700);
        a.reducedMotion = await rp.evaluate(() => ({ state: document.querySelector('.device').getAttribute('data-state'), chips: document.querySelectorAll('.chips li').length, stamps: document.querySelectorAll('.stamps li.is-on').length, pinned: getComputedStyle(document.querySelector('.stage')).position }));
        await rp.screenshot({ path: path.join(OUT, 'desktop-home-reduced.png'), fullPage: true });
        await rctx.close();
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.keyboard.press('Tab'); await page.keyboard.press('Tab'); await page.keyboard.press('Tab');
        await page.waitForTimeout(200);
        await page.screenshot({ path: path.join(OUT, 'desktop-focus.png'), clip: { x: 0, y: 0, width: 1440, height: 90 } });
      }
      for (const l of a.links) broken.add(l);
      report[v.name + ':' + key] = a;
      await page.close();
    }
    await ctx.close();
  }
  // link resolution for the static build
  const missing = [];
  if (!WP) for (const l of broken) { const f = path.join(ROOT, l.split('#')[0]); if (l.split('#')[0] && !fs.existsSync(f)) missing.push(l); }
  fs.writeFileSync(path.join(OUT, 'audit.json'), JSON.stringify({ report, missingLinks: missing }, null, 2));
  for (const [k, a] of Object.entries(report)) {
    const imgs = a.images.filter((i) => !i.ok).map((i) => i.src);
    console.log(`${k.padEnd(16)} w ${a.scrollWidth}/${a.clientWidth} h1 ${a.h1} dash ${a.emDashes} #${a.hashOnly} font ${a.fonts} gsap ${a.gsap} spans ${a.badSpans} cmin ${a.contrastMin} imgBad ${JSON.stringify(imgs)} err ${JSON.stringify(a.errors)}${a.scene ? ' scene ' + JSON.stringify(a.scene) : ''}${a.invalidOnEmpty !== undefined ? ' invalid ' + a.invalidOnEmpty : ''}${a.hoverReveal ? ' hover ' + a.hoverReveal : ''}${a.reducedMotion ? ' reduced ' + JSON.stringify(a.reducedMotion) : ''}`);
    if (a.contrastFails.length) console.log('   contrast fails:', JSON.stringify(a.contrastFails));
    if (a.smallTargets.length) console.log('   small targets:', JSON.stringify(a.smallTargets));
  }
  console.log('missing links:', JSON.stringify(missing));
  await browser.close();
})().catch((e) => { console.error('ERR', e); process.exit(1); });
