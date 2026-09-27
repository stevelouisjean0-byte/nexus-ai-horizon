// Generates the theme's block patterns and assets from the verified static
// build in ../picked-up, so the WordPress theme cannot drift from it.
//   node build-theme.cjs
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', 'picked-up');
const THEME = path.join(__dirname, 'nexus-ai-horizon');
const html = fs.readFileSync(path.join(SRC, 'index.html'), 'utf8');

function between(s, startRe, endRe) {
  const a = s.search(startRe);
  if (a < 0) throw new Error('start not found: ' + startRe);
  const rest = s.slice(a);
  const b = rest.search(endRe);
  if (b < 0) throw new Error('end not found: ' + endRe);
  const endLen = rest.match(endRe)[0].length;
  return rest.slice(0, b + endLen);
}

const header = between(html, /<header class="top"/, /<\/header>/);
const hero = between(html, /<section class="hero[^"]*"/, /<\/section>/);
const transcript = between(html, /<section class="transcript-band"/, /<\/section>/);
const every = between(html, /<section class="band grey" id="every-call"/, /<\/section>/);
const chapter = between(html, /<section class="chapter"/, /<\/section>/);
const industries = between(html, /<section class="band gallery" id="industries"/, /<\/section>/);
const hours = between(html, /<section class="band grey hours"/, /<\/section>/);
const oversight = between(html, /<section class="band person" id="person"/, /<\/section>/);
let contact = between(html, /<section class="band grey contact" id="contact"/, /<\/section>/);
const footer = between(html, /<footer class="foot">/, /<\/footer>/);

// Asset URLs become theme URLs.
function themeify(s) {
  return s.replace(/(src|href)="assets\//g, '$1="<?php echo esc_url( $uri ); ?>/assets/img/');
}

// Header: the brand links to the home URL, nav anchors point at the front page.
let hdr = themeify(header)
  .replace(/href="#top"/g, 'href="<?php echo esc_url( home_url( \'/\' ) ); ?>"')
  .replace(/href="#(every-call|industries|person|contact)"/g, 'href="<?php echo esc_url( home_url( \'/\' ) ); ?>#$1"');
hdr = hdr.replace('<header class="top" id="top">', '<div class="top" id="top">').replace(/<\/header>$/, '</div>');

let ftr = themeify(footer)
  .replace(/href="#top"/g, 'href="<?php echo esc_url( home_url( \'/\' ) ); ?>"')
  .replace(/href="#(every-call|industries|person|contact)"/g, 'href="<?php echo esc_url( home_url( \'/\' ) ); ?>#$1"')
  .replace(/href="\/(privacy-policy|sms-terms|terms)\/"/g, 'href="<?php echo esc_url( home_url( \'/$1/\' ) ); ?>"')
  .replace('&copy; 2026', '&copy; <?php echo esc_html( gmdate( \'Y\' ) ); ?>');
ftr = ftr.replace('<footer class="foot">', '<div class="foot">').replace(/<\/footer>$/, '</div>');

// Contact: the form posts to admin-post.php with a nonce, a honeypot and a
// timestamp; the privacy link points at the site's page.
contact = contact
  .replace('<form class="form-card reveal" id="contact-form" novalidate aria-label="Book a strategy call">',
    '<form class="form-card reveal" id="contact-form" method="post" action="<?php echo esc_url( admin_url( \'admin-post.php\' ) ); ?>" data-live="1" novalidate aria-label="Book a strategy call">\n' +
    '        <input type="hidden" name="action" value="nexus_contact">\n' +
    '        <input type="hidden" name="nexus_t" value="<?php echo esc_attr( time() ); ?>">\n' +
    '        <?php wp_nonce_field( \'nexus_contact\', \'nexus_nonce\' ); ?>\n' +
    '        <div class="hp" aria-hidden="true"><label for="website_url">Leave this empty</label><input id="website_url" name="website_url" type="text" tabindex="-1" autocomplete="off"></div>')
  .replace('href="/privacy-policy/"', 'href="<?php echo esc_url( home_url( \'/privacy-policy/\' ) ); ?>"');

const patterns = {
  header: { title: 'Header', content: hdr, block: 'header', inserter: false },
  footer: { title: 'Footer', content: ftr, block: 'footer', inserter: false },
  hero: { title: 'Hero with the call demonstration', content: themeify(hero) },
  transcript: { title: 'The full transcript (source of the demo)', content: themeify(transcript) },
  'every-call': { title: 'What happens on every call (bento)', content: themeify(every) },
  chapter: { title: 'Chapter: calls arrive after hours (timelapse)', content: themeify(chapter).replace(/(poster|data-src)="assets\//g, '$1="<?php echo esc_url( $uri ); ?>/assets/img/') },
  industries: { title: 'Four industries (gallery)', content: themeify(industries) },
  hours: { title: '168 hours (week grid)', content: themeify(hours) },
  oversight: { title: 'A person reviews the early calls', content: themeify(oversight) },
  contact: { title: 'Book a strategy call (form)', content: themeify(contact) },
};

for (const [slug, p] of Object.entries(patterns)) {
  const head = [
    '<?php',
    '/**',
    ` * Title: ${p.title}`,
    ` * Slug: nexus/${slug}`,
    ' * Categories: nexus',
    p.block ? ` * Block Types: core/template-part/${p.block}` : null,
    p.inserter === false ? ' * Inserter: no' : null,
    ' *',
    ' * Generated from picked-up/index.html by wp-theme/build-theme.cjs. Edit the',
    ' * static build and rerun the script rather than editing this file by hand.',
    ' *',
    ' * @package nexus-ai-horizon',
    ' */',
    '',
    "if ( ! defined( 'ABSPATH' ) ) { exit; }",
    '$uri = get_template_directory_uri();',
    '?>',
    '<!-- wp:html -->',
  ].filter(Boolean).join('\n');
  const out = head + '\n' + p.content.trim() + '\n<!-- /wp:html -->\n';
  fs.writeFileSync(path.join(THEME, 'patterns', slug + '.php'), out);
}

// Assets: stylesheet with a few WordPress-specific additions, script, images.
let css = fs.readFileSync(path.join(SRC, 'styles.css'), 'utf8');
css += `
/* ------------------------------------------------------------ WordPress */
.wp-block-group.site-main { display: block; }
.prose-page h1 { font-size: var(--t-h2); margin-bottom: 0.6em; }
.prose-page h2 { font-size: var(--t-h3); margin-top: 2em; }
.prose-page p, .prose-page li { color: var(--ink-2); margin-top: 0.9em; line-height: 1.55; }
.prose-page strong { color: var(--ink); font-weight: 600; }
.prose-page a { color: var(--blue); }
.hp { position: absolute; left: -10000px; top: auto; width: 1px; height: 1px; overflow: hidden; }
.screen-reader-text { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(1px, 1px, 1px, 1px); }
`;
fs.writeFileSync(path.join(THEME, 'assets', 'css', 'site.css'), css);
fs.copyFileSync(path.join(SRC, 'script.js'), path.join(THEME, 'assets', 'js', 'site.js'));
for (const f of fs.readdirSync(path.join(SRC, 'assets'))) {
  fs.copyFileSync(path.join(SRC, 'assets', f), path.join(THEME, 'assets', 'img', f));
}
console.log('patterns:', Object.keys(patterns).join(', '));
console.log('assets copied:', fs.readdirSync(path.join(THEME, 'assets', 'img')).join(', '));
