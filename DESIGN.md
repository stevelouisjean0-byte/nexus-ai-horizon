# Design

<!-- impeccable:design-schema 1 -->

## World

**Picked up.**

The product is invisible: a voice on a phone line at an hour when nobody at the business is awake. So the page is built the way a hardware company would build it, around the one object the customer can picture: a phone, on a white ground, showing the call being taken. Everything else on the page is a vignette of what that call produced: a calendar slot, a text message, an on-call alert, a CRM record.

The surface is light, quiet and product-led. White and soft grey grounds alternate. Content sits in large, softly rounded tiles with no borders and almost no shadow. Type is a single neutral grotesk set tight and large. One accent, the blue of the logo, is used for actions, the booked slot and the hours grid, and nowhere decoratively. There are no dark surfaces anywhere on the page; the only near-black pixels are the phone's camera island and the text itself.

The brief for this world, recorded 27 September 2026: premium, light, an Apple-like feel, well-built components, no dark colours. That supersedes the original dark brief.

Rejected alternatives on record:

- *While you were out* (`DESIGN.while-you-were-out.md`, `while-you-were-out/`): the telephone message-slip world on a navy desk. Well built and verified, rejected for being dark.
- *The Night Shift* (`DESIGN.night-shift.md`, `homepage.html`): dark, cinematic, HUD clock and reel numbering. Rejected twice.
- The live site: white ground but five typefaces, four equal cards, a fake terminal and unsourced figures. Its light ground is the one thing the new world keeps.

## Tokens

```
--white     #ffffff   page ground
--grey      #f5f5f7   alternate band, tile fills on white, input fills
--grey-2    #e8e8ed   hairlines, empty hours
--grey-3    #d2d2d7   secondary button border
--ink       #1d1d1f   text
--ink-2     #6e6e73   secondary text, ledes
--ink-3     #86868b   captions, credits

--blue      #0b6fd6   primary action, links, the booked slot, office hours
--blue-2    #0a5cb8   hover
--blue-soft #e9f2fd   open calendar cells, info chips, status message
--sky       #35c3f5   gradient end on the one coloured tile and the hero glow
--green     #1f9d55   call timer, confirmation chips (never as body text)
--amber     #b25e09   the urgent chip and alert icon
--red       #c0392b   form errors
```

Contrast: ink on white 16.1:1; ink-2 on white 5.2:1; ink-3 on white 3.9:1 and used only at 12px captions with a larger-text exemption avoided by keeping it out of body copy; white on blue 4.9:1; blue on white 4.9:1; blue-2 on blue-soft 5.6:1.

Radii: 28px tiles and cards, 20px inner vignettes, 12px inputs, pill buttons. Shadows: one soft ambient shadow on the form card and the phone, none on tiles at rest.

## Type

One family: **Geist**, 300 to 800, the closest widely available match to a system grotesk.

```
h1     clamp(2.75rem, 1.9rem + 4.2vw, 5.25rem)  700, -0.035em, line 1.02, centred
h2     clamp(2rem, 1.45rem + 2.6vw, 3.5rem)     700, -0.028em, line 1.06
h3     clamp(1.375rem, 1.2rem + .8vw, 1.75rem)  700, -0.02em, line 1.15
lede   clamp(1.1875rem, 1.05rem + .6vw, 1.5rem) 400, line 1.4, ink-2
body   17px                                     400, line 1.47
small  14px; micro 12px (captions, credits, calendar labels)
when   clamp(2.4rem, 2rem + 1.5vw, 3.25rem)     300, the time of each staged call
```

No eyebrow labels, no all-caps anywhere. Hierarchy is weight and size. Ledes run 52ch, prose 60ch.

## Motion

The page opens as a scene and is otherwise quiet. Three authored ideas, all tied to the product:

1. **The scene.** Above 900px the phone is pinned for the length of the opening. Act 0 is the dated line and the ringing phone rising beneath it; from act 1 the phone slides right (1.1 s, strong ease-in-out) and four short lines scroll down the left, each arriving as the call reaches it. The captions replay from the transcript at reading pace with a running timer, and a chip appears at each moment the call produces something. Past acts sit back at 22 percent opacity. On narrower screens nothing pins: copy, then the phone playing the whole call, then the acts as a short story.
2. **Light and depth.** A soft cyan light drifts behind the phone on a 26 s reversing loop. The chapter image and the oversight photo move a few percent against the scroll, and the chapter statement inks in word by word as it crosses the viewport. Both use CSS scroll-driven animations under `@supports`, so they cost nothing on the main thread and are absent where unsupported.
3. **The hours fill in.** The 168-cell week grid paints its 50 office hours in sequence when it enters view.

Everything else is one entry reveal per block (22px rise, 640ms, strong ease-out, 70ms sibling stagger), a staggered word rise on the headline at load, a 3px lift on tile hover for fine pointers, and a 0.97 press on buttons. Only `transform`, `opacity` and `color` animate. No library. Without JavaScript the phone shows the end of the call and all nine chips. Under `prefers-reduced-motion` nothing pins or drifts, the demo does not autoplay, and Replay shows the finished state.

## Components

- **Device** `.device` — a silver phone frame drawn in CSS, white screen, camera island, status bar, and two views: ringing (pulse rings, line name, accept and decline) and in-call (line name and timer, caption feed with agent grey left and caller blue right, chip row). It is a real component, not a screenshot.
- **Scene** `.scene` — the sticky stage holding the phone, and the acts that scroll over it. Act 0 is the hero copy; acts 1 to 4 are one line each, tagged to transcript lines by `data-act`.
- **Chapter** `.chapter` — a full-width band: a daylight photograph (or a generated clip) under a white veil, with a large statement that inks in as it scrolls.
- **Bento** `.bento` — six tiles on a three-column grid: a two-by-two calendar tile, one blue gradient tile with the ringing mark, and four single tiles each carrying one vignette (quote, text message, on-call alert, CRM record). Gapless at every width; the grid re-flows to two columns then one.
- **Gallery** `.gallery-track` — four staged-call cards in a horizontal scroll-snap track with round previous and next buttons, arrow-key support, and native swipe on touch.
- **Week grid** `.week` — 7 rows by 24 columns, labelled, with an accessible description.
- **Form card** `.form-card` — grey filled inputs, 48px tall, blue focus ring, inline errors, consent line.
- **Transcript disclosure** `.transcript-details` — a native `details` element holding the full call.

## Rules

1. **No figure without a source.** The page carries arithmetic (50 of 168) and no statistics.
2. **Every record is labelled staged.** Fictional business, fictional caller, 555 numbers; the label sits under the phone, on every card, and in the footer.
3. **No dark surfaces.** Grounds are white or grey; the darkest fill is the blue button.
4. **One accent.** Blue for action and the booked state; green and amber only in small semantic chips.
5. **Animate from readable.** Nothing becomes legible only through motion.
6. **One fact, one field.** The timeline, phone number and email are absent because none is confirmed; see `picked-up/HANDOFF.md`.
7. **Plain voice.** Sentence case, no superlatives, no filler verbs.

## Open

- The implementation timeline (the live site says both 14 and 21 days).
- A working telephone number and an email address on the live domain.
- The privacy policy, SMS terms and terms of service, which the footer links to and which currently return 404.
- A cleared audio recording for the demonstration call, to play alongside the captions.
- A photograph of a real customer's premises, to replace the credited stock image in the oversight section.
