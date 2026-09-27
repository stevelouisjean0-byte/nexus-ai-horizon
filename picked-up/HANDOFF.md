# Handoff: the "Picked up" homepage

Built 27 September 2026 for nxaihorizon.com, after the brief changed from
"dark with a cyan accent" to "premium, light, Apple-like, well-built
components, no dark colours". This folder is a complete, static build of the
redesigned homepage. Open `index.html` in a browser. No build step; one Google
Fonts stylesheet is the only external request.

## What is here

| File | Purpose |
|---|---|
| `index.html` | The page: hero with the phone demo, the six-tile bento, the industries gallery, the hours grid, oversight, contact, footer. |
| `styles.css` | All styling. Tokens at the top match `../DESIGN.md`. |
| `script.js` | Menu, entry reveals, the call demo (captions, timer, chips, Replay), the week-grid fill, the gallery buttons and keys, form validation. The page is fully readable with JavaScript off. |
| `assets/logo.png` | The infinity mark, cropped from the live lockup, used in the header at 46px. |
| `assets/logo-lockup.png` | The full lockup as supplied on the live site, used in the footer. It reads on white, so nothing was redrawn. |
| `assets/studio-street.jpg` | One stock photograph, credited on the page. See "Photo provenance". |
| `assets/favicon.svg` | A blue tick on a rounded square. Replace with a brand favicon when one exists. |
| `check.cjs` | The real-Chrome verification that was run on this build. Run from the `wh` project or with `NODE_PATH` at its `node_modules`. |
| `shots/` | Screenshots and `audit.json` from the last verification run. |

Earlier builds are kept as evidence and superseded: `../while-you-were-out/`
(the navy message-slip world, `../DESIGN.while-you-were-out.md`) and
`../homepage.html` (the Night Shift, `../DESIGN.night-shift.md`).
`../DESIGN.md` now describes this world; `../PRODUCT.md` records the changed
brief under Brand Commitments.

## The cinematic pass (27 September, afternoon)

Added on request after the first light build, and kept light:

