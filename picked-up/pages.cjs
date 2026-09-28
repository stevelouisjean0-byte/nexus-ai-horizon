// Builds the site's pages from sections.html, so the pages share one source
// and one header, footer, stylesheet and script.
//   node pages.cjs
const fs = require('fs');
const path = require('path');

const DIR = __dirname;
const src = fs.readFileSync(path.join(DIR, 'sections.html'), 'utf8');

function grab(re) {
  const a = src.search(re);
  if (a < 0) throw new Error('not found: ' + re);
  const rest = src.slice(a);
  const b = rest.indexOf('</section>');
  return rest.slice(0, b + '</section>'.length);
}
// sections that contain nested <section> are not used; each one here is flat
const S = {
  hero: (() => { const a = src.search(/<section class="hero scene"/); const b = src.indexOf('<section class="transcript-band"'); return src.slice(a, b).trim(); })(),
  transcript: grab(/<section class="transcript-band"/),
  every: grab(/<section class="[^"]*" id="every-call"/),
  chapter: grab(/<section class="chapter"/),
  industries: grab(/<section class="[^"]*" id="industries"/),
  hours: grab(/<section class="[^"]*hours[^"]*"/),
  person: grab(/<section class="[^"]*" id="person"/),
  contact: grab(/<section class="[^"]*" id="contact"/),
  nextIndex: grab(/<section class="[^"]*" data-for="index"/),
  nextHow: grab(/<section class="[^"]*" data-for="how-it-works"/),
  nextInd: grab(/<section class="[^"]*" data-for="industries"/),
  nextOver: grab(/<section class="[^"]*" data-for="oversight"/),
};

const headEnd = src.indexOf('<main id="main">');
let head = src.slice(0, headEnd);
const footStart = src.indexOf('</main>');
let foot = src.slice(footStart + '</main>'.length);

// promote a section's h2 to the page's h1
function promote(html, id) {
  const open = '<h2 id="' + id + '"';
  const i = html.indexOf(open);
  if (i < 0) throw new Error('h2 not found ' + id);
  const j = html.indexOf('</h2>', i);
  return html.slice(0, i) + '<h1 id="' + id + '"' + html.slice(i + open.length, j) + '</h1>' + html.slice(j + 5);
}

const pages = [
  { file: 'index.html', key: 'home', title: 'Nexus AI Horizon | AI voice and SMS systems for New York service businesses',
    desc: 'Nexus AI Horizon builds AI voice and SMS systems for service businesses in the New York metro. The phone rings. Your AI answers. 24/7.',
    body: [S.hero, S.transcript, S.nextIndex] },
  { file: 'how-it-works.html', key: 'how', title: 'How it works | Nexus AI Horizon',
    desc: 'What happens on every call: answered on your number, urgency judged by your rules, booked, texted and written to your CRM.',
    body: [promote(S.every, 'h-every'), S.chapter, S.hours, S.nextHow] },
  { file: 'industries.html', key: 'ind', title: 'Industries | Nexus AI Horizon',
    desc: 'Four industries and nothing else: emergency home services, property management, moving and relocation, financial services.',
    body: [promote(S.industries, 'h-ind'), S.nextInd] },
  { file: 'oversight.html', key: 'over', title: 'Oversight | Nexus AI Horizon',
    desc: 'A person at Nexus AI Horizon reviews the early calls before the system runs on its own. You can read every transcript and every rule.',
    body: [promote(S.person, 'h-person'), S.nextOver] },
  { file: 'contact.html', key: 'contact', title: 'Book a strategy call | Nexus AI Horizon',
    desc: 'Book a twenty-minute strategy call with Nexus AI Horizon. No deck.',
    body: [promote(S.contact, 'h-contact')] },
];

const navMap = { '#every-call': ['how-it-works.html', 'how'], '#industries': ['industries.html', 'ind'], '#person': ['oversight.html', 'over'], '#contact': ['contact.html', 'contact'] };

for (const p of pages) {
  let h = head
    .replace(/<title>[^<]*<\/title>/, '<title>' + p.title + '</title>')
    .replace(/<meta name="description" content="[^"]*">/, '<meta name="description" content="' + p.desc + '">')
    .replace('<body>', '<body class="page-' + p.key + (p.key === 'home' ? '' : ' page-sub') + '">')
    .replace(/href="#top" aria-label="Nexus AI Horizon, home"/, 'href="index.html" aria-label="Nexus AI Horizon, home"');
  for (const [hash, [file, key]] of Object.entries(navMap)) {
    const cur = key === p.key ? ' aria-current="page"' : '';
    h = h.split('href="' + hash + '">').join('href="' + file + '"' + cur + '>');
    h = h.split('href="' + hash + '"').join('href="' + file + '"');
  }
  let f = foot.replace('href="#top" aria-label="Nexus AI Horizon, top of page"', 'href="index.html" aria-label="Nexus AI Horizon, home"');
  for (const [hash, [file]] of Object.entries(navMap)) f = f.split('href="' + hash + '"').join('href="' + file + '"');
  let body = p.body.join('\n\n  ').replace(/href="#contact"/g, 'href="contact.html"').replace(/href="#every-call"/g, 'href="how-it-works.html"');
  const out = h + '<main id="main">\n\n  ' + body + '\n\n' + '</main>' + f;
  fs.writeFileSync(path.join(DIR, p.file), out);
  const h1 = (out.match(/<h1[ >]/g) || []).length;
  console.log(p.file.padEnd(18), 'h1:', h1, 'bytes:', out.length);
}
