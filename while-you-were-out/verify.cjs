// Real-Chrome verification for the homepage build. Run from the wh project
// (or with NODE_PATH pointing at its node_modules) so playwright resolves.
//   node verify.cjs [outDir]
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const OUT = process.argv[2] || path.join(ROOT, 'shots');
fs.mkdirSync(OUT, { recursive: true });
const URL = 'file:///' + ROOT.split(path.sep).join('/') + '/index.html';

function lum(rgb) {
  const [r, g, b] = rgb.map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrast(a, b) { const l1 = lum(a), l2 = lum(b); return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05); }

async function audit(page, label) {
  return page.evaluate((label) => {
    const parse = (s) => { const m = s.match(/[\d.]+/g); return m ? m.slice(0, 4).map(Number) : null; };
    const bgOf = (el) => {
      let e = el;
      while (e) {
        const c = parse(getComputedStyle(e).backgroundColor);
        if (c && (c.length < 4 || c[3] > 0.9)) return c.slice(0, 3);
        e = e.parentElement;
      }
      return [12, 22, 32];
    };
    const out = { label };
    out.scrollWidth = document.documentElement.scrollWidth;
    out.clientWidth = document.documentElement.clientWidth;
    out.h1 = document.querySelectorAll('h1').length;
    out.headings = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((h) => h.tagName + ' ' + h.textContent.trim().slice(0, 50));
    out.emDashes = (document.body.innerText.match(/[—–]/g) || []).length;
    out.hashLinks = [...document.querySelectorAll('a[href="#"]')].length;
    out.fontsLoaded = document.fonts.check('800 40px "Libre Franklin"') && document.fonts.check('400 16px "Libre Franklin"');
    out.fontFamilies = [...new Set([...document.querySelectorAll('h1,h2,p,a,dd,dt,li,button,input')].map((e) => getComputedStyle(e).fontFamily.split(',')[0]))];
    out.nonFranklin = [...document.querySelectorAll('body *')].filter((e) => !/Libre Franklin/.test(getComputedStyle(e).fontFamily)).map((e) => e.tagName + '.' + e.className).slice(0, 10);
    // inline spans that get sizing they cannot use
    out.badSpans = [...document.querySelectorAll('span')].filter((s) => {
      const cs = getComputedStyle(s);
      if (cs.display !== 'inline') return false;
      return (cs.width !== 'auto' && s.getAttribute('style')) || cs.aspectRatio !== 'auto' || cs.overflow === 'hidden' || (parseFloat(cs.marginTop) > 0);
    }).map((s) => s.className || s.outerHTML.slice(0, 60));
    // contrast on key text
    const samples = [];
    const sel = 'h1,h2,.lede,.prose p,.slip-fields dd,.slip-fields dt,.slip-title,.slip-checks li,.slip-foot,.line .said,.line .who,.line .mark,.checks li b,.checks li span,.btn,.nav a,.foot a,.foot p,.hero-note,.credit,.field label,.consent span,.regulated,.form-actions .small,.legal span';
    document.querySelectorAll(sel).forEach((el) => {
      const cs = getComputedStyle(el);
      const fg = parse(cs.color); if (!fg) return;
      const bg = bgOf(el);
      samples.push({ sel: el.className || el.tagName, fg: fg.slice(0, 3), bg, size: parseFloat(cs.fontSize), weight: cs.fontWeight, text: el.textContent.trim().slice(0, 30) });
    });
    out.samples = samples;
    // images
    out.images = [...document.images].map((i) => ({ src: i.getAttribute('src'), w: i.naturalWidth, h: i.naturalHeight, complete: i.complete }));
    out.uppercaseLabels = [...document.querySelectorAll('*')].filter((e) => e.children.length === 0 && getComputedStyle(e).textTransform === 'uppercase' && e.textContent.trim()).map((e) => e.textContent.trim().slice(0, 40));
    // hit targets
    out.smallTargets = [...document.querySelectorAll('a,button,input,select,textarea')].filter((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && (r.height < 40); }).map((e) => (e.textContent.trim() || e.id).slice(0, 30) + ' ' + Math.round(e.getBoundingClientRect().height));
    // does hero fit fold?
    const heroCta = document.querySelector('.hero-actions .btn');
    out.heroCtaBottom = heroCta ? Math.round(heroCta.getBoundingClientRect().bottom + window.scrollY) : null;
    return out;
  }, label);
}

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: false });
  const results = {};
  const views = [
    { name: 'desktop', viewport: { width: 1440, height: 900 } },
    { name: 'laptop', viewport: { width: 1280, height: 720 } },
    { name: 'tablet', viewport: { width: 820, height: 1180 } },
    { name: 'mobile', viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
  ];
  for (const v of views) {
    const ctx = await browser.newContext({ viewport: v.viewport, isMobile: !!v.isMobile, hasTouch: !!v.hasTouch, deviceScaleFactor: v.deviceScaleFactor || 1 });
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    await page.goto(URL, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(900);
    await page.screenshot({ path: path.join(OUT, `${v.name}-fold.png`) });
    // scroll through slowly so observers fire, force eager images
    await page.evaluate(async () => {
      document.querySelectorAll('img').forEach((i) => { i.loading = 'eager'; });
      const h = document.documentElement.scrollHeight;
      for (let y = 0; y < h; y += 400) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 90)); }
      await new Promise((r) => setTimeout(r, 400));
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(700);
    const a = await audit(page, v.name);
    a.errors = errors;
    a.scrollHeight = await page.evaluate(() => document.documentElement.scrollHeight);
    // first-viewport state
    a.heroFilled = await page.evaluate(() => !!document.querySelector('.hero .slip.is-filled'));
    results[v.name] = a;
    if (v.isMobile) {
      // Full-page capture on an emulated phone resizes the viewport, which
      // changes every vh-based size and moves the sticky header. Capture the
      // page viewport by viewport instead, as a phone would show it.
      const total = a.scrollHeight; const step = v.viewport.height; let n = 0;
      for (let y = 0; y < total; y += step) {
        await page.evaluate((yy) => window.scrollTo(0, yy), y);
        await page.waitForTimeout(350);
        await page.screenshot({ path: path.join(OUT, `${v.name}-page-${String(n).padStart(2, '0')}.png`) });
        n++;
      }
      await page.evaluate(() => window.scrollTo(0, 0));
    } else {
      await page.screenshot({ path: path.join(OUT, `${v.name}-full.png`), fullPage: true });
    }
    // section crops on desktop and mobile
    if (v.name === 'desktop' || v.name === 'mobile') {
      const ids = ['the-call', 'industries', 'every-call', 'person', 'contact'];
      for (const id of ids) {
        const el = await page.$('#' + id);
        if (el) { await el.scrollIntoViewIfNeeded(); await page.waitForTimeout(600); await el.screenshot({ path: path.join(OUT, `${v.name}-${id}.png`) }); }
      }
      const hours = await page.$('.hours');
      if (hours) { await hours.scrollIntoViewIfNeeded(); await page.waitForTimeout(600); await hours.screenshot({ path: path.join(OUT, `${v.name}-hours.png`) }); }
      const foot = await page.$('.foot');
      if (foot) { await foot.scrollIntoViewIfNeeded(); await page.waitForTimeout(300); await foot.screenshot({ path: path.join(OUT, `${v.name}-footer.png`) }); }
    }
    // mobile menu open state
    if (v.name === 'mobile') {
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.click('.menu-btn');
      await page.waitForTimeout(300);
      await page.screenshot({ path: path.join(OUT, 'mobile-menu.png') });
      await page.click('.menu-btn');
      // form validation
      await page.click('#contact-form button[type=submit]');
      await page.waitForTimeout(300);
      const el = await page.$('#contact-form');
      await el.screenshot({ path: path.join(OUT, 'mobile-form-errors.png') });
      a.invalidCount = await page.evaluate(() => document.querySelectorAll('.is-invalid').length);
    }
    if (v.name === 'desktop') {
      // keyboard focus ring visible?
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.keyboard.press('Tab'); await page.keyboard.press('Tab'); await page.keyboard.press('Tab');
      await page.waitForTimeout(200);
      await page.screenshot({ path: path.join(OUT, 'desktop-focus.png'), clip: { x: 0, y: 0, width: 1440, height: 120 } });
      a.focused = await page.evaluate(() => (document.activeElement.textContent || '').trim().slice(0, 30));
      // reduced-motion pass
      const rctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
      const rp = await rctx.newPage();
      await rp.goto(URL, { waitUntil: 'load' });
      await rp.waitForTimeout(500);
      a.reducedMotionFilledImmediately = await rp.evaluate(() => {
        const slip = document.querySelector('.hero .slip');
        const dd = slip.querySelector('dd');
        const cp = getComputedStyle(dd).clipPath;
        return slip.classList.contains('is-filled') && (cp === 'none' || /inset\(0(px)? -/.test(cp));
      });
      await rp.screenshot({ path: path.join(OUT, 'desktop-reduced-motion.png') });
      await rctx.close();
    }
    await ctx.close();
  }
  // contrast summary
  for (const k of Object.keys(results)) {
    const r = results[k];
    r.contrastFails = r.samples.filter((s) => {
      const c = contrast(s.fg, s.bg);
      const large = s.size >= 24 || (s.size >= 18.66 && parseInt(s.weight, 10) >= 700);
      return c < (large ? 3 : 4.5);
    }).map((s) => ({ sel: s.sel, text: s.text, ratio: contrast(s.fg, s.bg).toFixed(2), size: s.size, fg: s.fg, bg: s.bg }));
    r.contrastMin = Math.min(...r.samples.map((s) => contrast(s.fg, s.bg))).toFixed(2);
    delete r.samples;
  }
  fs.writeFileSync(path.join(OUT, 'audit.json'), JSON.stringify(results, null, 2));
  for (const k of Object.keys(results)) {
    const r = results[k];
    console.log(`\n== ${k} == scrollW ${r.scrollWidth}/${r.clientWidth} h ${r.scrollHeight} | h1 ${r.h1} | emdash ${r.emDashes} | hash# ${r.hashLinks} | fonts ${r.fontsLoaded} ${JSON.stringify(r.fontFamilies)} | heroFilled ${r.heroFilled} | heroCtaBottom ${r.heroCtaBottom}`);
    console.log('   contrastMin', r.contrastMin, 'fails', JSON.stringify(r.contrastFails));
    console.log('   badSpans', JSON.stringify(r.badSpans), '| uppercase', JSON.stringify(r.uppercaseLabels), '| smallTargets', JSON.stringify(r.smallTargets));
    console.log('   images', JSON.stringify(r.images), '| errors', JSON.stringify(r.errors));
    if (r.invalidCount !== undefined) console.log('   form invalid fields on empty submit:', r.invalidCount);
    if (r.focused !== undefined) console.log('   focused after 3 tabs:', r.focused, '| reducedMotion immediate:', r.reducedMotionFilledImmediately);
    console.log('   headings', r.headings.join(' / '));
  }
  await browser.close();
})().catch((e) => { console.error('ERR', e); process.exit(1); });