- **The opening scene.** The hero is a dated line ("Tuesday, 2:14 a.m. The phone rings. It gets answered."), one button, and the ringing phone rising below. On screens wider than 900px the phone is pinned while four short acts scroll down the left; the phone slides right when the first act arrives and the call plays act by act (ringing, answered, qualified, booked). Each act's lines are tagged `data-act` in the transcript, so the split is editable. On narrower screens nothing pins: the copy, then the phone playing the whole call, then the four acts as a short story.
- **Light and depth.** A soft drifting light behind the phone (26 s, reversing), scroll-linked parallax on the chapter image and the oversight photo, and a word-by-word ink-in on the chapter statement as it scrolls into view. The parallax and ink-in use CSS scroll-driven animations, so they run on the compositor and simply do not happen in browsers without support.
- **The chapter.** A full-width band after the bento with a daylight Bay Ridge street still (the staged call's neighbourhood) under a white veil, and the statement "Calls arrive after hours, during jobs, and in bursts. Voicemail qualifies nobody." A generated clip can replace the still; see "The chapter video" below.
- Everything honours `prefers-reduced-motion`: no pinning, no drift, no ink-in, the phone shows the finished call.

## The chapter video

You asked for a generated clip in the chapter band. The Seedance skill's RunComfy
CLI has no Windows build, so `make-video.cjs` in this folder calls the RunComfy
Model API directly: it animates the Bay Ridge still (public Pexels URL) with a
locked-off, subtle-motion prompt, silent, 8 seconds, about $2.80 at $0.35 per
second. It needs a RunComfy API token:

```
set RUNCOMFY_TOKEN=your-token
node make-video.cjs 8
```

It saves `assets/street-timelapse.mp4` and a JSON record of the request. Then
in `index.html`, replace the chapter's `<img>` with:

```
<video class="chapter-video" muted playsinline loop preload="none" poster="assets/street-poster.jpg" data-src="assets/street-timelapse.mp4"></video>
```

The script already handles it: the clip loads only when the band nears the
viewport, plays muted and looped, pauses off-screen, and never loads under
reduced motion or a data-saver setting. Rerun `../wp-theme/build-theme.cjs`
afterwards so the theme picks it up.

## The components

- **The phone.** A CSS-drawn silver phone with a white screen and two views: ringing (pulse, name, accept and decline) and in-call (captions with a running timer, and a chip at each moment the call produces something: name taken, urgent, booked, texted, saved). The transcript in the "Read the full transcript" disclosure is the single source; the phone reads its lines, their `data-chip` labels and their `data-act` numbers from it, so editing the transcript edits the demo. Replay restarts the current act (or the whole call on narrow screens). Under reduced motion it shows the finished call and nothing autoplays.
- **The bento.** Six tiles, gapless at every width. Each vignette is real markup, not a screenshot: a week calendar with the booked slot, a ringing mark on the one coloured tile, the agent's first sentence as a quote, the confirmation text message, the on-call alert, the CRM record.
- **The industries gallery.** Four staged-call cards in a horizontal scroll-snap track with round previous and next buttons, arrow-key support when the track is focused, and native swipe on touch.
- **The hours grid.** 168 cells, seven rows by 24 columns, the 50 weekday office hours painted in blue in sequence on entry. It carries an accessible description.
- **The form.** Grey filled inputs, blue focus ring, inline errors that focus the first problem, a consent line for calls and texts.

## What the page says, and where each fact comes from

Nothing on the page is invented. Every factual sentence traces to `../PRODUCT.md` or to the live site's own copy.

- What the systems do (answer, qualify, route urgent calls, book, text a confirmation, write to the CRM): `PRODUCT.md`, Product Purpose.
- Four industries and no others: `PRODUCT.md` and the live About page.
- Runs under the number the business already publishes; nothing ported: `PRODUCT.md`, Operating Context, and the live "Your line. Your number." section.
- A person reviews the early calls: `PRODUCT.md`, principle 4, and the live About page. The live site's "first 200 calls" figure is not repeated because it is unconfirmed.
- "You can read every transcript and every rule, and if you want it off, it goes off": the live About page's "No black boxes" principle, in plainer words. Confirmed by Steve on 27 September 2026.
- A twenty-minute strategy call with no deck: the live Contact page. Confirmed by Steve on 27 September 2026.
- Small studio in Lower Manhattan; New York metro service area: `PRODUCT.md`, Brand Commitments.
- 168 hours and 50 office hours: arithmetic (8 to 6, Monday to Friday), not a statistic.

**Every call, slip and vignette is a staged demonstration.** Verrazano Pipe & Heat, Sackett Street Realty, Two Bridges Moving and Fulton Ferry Advisors are fictional; every phone number is a 555 number; the technician's first name in the text message is invented for the vignette. The label appears under the phone, on every gallery card, and in the footer. If a fictional name collides with a real business, rename it; nothing else depends on the names.

## What is deliberately absent

The undecided facts from `PRODUCT.md`. The page does not state them and carries no placeholder for them.

1. **Implementation timeline.** The live site says 14 days in three places and 21 in three others. Choose one and it can go in the contact section.
2. **A telephone number.** None is published anywhere. When one exists it belongs in the header and footer.
3. **An email address on the live domain.** Both published addresses sit on the parked domain `nexusaihorizon.com`. The page prints no email.
4. **Privacy policy, SMS terms, terms of service.** Linked from the footer and the consent line; all three currently return 404 and must exist before the form goes live, since it collects a mobile number and consent to be texted.
5. **A cleared audio recording** of the demonstration call, to play alongside the captions.
6. **The supported integration list.** The page says "your calendar", "your CRM", "the property system" and names no vendor.
7. **Leadership names and photographs.** None on the page, none on record.

## Standing problems on the live site

Unchanged from the 3 September audit (`../audit-and-direction.html`). None waits for the redesign: eleven CTAs and both emails point at the parked domain; roughly twenty figures are published without a source; the heading structure is unusable by screen readers; five font families load at every weight.

## Photo provenance

| File | Source | Author | Licence | Notes |
|---|---|---|---|---|
| `studio-street.jpg` (1200 by 1800) | Pexels photo 12168007, "Brown Concrete Building" | Tatiana Castrillon | Pexels licence (free to use; attribution given anyway) | Downloaded 27 September 2026 from the Pexels CDN. A cleaners-and-tailors storefront in New York in daylight: a real small service business, no people prominent. Credited on the page as a stock image, not a customer site. Replace with a photograph of a real customer's premises once one is cleared. |

## Type

Geist, 300 to 800, from Google Fonts with `display=swap`. It is the closest widely available match to a system grotesk. For the WordPress theme, self-host the weights used (400, 500, 700) as WOFF2 and preload the 700.

## The contact form

Validates in the browser (required fields, email shape, ten-digit phone, consent), shows inline errors and focuses the first. It does **not** submit anywhere; this is a static prototype. In WordPress, wire it to the form handler and CRM and add bot protection (the live form has none), store the consent with a timestamp, and give the privacy policy link a real destination. Field names match the live Contact page plus "best time to call"; keep them stable for analytics.

## WordPress mapping

`PRODUCT.md` records the stack: keep WordPress, replace Elementor Pro and `hello-elementor` with a custom block theme.

- Each `<section>` becomes a block pattern. The phone demo becomes one block whose content is the transcript list (lines, speaker, optional chip label and kind). The bento tiles become one tile block with a "vignette" variant. The gallery card becomes one block repeated four times.
- Editable per `PRODUCT.md`: hero headline and lede, every CTA label and destination, the transcript, the tile copy, the four industry cards, the hours copy, the oversight copy, the contact copy, the footer.
- `styles.css` becomes the theme stylesheet; the tokens become `theme.json` colour and typography settings.
- `script.js` is small and dependency-free; enqueue it deferred.
- Keep the existing URLs, Rank Math and GA4. Add a conversion event on the form's success state.

## Verification

Run with `check.cjs`, driving real Chrome (not headless), at 1440 by 900, 1280 by 720, 820 by 1180 and 390 by 844 with touch emulation. Two rounds: the first flagged Apple's caption grey (#86868b) failing AA on white and grey, white text over the light end of the gradient tile, footer links a few pixels under 44px, and the phone sitting just below the first desktop viewport. All were fixed; the second round is recorded here.

| Check | Result |
|---|---|
| Horizontal overflow | None at any of the four widths. |
| Headings | One `h1`; `h2` per section; `h3` per tile and card; no skipped levels. |
| Em dashes or en dashes in visible text | Zero. |
| Links to `#` | Zero. |
| Fonts | Geist confirmed loaded at 400 and 700; the only element not in it is the consent checkbox itself. |
| Contrast | Every sampled text element passes WCAG AA; lowest ratio on the page is 4.5:1. |
| Bento | Tiles cover 96 percent of the grid box at every width; the remainder is the 16px gutters. No empty cell. |
| Tap targets | Only the consent checkbox (18px, but its label is the target) and two inline text links are under 44px. |
| First viewport | Primary button at 545px and the phone's top at 601px on a 900px-tall desktop; on the phone the button sits at 494px and the device starts at 582px. |
| Demo | Autoplays when the phone enters view; chips appear as the call progresses; Replay restarts it. |
| Gallery | The next button moves the track; arrow keys work when the track is focused. |
| Transcript disclosure | Opens and shows all fifteen lines. |
| Reduced motion | The phone renders the finished call with all nine chips immediately; nothing autoplays. |
| Keyboard | Skip link, then the brand, then a visible blue focus ring on each nav link. |
| Form | Empty submit marks all eight required fields inline and focuses the first. |
| Console | No errors, no failed requests. |

Full-page captures on an emulated phone are unreliable (the viewport resize changes vh-based sizes), so `check.cjs` captures the phone viewport by viewport; those files are `shots/mobile-page-NN.png`.

**Cinematic pass, later the same day.** Re-verified after the scene, the chapter band and the parallax were added. Same results at all four widths: no overflow, no console errors, lowest contrast 4.5:1, the scene reaches act 4 with the phone shifted and the call played, the transcript opens, reduced motion renders the finished call with no pinning, the form flags eight fields. Two regressions were caught and fixed on the way: the drifting light behind the phone extended past the viewport (now clipped at the stage), and the pinned stage sat over the transcript disclosure (now its own section after the scene). The WordPress theme was regenerated and checked under Playground with identical results, after a theme version bump so WordPress dropped its cached pattern list.
