// End-to-end test of the contact form against a running WordPress (Playground).
//   node e2e-form.cjs http://127.0.0.1:9400
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const BASE = (process.argv[2] || 'http://127.0.0.1:9400').replace(/\/$/, '');
const OUT = path.join(__dirname, 'shots-wp');
fs.mkdirSync(OUT, { recursive: true });

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: false });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const result = {};
  await page.goto(BASE + '/contact/', { waitUntil: 'domcontentloaded' }); await page.waitForLoadState('load', { timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(500);

  // 1. Submitting empty must not leave the page.
  await page.click('#contact-form button[type=submit]');
  await page.waitForTimeout(400);
  result.emptySubmitStayed = page.url().indexOf('admin-post') === -1;
  result.emptyInvalidCount = await page.evaluate(() => document.querySelectorAll('.is-invalid').length);

  // 2. Fill it in properly and submit. The handler requires 3 seconds since load.
  await page.fill('#first', 'Test');
  await page.fill('#last', 'Request');
  await page.fill('#company', 'Playground Plumbing');
  await page.selectOption('#industry', { index: 1 });
  await page.fill('#email', 'test@example.com');
  await page.fill('#phone', '718 555 0100');
  await page.fill('#message', 'Calls go to voicemail after six.');
  await page.check('#consent');
  await page.waitForTimeout(3500);
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'load', timeout: 30000 }),
    page.click('#contact-form button[type=submit]'),
  ]);
  await page.waitForTimeout(600);
  result.afterUrl = page.url();
  result.sentFlag = /[?&]sent=1/.test(page.url());
  result.statusText = await page.evaluate(() => { const s = document.querySelector('.form-status'); return s && !s.hidden ? s.textContent : null; });
  const form = await page.$('#contact-form');
  if (form) await form.screenshot({ path: path.join(OUT, 'form-after-submit.png') });

  // 3. The request exists in the admin as a private post.
  await page.goto(BASE + '/wp-login.php', { waitUntil: 'load' });
  await page.fill('#user_login', 'admin');
  await page.fill('#user_pass', 'password');
  await Promise.all([page.waitForNavigation({ waitUntil: 'load', timeout: 30000 }), page.click('#wp-submit')]);
  await page.goto(BASE + '/wp-admin/edit.php?post_type=nexus_request&post_status=private', { waitUntil: 'load' });
  await page.waitForTimeout(500);
  result.adminListHasRequest = await page.evaluate(() => document.body.innerText.includes('Test Request, Playground Plumbing'));
  await page.screenshot({ path: path.join(OUT, 'admin-requests.png') });
  // open it and confirm the meta
  const link = await page.$('a.row-title');
  if (link) {
    await Promise.all([page.waitForNavigation({ waitUntil: 'load', timeout: 30000 }), link.click()]);
    await page.waitForTimeout(800);
    result.requestBodyHasFields = await page.evaluate(() => document.body.innerText.includes('Company: Playground Plumbing') && document.body.innerText.includes('Consent to call or text: yes'));
    await page.screenshot({ path: path.join(OUT, 'admin-request-detail.png') });
  }

  // 4. Site editor loads the front-page template without a fatal.
  await page.goto(BASE + '/wp-admin/site-editor.php?postType=wp_template&postId=nexus-ai-horizon%2F%2Fpage-contact&canvas=edit', { waitUntil: 'load' });
  await page.waitForTimeout(6000);
  result.siteEditorLoaded = await page.evaluate(() => !!document.querySelector('iframe[name="editor-canvas"]') || !!document.querySelector('.edit-site'));
  await page.screenshot({ path: path.join(OUT, 'site-editor.png') });

  console.log(JSON.stringify(result, null, 2));
  await browser.close();
})().catch((e) => { console.error('ERR', e); process.exit(1); });
