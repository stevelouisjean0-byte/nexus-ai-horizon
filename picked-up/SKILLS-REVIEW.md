# Skills review, second round: the light build

The first-round review of every installed skill is in
`../while-you-were-out/SKILLS-REVIEW.md` and still stands. This note records
what changed when the brief changed to premium, light, Apple-like, with no dark
colours.

## What moved up

| Skill | What it contributed this time |
|---|---|
| `apple-design` | Became the reference for feel: feedback on press, translucent chrome with content scrolling under it, size-specific tracking, `prefers-reduced-motion` and `prefers-reduced-transparency`, "simplicity, not minimalism". Its advice to build interaction and visuals together is why the phone demo is a working component rather than a picture. |
| `emil-design-eng` and `animate` | Set the motion values again: 640ms entry reveals on a strong ease-out, 70ms sibling stagger, 0.97 press, captions that enter with opacity and a small rise, never from scale(0), transitions not keyframes, only transform and opacity. |
| `design-taste-frontend` | Its "amazing components" reading: real product previews or none, no div-based fake screenshots. The bento vignettes are honest illustrations of a staged call, each labelled as such, built from real markup that a WordPress block can carry. Its bento rules held: exact cell count, gapless, real visual variation between cells (calendar, gradient, quote, message, alert, record). |
| `high-end-visual-design` | Its light archetype ("Soft Structuralism": white and silver grounds, large bold grotesk, airy floating components with soft ambient shadow) is the closest match to the new brief, so this time it was followed rather than rejected. Its floating-pill nav and double-bezel nesting were still left out. |
| `ui-ux-pro-max` | The accessibility floor caught the one real problem in round one: Apple's own caption grey fails AA on white, so it was replaced. |
| `frontend-design` (Anthropic plugin) | The hero opens with the most characteristic thing in the subject's world, which for a phone-answering service is a phone taking the call. |

## What moved down

| Skill | Why |
|---|---|
| `industrial-brutalist-ui`, `minimalist-ui` | The first is dark or newsprint; the second's warm monochrome and pastel tags are a different register from Apple's cool neutrals. Neither fits. |
| `gpt-taste`, `imagegen-frontend-web` | Their cinematic-dark defaults and full-bleed atmospheric photography are the opposite of the brief. |

## Third round: the cinematic pass

- **Steve's own review beat the skills.** The two-column "text left, phone right" hero passed every checklist and he called it AI slop on sight, which `imagegen-frontend-web` had warned about ("the most overused AI pattern") and which I had rationalised as "an inverted classic". The replacement is a centred, dated opening line with the phone rising beneath it, then a pinned scene. Lesson recorded in memory: a split hero with a device on one side is a tell regardless of polish.
- **`apple-design`** supplied the scene's grammar: a sticky product, copy that arrives in acts, motion that starts from the current state and can be scrubbed back, and a reduced-motion path that keeps every fact readable.
- **`animate` and `emil-design-eng`** set the numbers again: the 1.1 s ease-in-out camera move, 640 ms reveals, and the rule that only transform, opacity and colour animate. The scroll-scrubbed ink-in and parallax use CSS scroll-driven animations rather than a scroll listener, which `design-taste-frontend` bans outright.
- **`design-taste-frontend`'s scroll-cue ban** removed "Keep scrolling to watch the call" from the hero; the ringing phone does that work.
- **`seedance-2-5-image-to-video`** (installed by Steve) was the intended source of the chapter clip. Its RunComfy CLI has no Windows build, so `make-video.cjs` talks to the same API directly and waits on a token.

## Where the skills disagree, and what won

- **Centred hero.** `design-taste-frontend` discourages a centred hero above variance 4; `frontend-design` allows it when the message is the design. Apple's product pages are centred, the brief asked for that feel, and the phone below the headline is the asset. Centred won.
- **Rounded cards everywhere.** Several skills call the SaaS card kit an AI tell. Apple's tiles are rounded cards. Resolution: no borders, no shadow at rest, one radius scale (28, 20, 12), and every tile carrying a different kind of content, so the grid reads as a set of objects rather than a template.
- **Typeface.** The skills push Geist as the alternative to Inter, which makes it a common choice. It is also the closest match to a system grotesk, which is the brief. Geist won, on the brief.
- **Grey text.** Apple ships #86868b for captions. It fails AA on white. Accessibility won; the caption grey is #6b6b70.
