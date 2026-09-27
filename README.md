# Nexus AI Horizon website

The redesign of [nxaihorizon.com](https://nxaihorizon.com/): an AI automation
studio in Lower Manhattan that builds voice and SMS systems for service
businesses in the New York metro.

## What is in this repository

| Path | What it is |
|---|---|
| `picked-up/` | **The current homepage build.** Static HTML, CSS and JavaScript, verified in real Chrome at four widths. Open `picked-up/index.html`. Beside it: `HANDOFF.md` (what is on the page, what is deliberately absent, what is needed to go live), `DEMO-RECORDING-BRIEF.md`, `legal/` (privacy policy, SMS terms and terms of service drafts for legal review), `make-video.cjs` (generates the chapter clip through the RunComfy API), `check.cjs` (the verification script) and `shots/` (its screenshots and audit). |
| `wp-theme/` | **The WordPress block theme** generated from the static build, with its build script, a WordPress Playground blueprint, and an end-to-end test of the contact form. See `wp-theme/README.md`. |
| `PRODUCT.md` | The product record: who the site is for, what can and cannot be claimed, and the facts still unconfirmed. Source of truth for copy. |
| `DESIGN.md` | The design record of the current world ("Picked up"). |
| `audit-and-direction.html` | The read-only audit of the live site from 3 September 2026: findings register, revised sitemap, claims to verify. |
| `while-you-were-out/`, `homepage.html`, `nightshift-prototype.html`, `prototype-v1.html` | Earlier directions, superseded and kept as evidence. Their design records are `DESIGN.while-you-were-out.md` and `DESIGN.night-shift.md`. |

## Rules that hold across everything here

- No figure is published without a source. The current build ships no statistics at all.
- Every call, business, caller and phone number shown is a staged demonstration and is labelled as one.
- The implementation timeline, phone number, email address, integration list and founding year are not stated anywhere because none is confirmed. `PRODUCT.md` lists them.

## Working on it

Edit the static build in `picked-up/`, run its check from a folder that has
Playwright installed:

```
node picked-up/check.cjs
```

then regenerate the theme:

```
node wp-theme/build-theme.cjs
```

Never edit `wp-theme/nexus-ai-horizon/patterns/*.php` by hand; they are
generated. Bump the version in the theme's `style.css` and `functions.php`
whenever a pattern file is added, because WordPress caches the pattern list per
theme version.
