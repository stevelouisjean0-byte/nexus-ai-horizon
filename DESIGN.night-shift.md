# Design

<!-- impeccable:design-schema 1 -->

## World

**The Night Shift.**

The product exists because calls arrive when nobody is there to take them. The site is set at that hour and stays there: a clock in the corner starts at 23:47 and advances to 06:12 as you scroll, and the sections are numbered as reels rather than as features. The visitor is not reading a services page; they are watching a night pass in a business that answers.

Two light sources carry the whole surface, and they are the two lights actually present at 2am:

- **Sodium** `#F0703A` — sodium-vapour street lighting. Reserved for the human side: the caller, urgency, money at stake, unanswered items, the primary action.
- **Cold** `#7EC8D8` — the light of a screen that is still on. Reserved for the system: confirmations sent, records written, agent online.

Nothing else is coloured. When a visitor sees orange, something is at stake; when they see cyan, something was handled. That mapping is the design system's single strongest rule and it is never used decoratively.

Rejected alternative on record: an *Operations Console* world in near-black and deep navy with electric blue and cyan (`prototype-v1.html`). It matched the originally pinned palette but read as an instrument panel — competent, and identical to every AI-infrastructure site. The accent meant nothing in particular. Kept as anti-reference.

## Tokens

```
--black    #0A0A0C   page ground
--ink      #0E0E11   alternate section ground
--raise    #131317   panels, transcript, form
--graphite #1B1B20   controls, scrollbar thumb
--bone     #E9E4DA   primary text (warm, never pure white)
--mid      #A8A29A   secondary text
--dim      #8E8A82   labels, metadata
--hair     rgba(233,228,218,.13)   1px rules
--hair-2   rgba(233,228,218,.26)   emphasised rules, focus edges
--sodium   #F0703A   human / urgent / primary action
--cold     #7EC8D8   system / confirmed
```

Bone on black is 14.6:1. Mid on black is 8.4:1. Dim on black is 6.2:1. Sodium on black is 6.6:1. All pass AA for body text; sodium and cold are never used *as* body text, only as accents and short labels.

## Type

Two families, no more.

- **Instrument Serif** — display and any sentence the visitor is meant to feel. Also the **caller's voice** in the transcript.
- **IBM Plex Mono** — body, labels, data, and the **agent's voice** in the transcript.

That second rule is the one worth protecting: in the demonstration the caller is set in serif and the agent in monospace, so you always know who is speaking without a label. It runs through the whole site.

```
h1        clamp(52px, 12.4vw, 196px)   line-height .83   tracking -.035em
statement clamp(30px, 4.4vw, 68px)     serif, italic accents in sodium
say       clamp(19px, 2.1vw, 25px)     serif, lead paragraphs
note      12.5px                       mono, body copy
lab       11px, .24em tracking, caps   mono, labels — the floor
```

Nothing renders below **11px**. Body measure is capped between 32ch and 56ch depending on column.

## Motion

One authored idea, not a library of effects: **the night advances as you scroll.**

- The HUD clock runs 23:47 → 06:12 across the document, tied to scroll position rather than to real time.
- Chapter cards interrupt the page with a timecode and one sentence — the narrative beats between sections.
- The eight-stage pipeline is a pinned sequence: the filmstrip advances, a ghost numeral counts, and a plate swaps per stage.
- Entrances are `power4.out` from an already-visible default. Everything reads correctly with JavaScript disabled.

Rules that hold it together: GSAP + ScrollTrigger is the only animation library; both load `defer` and the page never depends on them for legibility. Canvas loops are gated by `IntersectionObserver` and stop when scrolled away. Only `transform` and `opacity` animate — no width, padding or margin transitions.

`prefers-reduced-motion` is a full parity path, not a degradation: the pinned reel is replaced by `.reel-static`, a complete stage-by-stage list carrying identical information.

## Components

- **Chapter card** — full-bleed timecode + one sentence. The section divider.
- **Transcript** — two-voice feed with a synchronised system readout beside it; transport bar underneath.
- **Sealed claim slot** — a claim with its source, sample size and date left visibly empty. The evidence section is built from these rather than from statistics.
- **Placeholder slot** `.slot` — a dashed sodium keyline around a fact nobody has verified yet. A missing number looks missing; it can never be mistaken for a real one.
- **Open-item memo** `.memo[data-blocker]` — addressed to the owner, removable with one CSS rule once answered.

## Rules

1. **No figure without a source.** Enforced by the design: the evidence section has slots, not numbers.
2. **Sodium is stakes; cold is handled.** Never decorative, never swapped.
3. **Serif is the customer; mono is the system.** Consistent in the transcript, the plates and the copy.
4. **Animate from visible.** No entrance may be the only thing that makes content readable.
5. **11px floor.** No text below it anywhere.
6. **One fact, one field.** Timeline, phone and email render from a single source so the page cannot contradict itself.

## Open

Carried as visible placeholders in the build, not invented:

- **C-19** implementation timeline — the live site says both 14 days and 21 days.
- Leadership names, roles, photographs.
- A working telephone number and an email address on a live domain.
- **L-01** privacy policy, SMS terms, terms of service — all currently 404 while the site runs SMS automation.
- **A-01** the demonstration audio track; the transcript and captions are built and synchronised.
