# Design

<!-- impeccable:design-schema 1 -->

## World

**While you were out.**

The telephone-message pad is the one object every service business owner recognises from the years before voicemail: *For / Date / Time / From / Of / Phone / Message*, a row of checkboxes, and a line for whoever took the call. It is the artifact of a missed call. This site is built on its anatomy, with one change: the slip comes back filled in. Not "please call back" but *address taken, urgency judged, booked 7:30 to 9:00, confirmation texted, written to your CRM*.

The page is a desk at night. Slips sit on a deep navy ground, and each one is a staged demonstration record labelled as such. Nothing on the page is a statistic; everything is a record the visitor can read.

The brief pinned a dark palette with an electric-blue or cyan accent and warm-white text. That holds. The blue becomes ballpoint ink on paper and screen-cyan on the ground: the same accent, two surfaces.

Rejected alternatives on record:

- *The Night Shift* (`DESIGN.night-shift.md`, `homepage.html`): HUD clock, reel numbering, serif-versus-mono voices, sodium orange. Competent, but its chrome (tracked mono caps, section numbers, a time strip, a status dot) is the AI-site vocabulary the design skills now flag, and the orange broke the pinned palette. Kept as anti-reference.
- *Operations Console* (`prototype-v1.html`): the instrument-panel reading of the same brief. Rejected earlier for the same reason.
- The live site: white ground, Times Square video, four equal cards, a fake terminal, and roughly twenty unsourced figures. Evidence of what not to do, and the source of the retained copy voice.

## Tokens

```
--night      #0c1620    page ground (deep navy, not black)
--night-2    #101d29    alternate band
--raise      #142434    raised surfaces on the ground
--hair       rgba(240,236,226,.14)   rules on the ground
--hair-2     rgba(240,236,226,.28)   emphasised rules

--bone       #f1ece2    primary text on the ground (warm white)
--bone-2     #b9c0c7    secondary text on the ground
--bone-3     #8a949d    muted text on the ground

--paper      #f4efe4    the slip
--paper-edge #e3dccb    slip inset edge
--paper-rule #d8d0c0    ruled lines on the slip
--ink        #19232c    printed text on the slip
--ink-2      #5f676e    printed labels on the slip

--blue-ink   #1a56d6    the accent on paper (ballpoint)
--cyan       #5cc8f2    the accent on the ground (ticks, primary button, focus)
--cyan-2     #8ddcf8    primary button hover
```

Contrast: bone on night 14.9:1; bone-2 on night 8.6:1; bone-3 on night 5.0:1; blue-ink on paper 5.4:1; ink-2 on paper 5.1:1; night on cyan (primary button) 9.6:1. Cyan is never body text. Slips carry `color-scheme: light` so native controls render for paper.

## Type

One family: **Libre Franklin**, 300 to 900. Franklin Gothic is the face of American office forms, which is where the slip comes from.

```
h1         clamp(2.6rem, 1.6rem + 4.2vw, 5.4rem)   800, -0.028em, line 1.02
h2         clamp(2rem, 1.4rem + 2.4vw, 3.5rem)     800, -0.028em, line 1.02
lede       clamp(1.125rem, 1rem + .5vw, 1.375rem)  400, line 1.45, bone-2
body       1rem                                    400, line 1.55
slip fill  0.98rem                                 600, blue-ink, tabular numerals
slip label 0.8rem                                  500, ink-2
floor      0.78rem (slip footer, credits)
```

Hierarchy is carried by weight and colour before size. There are no eyebrow labels and no all-caps labels except the printed pad title *WHILE YOU WERE OUT*, which is the artifact's own lettering.

Measure: 44ch for ledes, 62ch for prose.

## Motion

One authored idea: **the slip fills in.** Each field is revealed left to right with a `clip-path` wipe, 420ms on a strong ease-out, staggered 90ms per field; the checkboxes tick after the fields; the signature comes last. The hero slip fills on load once fonts are ready. Every other slip fills when it scrolls into view. The transcript lines and the nine-item checklist reveal on entry with the same easing.

Rules: only `transform`, `opacity` and `clip-path` animate. No animation library. Nothing depends on JavaScript to be readable: without it, every slip is already filled. Under `prefers-reduced-motion` everything renders in its final state with no transition. Hover motion is gated to fine pointers. Buttons press with `scale(0.97)` at 160ms.

## Components

- **Slip** `.slip` — paper rectangle, 2px radius, inset paper edge, tinted desk shadow, faint paper tooth. Head with the printed title; `dl` of fields on ruled lines; a checkbox list; a footer with who took the call. Variants: hero (large, tilted -1.1°), desk (four, tilted in alternation, offset vertically), form (the visitor's own slip, tilted 0.7°). Tilt is removed below 720px.
- **Transcript** `.transcript` — a plain dialogue: speaker label, line, and a cyan margin note naming what the line achieved. No transport bar until an audio asset exists.
- **Desk** `.desk` — a 12-column spread of four slips at different column starts and vertical offsets, so it reads as papers on a desk rather than a card row. Collapses to one column.
- **Checklist band** `.checks` — nine items on hairlines, 28px boxes that tick on entry. No boxes around the list.
- **Photo band** `.hours` — one full-bleed stock photograph under a navy gradient, headline bottom-left, credit under it.
- **Form slip** `.form-slip` — labels above, ballpoint-blue entries, errors below the field in a print red, consent line with the privacy link.

## Rules

1. **No figure without a source.** The page carries arithmetic (50 of 168 hours) and no statistics.
2. **Every record is labelled staged.** Fictional businesses, 555 numbers, "Staged demonstration" on every slip and in the footer.
3. **One accent, two surfaces.** Ballpoint blue on paper, cyan on the ground. Never both on one surface.
4. **Animate from readable.** No entrance may be the only way content becomes legible.
5. **No chrome.** No eyebrows, no section numbers, no time strips, no status dots, no scroll cues, no middle-dot metadata strings.
6. **One fact, one field.** The timeline, the phone number and the email are not stated because none is confirmed; see `while-you-were-out/HANDOFF.md`.
7. **Plain voice.** No superlatives, no "seamless", no "leading". Sentences, not slogans, except the headline.

## Open

Carried as absences on the page, not as placeholders:

- The implementation timeline (the live site says both 14 and 21 days).
- A working telephone number and an email address on the live domain.
- The privacy policy, SMS terms and terms of service, which the footer links to and which currently return 404.
- A cleared audio recording for the demonstration call.
- A white-on-dark version of the logo lockup; the build uses the mark alone with the name set in type.
