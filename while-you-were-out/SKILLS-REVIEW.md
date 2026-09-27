# Skills review for the nxaihorizon.com redesign

Date: 27 September 2026. Every skill installed in this Claude Code environment was
considered against one question: does it change how this specific site should be
designed or built? The verdicts below are what actually shaped the build in this folder.

## Used as the spine

| Skill | What it contributed |
|---|---|
| `impeccable` | The process. `context.mjs` loaded PRODUCT.md as product truth. A redesign replaces the visual world and DESIGN.md rather than polishing the old look, so the Night Shift world was archived as `DESIGN.night-shift.md` and replaced. Mode: Persuade. Bounded verification: build, one batched real-Chrome round across four viewports, fix, one confirming round. |
| `nexus-outreach` | The business facts and the never-invent list: no timeline, no founding year, no integration names, no statistics, no pricing, no named customers. Voice rules (plain, operational, "Nexus AI Horizon" casing, banned words). The requirement that the agent discloses it is automated in its first sentence became a line in the transcript and an item in the checklist. |
| `design-taste-frontend` | The pre-flight checklist. Zero em-dashes anywhere. No eyebrow labels. Hero at most four text elements, headline two lines, subtext under 20 words. Section-layout repetition ban, so the seven sections use seven layout families. Instrument Serif and Fraunces banned as defaults, which ruled out reusing the Night Shift type. Redesign protocol: audit first, preserve IA and copy voice, do not rename form fields silently. |
| `redesign-existing-projects` | The audit of the live site: five font families, three equal cards plus one, a fake terminal, decorative stats, "Cool Number" placeholder, links to `#`, no legal links. The fix-priority order (fonts, colour, states, layout, components, empty and error states). |
| `frontend-design` (Anthropic plugin) | Ground the design in the subject's vernacular: the telephone message pad is the artifact of a missed call. Spend boldness in one place (the slip), keep everything else quiet. The list of AI-design clusters to avoid (warm cream and serif and terracotta; near-black plus one neon accent; broadsheet hairlines; SaaS card kit; tracked caps eyebrows, middle-dot strings, spaced em dashes, mono data labels). |
| `animate` and `emil-design-eng` | Concrete motion values: strong ease-out `cubic-bezier(0.23, 1, 0.32, 1)`, 420ms wipe for the slip fields, 90ms stagger, `scale(0.97)` press at 160ms, transitions not keyframes, never animate from `scale(0)`, `clip-path` as the reveal tool, reduced motion as a full parity path, hover gated to fine pointers. |

## Consulted, and applied in part

| Skill | Verdict |
|---|---|
| `ui-ux-pro-max` | Its priority table set the floor: 4.5:1 contrast, 44px targets, visible labels, inline errors, no horizontal scroll, `prefers-reduced-motion`. The local search tool was not run; the guidance it would return is already in the pre-flight lists above. |
| `web-design-guidelines` | The Vercel Web Interface Guidelines were fetched and the build checked against them (skip link, one h1, labels above inputs, `autocomplete` and `inputmode` on inputs, `aria-live` status, focus rings, no `transition: all`). |
| `apple-design` | Feedback on press, size-specific tracking (tight on display, near zero on body), spatial consistency, `prefers-reduced-transparency` awareness. Its spring-and-gesture material does not apply to a page with no gestures. |
| `frontend-design-direction` | Purpose, audience, tone, one memorable detail. The audience is an owner between jobs on a phone, so the mobile order is headline, action, then the slip. |
| `high-end-visual-design` | Kept: macro-whitespace, tinted shadows, custom easing. Rejected: floating glass pill nav, double-bezel cards, button-in-button arrows, eyebrow pills. Those are the "AI premium" look the other skills flag. |
| `gpt-taste` | Kept: the two-line hero rule and the ban on cheap meta-labels. Rejected: mandatory GSAP scroll choreography, marquees, picsum placeholders and simulated randomisation. None of it fits a plain, operational brand. |
| `imagegen-frontend-web` and `image-to-code` | No image-generation tool exists in this environment, so the image-first workflow could not run. Their composition-anchor variety rule was applied by hand: the hero is object-left and text-right, the photo band is text bottom-left over image, the form section is text-left and object-right. |
| `brandkit` | Brand strategy before visuals. The logo lockup was audited: the wordmark is navy and vanishes on the dark ground, so the build uses the infinity mark alone with the name set in type, and a white-on-dark lockup is listed as an open item. |
| `anti-ui-slop`, `ui-design`, `ui-radar` | Work-from-the-product principle applied. The UIZZE MCP connector is not connected in this session, and no unresolved visual question needed outside references. |
| `stitch-design-taste` | Overlaps with the above. Not generating a Stitch DESIGN.md. |

## Considered as visual worlds and rejected

| Skill | Why not |
|---|---|
| `minimalist-ui` | Light warm-monochrome editorial. Contradicts the pinned dark palette in the brief. |
| `industrial-brutalist-ui` | Would land squarely in the broadsheet-hairlines-and-mono cluster, and in the Night Shift's territory. |

## Not applicable to this task

`agent-browser`, `browser-harness` (Playwright driving real Chrome was used directly, per the project memory about headless captures), `agentic-os`, `autonomous-agent-harness`, `coding-agent`, `deep-research`, `animate-expo`, `animation-vocabulary`, `ask-sonner`, `find-animation-opportunities`, `improve-animations`, `find-skills`, `imagegen-frontend-mobile`, `write-swift`, `reddit-automation`, `design-taste-frontend-v1` (superseded), `full-output-enforcement` (implicit: complete files, no placeholders), `dataviz` (no charts, by design), the document, spreadsheet, slide and PDF skills, the dissertation and editing skills, the scheduling and configuration skills, and the code-review skills.

## Where the skills disagree, and what won

- **Dark palette.** Several skills warn against near-black plus a single accent. The brief pinned a dark palette, and `impeccable` is explicit that the brief wins over a saturated-pattern warning. Resolution: deep navy rather than black, warm paper objects carrying most of the content, and the accent split into ballpoint blue on paper and cyan on the ground.
- **Serif or not.** The Night Shift used Instrument Serif; `design-taste-frontend` bans it as a default. Resolution: one family, Libre Franklin, chosen because Franklin Gothic is the face of American office forms.
- **All-caps labels.** Banned as eyebrows by three skills. The one all-caps string on the page is the printed pad title, which is the artifact's own lettering and the concept's anchor.
- **Motion.** `gpt-taste` and `high-end-visual-design` want cinematic scroll choreography; `frontend-design` and `animate` want one orchestrated moment. Resolution: one idea, the slip filling in, with entry reveals and nothing else.
- **Images.** `design-taste-frontend` says even minimal pages need real images; `never-invent-business-facts` (project memory) says all photography is placeholder until the client supplies it. Resolution: one stock photograph, credited on the page and labelled as not a customer site.
