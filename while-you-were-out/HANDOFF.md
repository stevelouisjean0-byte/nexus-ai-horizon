# Handoff: the "While you were out" homepage

Built 27 September 2026 for nxaihorizon.com. This folder is a complete, static
build of the redesigned homepage. Open `index.html` in a browser to view it. It
has no build step and no dependencies beyond one Google Fonts stylesheet.

## What is here

| File | Purpose |
|---|---|
| `index.html` | The page. Seven sections plus header and footer. |
| `styles.css` | All styling. Tokens at the top match `../DESIGN.md`. |
| `script.js` | Menu toggle, the slip fill-in, scroll reveals, checklist ticks, form validation. The page is fully readable with JavaScript off. |
| `assets/logo.png` | The infinity mark, cropped from the live site's `AI-Main-Logo-.png`. See "Logo" below. |
| `assets/night-street.jpg`, `assets/night-street-800.jpg` | One stock photograph, credited on the page. See "Photo provenance". |
| `assets/favicon.svg` | A small slip-and-tick mark. Replace with a brand favicon when one exists. |
| `verify.cjs` | The real-Chrome check that was run on this build. Run from the `wh` project or with `NODE_PATH` pointing at its `node_modules`. |
| `shots/` | Screenshots and `audit.json` from the last verification run. |
| `SKILLS-REVIEW.md` | Which design skills shaped the build and how. |

The previous prototype (`../homepage.html`, "The Night Shift") and its design
record (`../DESIGN.night-shift.md`) are kept as evidence and are superseded by
this build and by `../DESIGN.md`.

## What the page says, and where each fact comes from

Nothing on the page is invented. Every factual sentence traces to `../PRODUCT.md`
or to the live site's own published copy.

- What the systems do (answer, qualify, route urgent calls, book, text a confirmation, write to the CRM): `PRODUCT.md`, Product Purpose.
- Four industries and no others: `PRODUCT.md` and the live About page.
- Runs under the number the business already publishes; nothing ported or replaced: `PRODUCT.md`, Operating Context, and the live "Your line. Your number." section.
- A person reviews the early calls before unattended operation: `PRODUCT.md`, principle 4, and the live About page. The live site says "the first 200 calls"; the number is not repeated here because it is unconfirmed (audit item C-20).
- "You can read every transcript and every rule, and if you want it off, it goes off": the live About page's "No black boxes" principle, in plainer words. Confirm this is still the commitment.
- A twenty-minute strategy call with no deck: the live Contact page. Confirm the length.
- Small studio in Lower Manhattan, New York metro service area: `PRODUCT.md`, Brand Commitments.
- 50 of 168 hours: arithmetic, not a statistic. A business open 8 to 6, Monday to Friday, is open 50 hours; the week has 168.

**Every slip and the transcript are staged demonstrations.** The businesses
(Verrazano Pipe & Heat, Sackett Street Realty, Two Bridges Moving, Fulton Ferry
Advisors), the callers and the addresses are fictional and every phone number is
a 555 number. Each slip says "Staged demonstration" or "Staged" on its face, the
hero says so beside the headline, and the footer says so again. If any of these
fictional names collides with a real business, rename it; nothing else depends on
the names.

## What is deliberately absent

These are the undecided facts from `PRODUCT.md`. The page does not state them
and carries no placeholder for them, so there is nothing to forget to remove.

1. **Implementation timeline.** The live site says 14 days in three places and 21 days in three others. Choose one, and it can go in the checklist band or the contact section.
2. **A telephone number.** None is published anywhere, for a company that sells call handling. When one exists it belongs in the header and the footer.
3. **An email address on the live domain.** Both published addresses sit on `nexusaihorizon.com`, which is a parked domain. The page prints no email.
4. **Privacy policy, SMS terms, terms of service.** The footer and the consent line link to `/privacy-policy/`, `/sms-terms/` and `/terms/`. All three currently return 404 and must exist before the form goes live; the form collects a mobile number and consent to be texted.
5. **A cleared audio recording** of the demonstration call. The transcript section is written so that a player can be added above it without changing the copy.
6. **The supported integration list.** The page says "your CRM, your dispatch board, your calendar" and names no vendor.
7. **A white-on-dark logo lockup.** See below.
8. **Leadership names and photographs.** None on the page, none on record.

## Standing problems on the live site

Unchanged from the 3 September audit (`../audit-and-direction.html`). None of
these waits for the redesign:

- Eleven homepage CTAs and both email addresses point at the parked domain `nexusaihorizon.com`.
- Roughly twenty performance and compliance figures are published without a source. This build ships none of them.
- The heading structure is unusable by screen readers (an `h4` before the `h1`, statistics as `h2`s).
- Five font families load at every weight. This build loads one.

## Logo

