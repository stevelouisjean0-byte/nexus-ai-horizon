// Generates the theme's block patterns, page templates and assets from the
// static build in ../picked-up (sections.html is the single source), so the
// WordPress theme cannot drift from it.
//   node build-theme.cjs
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', 'picked-up');
const THEME = path.join(__dirname, 'nexus-ai-horizon');
const html = fs.readFileSync(path.join(SRC, 'sections.html'), 'utf8');

function grab(re) {
  const a = html.search(re);
  if (a < 0) throw new Error('start not found: ' + re);
  const rest = html.slice(a);
  const b = rest.indexOf('</section>');
  return rest.slice(0, b + '</section>'.length);
}
function between(startRe, endRe) {
  const a = html.search(startRe);
  const rest = html.slice(a);
  const b = rest.search(endRe);
  const m = rest.match(endRe)[0];
  return rest.slice(0, b + m.length);
}
function promote(s, id) {
  const open = '<h2 id="' + id + '"';
  const i = s.indexOf(open);
  const j = s.indexOf('</h2>', i);
  return s.slice(0, i) + '<h1 id="' + id + '"' + s.slice(i + open.length, j) + '</h1>' + s.slice(j + 5);
}

const U = (p) => "<?php echo esc_url( home_url( '" + p + "' ) ); ?>";
const pageLinks = {
  'index.html': U('/'),
  'how-it-works.html': U('/how-it-works/'),
  'industries.html': U('/industries/'),
  'oversight.html': U('/oversight/'),
  'contact.html': U('/contact/'),
  'legal/privacy-policy.html': U('/privacy-policy/'),
  'legal/sms-terms.html': U('/sms-terms/'),
  'legal/terms.html': U('/terms/'),
  '#contact': U('/contact/'),
  '#every-call': U('/how-it-works/'),
  '#industries': U('/industries/'),
  '#person': U('/oversight/'),
  '#top': U('/'),
};
function themeify(s) {
  s = s.replace(/(src|href|poster|data-src)="assets\//g, '$1="<?php echo esc_url( $uri ); ?>/assets/img/');
  for (const [from, to] of Object.entries(pageLinks)) s = s.split('href="' + from + '"').join('href="' + to + '"');
  return s;
}

const hero = (() => { const a = html.search(/<section class="hero scene"/); const b = html.indexOf('<section class="transcript-band"'); return html.slice(a, b).trim(); })();
const header = between(/<header class="top"/, /<\/header>/);
const footer = between(/<footer class="foot">/, /<\/footer>/);
let contact = grab(/<section class="[^"]*" id="contact"/);
contact = contact.replace('<form class="form-card reveal" id="contact-form" novalidate aria-label="Book a strategy call">',
  '<form class="form-card reveal" id="contact-form" method="post" action="<?php echo esc_url( admin_url( \'admin-post.php\' ) ); ?>" data-live="1" novalidate aria-label="Book a strategy call">\n' +
  '        <input type="hidden" name="action" value="nexus_contact">\n' +
  '        <input type="hidden" name="nexus_t" value="<?php echo esc_attr( time() ); ?>">\n' +
  '        <?php wp_nonce_field( \'nexus_contact\', \'nexus_nonce\' ); ?>\n' +
  '        <div class="hp" aria-hidden="true"><label for="website_url">Leave this empty</label><input id="website_url" name="website_url" type="text" tabindex="-1" autocomplete="off"></div>');

// Header: current-page marking is done in PHP from the request path.
let hdr = themeify(header).replace('<header class="top" id="top">', '<div class="top" id="top">').replace(/<\/header>$/, '</div>');
const navKeys = [['/how-it-works/', 'how-it-works'], ['/industries/', 'industries'], ['/oversight/', 'oversight'], ['/contact/', 'contact']];
for (const [p, slug] of navKeys) {
  hdr = hdr.replace('href="' + U(p) + '">', 'href="' + U(p) + '"<?php echo is_page( \'' + slug + '\' ) ? \' aria-current="page"\' : \'\'; ?>>');
}
let ftr = themeify(footer).replace('<footer class="foot">', '<div class="foot">').replace(/<\/footer>$/, '</div>')
  .replace('&copy; 2026', "&copy; <?php echo esc_html( gmdate( 'Y' ) ); ?>");

const patterns = {
  header: { title: 'Header', content: hdr, block: 'header', inserter: false },
  footer: { title: 'Footer', content: ftr, block: 'footer', inserter: false },
  hero: { title: 'Hero: the call scene', content: themeify(hero) },
  transcript: { title: 'The full transcript (source of the demo)', content: themeify(grab(/<section class="transcript-band"/)) },
  'next-home': { title: 'Home: see the rest of the call', content: themeify(grab(/<section class="[^"]*" data-for="index"/)) },
  'every-call': { title: 'How it works: what happens on every call', content: themeify(promote(grab(/<section class="[^"]*" id="every-call"/), 'h-every')) },
  chapter: { title: 'How it works: calls arrive after hours', content: themeify(grab(/<section class="chapter"/)) },
  hours: { title: 'How it works: 168 hours', content: themeify(grab(/<section class="[^"]*hours[^"]*"/)) },
  'next-how': { title: 'How it works: next', content: themeify(grab(/<section class="[^"]*" data-for="how-it-works"/)) },
  industries: { title: 'Industries: four staged calls', content: themeify(promote(grab(/<section class="[^"]*" id="industries"/), 'h-ind')) },
  'next-industries': { title: 'Industries: next', content: themeify(grab(/<section class="[^"]*" data-for="industries"/)) },
  oversight: { title: 'Oversight: a person reviews the early calls', content: themeify(promote(grab(/<section class="[^"]*" id="person"/), 'h-person')) },
  'next-oversight': { title: 'Oversight: next', content: themeify(grab(/<section class="[^"]*" data-for="oversight"/)) },
  contact: { title: 'Contact: book a strategy call (form)', content: themeify(promote(contact, 'h-contact')) },
};
const patternDir = path.join(THEME, 'patterns');
for (const f of fs.readdirSync(patternDir)) fs.unlinkSync(path.join(patternDir, f));
for (const [slug, p] of Object.entries(patterns)) {
  const head = [
    '<?php', '/**', ` * Title: ${p.title}`, ` * Slug: nexus/${slug}`, ' * Categories: nexus',
    p.block ? ` * Block Types: core/template-part/${p.block}` : null,
    p.inserter === false ? ' * Inserter: no' : null,
    ' *', ' * Generated from picked-up/sections.html by wp-theme/build-theme.cjs. Edit the',
    ' * static build and rerun the script rather than editing this file by hand.', ' *',
    ' * @package nexus-ai-horizon', ' */', '',
    "if ( ! defined( 'ABSPATH' ) ) { exit; }", '$uri = get_template_directory_uri();', '?>', '<!-- wp:html -->',
  ].filter(Boolean).join('\n');
  fs.writeFileSync(path.join(patternDir, slug + '.php'), head + '\n' + p.content.trim() + '\n<!-- /wp:html -->\n');
}

// Templates: front page plus one per page slug.
const tpl = (slugs, bodyClass) => [
  '<!-- wp:template-part {"slug":"header","area":"header","tagName":"header"} /-->', '',
  '<!-- wp:group {"tagName":"main","className":"site-main' + (bodyClass ? ' ' + bodyClass : '') + '","layout":{"type":"default"}} -->',
  '<main class="wp-block-group site-main' + (bodyClass ? ' ' + bodyClass : '') + '" id="main">',
  ...slugs.map((s) => '<!-- wp:pattern {"slug":"nexus/' + s + '"} /-->'),
  '</main>', '<!-- /wp:group -->', '',
  '<!-- wp:template-part {"slug":"footer","area":"footer","tagName":"footer"} /-->', '',
].join('\n');
const T = path.join(THEME, 'templates');
fs.writeFileSync(path.join(T, 'front-page.html'), tpl(['hero', 'transcript', 'next-home']));
fs.writeFileSync(path.join(T, 'page-how-it-works.html'), tpl(['every-call', 'chapter', 'hours', 'next-how'], 'is-sub'));
fs.writeFileSync(path.join(T, 'page-industries.html'), tpl(['industries', 'next-industries'], 'is-sub'));
fs.writeFileSync(path.join(T, 'page-oversight.html'), tpl(['oversight', 'next-oversight'], 'is-sub'));
fs.writeFileSync(path.join(T, 'page-contact.html'), tpl(['contact'], 'is-sub'));

// Assets.
let css = fs.readFileSync(path.join(SRC, 'styles.css'), 'utf8');
css = css.replace(/\.page-sub main > section:first-child/g, '.page-sub main > section:first-child, main.is-sub > section:first-child')
  .replace(/\.page-sub main h1/g, '.page-sub main h1, main.is-sub h1');
css += `
/* ------------------------------------------------------------ WordPress */
.wp-block-group.site-main { display: block; }
.prose-page h1 { font-size: var(--t-h2); margin-bottom: 0.6em; }
.prose-page h2 { font-size: var(--t-h3); margin-top: 2em; }
.prose-page p, .prose-page li { color: var(--text-2); margin-top: 0.9em; line-height: 1.55; }
.prose-page strong { color: var(--text); font-weight: 600; }
.prose-page a { color: var(--teal); }
.hp { position: absolute; left: -10000px; top: auto; width: 1px; height: 1px; overflow: hidden; }
.screen-reader-text { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(1px, 1px, 1px, 1px); }
`;
fs.writeFileSync(path.join(THEME, 'assets', 'css', 'site.css'), css);
fs.copyFileSync(path.join(SRC, 'script.js'), path.join(THEME, 'assets', 'js', 'site.js'));
const imgDir = path.join(THEME, 'assets', 'img');
for (const f of fs.readdirSync(imgDir)) fs.unlinkSync(path.join(imgDir, f));
for (const f of fs.readdirSync(path.join(SRC, 'assets'))) {
  if (/\.(mp4|json)$/.test(f)) continue;
  fs.copyFileSync(path.join(SRC, 'assets', f), path.join(imgDir, f));
}
console.log('patterns:', Object.keys(patterns).join(', '));
console.log('templates:', fs.readdirSync(T).join(', '));
console.log('assets:', fs.readdirSync(imgDir).join(', '));
