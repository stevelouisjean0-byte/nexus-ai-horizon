# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

WordPress block theme, confirmed by the user during init.

The existing WordPress install is retained along with Rank Math, GA4 (`G-CXCFXLRLKP`) and all current URLs. Elementor Pro and the `hello-elementor` theme are replaced by a custom block theme. Rationale on record: no CMS migration risk, the team keeps editing, and it removes the builder overhead measured on the live site (39 stylesheets, ~482 KB of CSS, 372 KB of homepage markup).

Content that must remain editable rather than hard-coded: hero headline and subhead, all CTA labels and destinations, the eight pipeline stage titles and sentences, the demonstration transcript and its label, calculator defaults and assumption band, every proof figure together with its source and date, service descriptions, integration lists, team members, and the implementation timeline.

## Users

**Primary:** owners and operations leaders at service businesses whose revenue depends on inbound calls, lead follow-up, scheduling and dispatch. They are typically not at a desk — checking a phone between jobs — and they are evaluating whether a system can be trusted with the calls that pay them.

**Four industries served, and no others:**

- Emergency home services — plumbing, HVAC, electrical, restoration
- Property management — tenant intake, maintenance, leasing
- Moving and relocation — quote intake, estimates, booking
- Financial services — controlled intake, qualification, scheduling

**The job:** decide whether to book a strategy call. The site's single conversion goal is a qualified strategy call or demonstration request.

## Product Purpose

Nexus AI Horizon designs and deploys AI voice, SMS, scheduling and workflow systems for service businesses. The systems answer inbound calls around the clock, qualify leads, schedule appointments, route urgent requests, automate SMS follow-up, and connect calls and leads into the customer's existing CRM.

Success for the business is measurable qualified strategy calls. Success for the customer is that inbound calls are handled consistently outside office hours without adding headcount.

## Positioning

Specialist rather than horizontal: four industries, with others declined. The offer is operational rather than experimental — the system connects to the tools the business already runs on, and a person reviews early calls before it operates unattended.

The differentiator the site should lead with is **demonstration over assertion**: showing a call being answered, qualified, booked and confirmed, rather than publishing performance statistics.

## Operating Context

Calls arrive after hours, during jobs, and in bursts. The competing alternative is voicemail, which qualifies nobody. The customer's existing stack typically includes a CRM, a calendar or dispatch board, and a published phone number the business advertises on vehicles and signage — which the system sits underneath rather than replaces.

Evaluation happens on a phone as often as a desktop.

## Capabilities and Constraints

**Confirmed on the live site (audited 3 September 2026, read-only):**

- WordPress 7.0.3, Elementor 4.2.2 + Elementor Pro, `hello-elementor` theme
- Rank Math SEO; GA4 present with **no conversion events configured**
- BlogVault Airlift delays all JavaScript until user interaction
- Elementor Forms with **no captcha, no consent field, and no detectable CRM connector**
- 91 pages (85 of them city pages), 21 posts, 2 conflicting XML sitemaps

**Blocking defects carried into the rebuild:**

- `nexusaihorizon.com` is a **parked domain** serving a 114-byte redirect to an ad lander. Eleven homepage CTAs point at it, and both published email addresses (`hello@`, `press@`) sit on it. Assume inbound email is undelivered until proven otherwise.
- No privacy policy, SMS terms, or terms of service exist. All return 404, while the site runs SMS automation and claims TCPA compliance.
- No telephone number is published anywhere.

**Explicitly undecided — must not be invented:**

- Implementation timeline. The live site states "14 days" three times and "21 days / three weeks" three times. One value, stored in one field, used everywhere. Currently blank.
- Leadership names, roles and photographs. No named person exists on the site.
- A working telephone number and an email address on the live domain.
- Founding year. "Est. 2023" and "three years in" both appear and are unconfirmed.
- The supported integration list. Named on the live site but unverified as built and tested.

**Confirmed by the user on 27 September 2026, and publishable:**

- Customers can read every transcript and every rule of their deployment, and the system is switched off on request.
- The strategy call is twenty minutes, with no deck.

## Brand Commitments

- Name: **Nexus AI Horizon**. Always this casing — current site metadata renders "Nexus Ai Horizon", which is wrong.
- Base: Lower Manhattan, New York.
- **Service area: NYC metro only**, confirmed by the user during init. The 85 city pages claiming presence across NY, NJ, CT, FL, GA, AL and SC exceed the markets actually served and must be consolidated into a service-area directory.
- Voice: plain, operational, unhyped. No superlatives — "best", "top 10" and "leading" are removed sitewide, along with exact-match keyword phrases inserted into body sentences.
- The user's original brief pinned a dark palette (black, charcoal, graphite, deep navy) with controlled electric-blue or cyan accents, warm white body text, and a maximum of two font families. **Superseded on 27 September 2026:** the user asked for a premium, light, Apple-like site with well-built components and no dark colours. Light grounds only; the blue of the logo is the accent; the logo lockup is used as supplied, since its navy wordmark reads on white.
- Unrelated entity: `Nexus Integrated Care, LLC` appears in the user's Downloads folder. It is a separate special-education and therapy business and is **not** part of this product record.

## Evidence on Hand

**Nothing is verifiable today.** Confirmed by the user during init.

No performance figure, compliance status, or client result can currently be substantiated. The rebuild therefore ships with **no statistics at all**. Credibility is carried by the live demonstration, the documented process, and the stated human-oversight standard.

The following appear on the live site and **must not be republished** unless and until each is sourced with a sample size and a date: 31 active deployments · 1.8s average answer time · 62% first-call booking rate · 97% answered under 3 seconds · 4.2× more booked jobs · $312K average recovered revenue · $4.6M new AUM for an RIA client · 4× lease tour booking rate · 3.2× quote-to-booking · 14 min → 11 sec response time · 1,247 calls this week · 96% year-one renewal · "SOC 2-ready" · "CCO-approved" · "TCPA compliant" · "approved by your compliance officer in week one" · "under 4 business hours" response.

Assets that may be used, clearly labelled as such: staged demonstration transcripts using fictional businesses and 555 numbers; documented process descriptions; integration examples once the supported list is confirmed.

No client is currently cleared for a named or anonymised case study.

## Product Principles

1. **No figure without a source.** A statistic is publishable only with its source, sample size and period attached. Where those are absent, the claim does not ship.
2. **Demonstrate, do not assert.** A call the visitor can hear being handled outperforms any number they have no reason to trust.
3. **Four industries. Decline the rest.** Depth in a named vertical is the product, and breadth would dilute it.
4. **A person reviews early calls.** Human oversight before unattended operation is a stated standard, not a caveat.
5. **One fact, stated once.** Timelines, claims and contact details come from a single field so the site cannot contradict itself, as it currently does.

## Accessibility & Inclusion

Target WCAG 2.2 AA. Product-specific requirements established during the audit:

- The audio demonstration requires a synchronised transcript; video requires captions.
- Full `prefers-reduced-motion` path — the pinned scroll sequence must degrade to static, fully readable content with no loss of information.
- One `h1` per page and no skipped heading levels. The live Services page has no `h1`, and the homepage places an `h4` before its `h1`.
- Keyboard-first navigation. The live site renders 237 links, most of them a duplicated 79-item location menu.
- Visible focus states, form labels above every field, and error messages naming both the problem and the fix.