The live lockup is a blue infinity mark with the wordmark "NEXUS AI HORIZON" in
navy beneath it. On the dark ground the navy wordmark disappears, so the build
uses the mark alone (cropped from the original PNG, nothing redrawn) with the
company name set in the page's typeface beside it. If a white or light version
of the full lockup exists, drop it into `assets/logo.png` and remove the
`<span>` in `.brand`. The wordmark's casing on the page is always "Nexus AI
Horizon"; the live site's metadata still renders "Nexus Ai Horizon".

## Photo provenance

| File | Source | Author | Licence | Notes |
|---|---|---|---|---|
| `night-street.jpg` (1600 by 1988) and `night-street-800.jpg` | Pexels photo 30213798, "Night View of Chinatown Street in New York City" | Allen Boguslavsky | Pexels licence (free to use, attribution not required, given anyway) | Downloaded 27 September 2026 from the Pexels CDN. Credited on the page as a stock image, not a customer site. Chosen because the shutters are down and the signs above them still show phone numbers, which is the product's premise. |

The photograph is a placeholder in the sense that it is not a client site. It
can stay, since it is credited and labelled, or be replaced with a photograph of
a real customer's premises once one is cleared.

## Type

Libre Franklin, weights 300 to 900, loaded from Google Fonts with `display=swap`.
For the WordPress theme, self-host the two or three weights actually used (400,
500, 600, 800, 900) as WOFF2 and preload the 800 weight; that removes the
third-party request and the swap flash.

## The contact form

The form validates in the browser (required fields, email shape, ten-digit phone,
consent) and shows inline errors below the field, focusing the first one. It
does **not** submit anywhere: this is a static prototype. In WordPress, wire it
to the form handler and CRM of choice and add:

- bot protection (Turnstile, hCaptcha or reCAPTCHA; the live form has none),
- the consent checkbox as a stored field with a timestamp, since it authorises calls and texts,
- a real destination for the privacy policy link.

Field names match the live Contact page (first name, last name, company,
industry, work email, mobile, message) plus "best time to call". Keep the names
stable when wiring analytics.

## WordPress mapping

`PRODUCT.md` records the stack decision: keep WordPress, replace Elementor Pro
and `hello-elementor` with a custom block theme. The page maps onto that as:

- Each `<section>` becomes a block pattern. The slip becomes one reusable block with fields (for, date, time, from, of, phone, message, checks, taken-by) so the four industry slips and the hero slip are the same block with different content.
- Content that must stay editable per `PRODUCT.md`: hero headline and lede, every CTA label and destination, the transcript lines and their margin notes, the nine checklist items, the industry slips, the oversight copy, the contact copy, and the footer.
- `styles.css` becomes the theme stylesheet; the tokens at the top become `theme.json` colour and typography settings.
- `script.js` is plain and small; enqueue it deferred. Nothing on the page depends on it.
- Keep the existing URLs, Rank Math and GA4. Add a conversion event on the form's success state.

## Verification

Run on the final build with `verify.cjs`, driving real Chrome (not headless), at
1440 by 900, 1280 by 720, 820 by 1180 and 390 by 844 with touch emulation.
Results are in `shots/audit.json`; screenshots are beside it.

Recorded outcome, 27 September 2026, final pass:

| Check | Result |
|---|---|
| Horizontal overflow | None at any of the four widths (`scrollWidth` equals `clientWidth`). |
| Headings | One `h1`, seven `h2`s in document order, no skipped levels. |
| Em dashes or en dashes in visible text | Zero. |
| Links to `#` | Zero. All anchors resolve to sections on the page or to the three policy URLs. |
| Fonts | Libre Franklin confirmed loaded at 400 and 800. The only element not in it is the consent checkbox itself. |
| Contrast | Every sampled text element passes WCAG AA; lowest ratio on the page is 5.0:1 (muted footer text on navy). |
| Inline spans given sizing | None. |
| All-caps text | Only the printed slip titles. |
| Tap targets under 40px | The consent checkbox (18px, but its label is the target) and nothing else. |
| Images | Logo mark 583 by 211 and both photo sizes load; the browser picks the 800px source on the phone. |
| Hero | Fills in on load after fonts are ready; the primary button sits inside the first viewport at every width tested. |
| Reduced motion | Slips render filled immediately with no transition. |
| Keyboard | Skip link first, then the brand, then a visible cyan focus ring on each nav link. |
| Form | Empty submit marks all eight required fields inline and focuses the first. |
| Console | No errors, no failed requests. |

One note on the tooling: a full-page screenshot of an emulated phone resizes
the viewport, which changes `vh`-based heights and moves the sticky header, so
the earlier stitched mobile capture showed a false repeat of the hero. The
final script captures the phone viewport by viewport instead, and the photo
band's height is capped so the artifact cannot recur.
