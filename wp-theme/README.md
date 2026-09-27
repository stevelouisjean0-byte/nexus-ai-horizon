# Nexus AI Horizon block theme

A WordPress block theme that carries the verified "Picked up" homepage into the
existing WordPress install, replacing Elementor Pro and `hello-elementor`. It
keeps Rank Math, GA4, the URLs and the team's ability to edit.

## Layout of this folder

| Path | What it is |
|---|---|
| `nexus-ai-horizon/` | The theme. Zip this folder, or copy it to `wp-content/themes/`, and activate it. |
| `build-theme.cjs` | Regenerates the theme's patterns and assets from `../picked-up`. Run it after any change to the static build: `node build-theme.cjs`. |
| `blueprint.json` | A WordPress Playground blueprint that activates the theme, sets permalinks and creates the three legal pages. Used for verification; also a fair description of the launch steps. |

## How the theme is built

- `theme.json` sets the palette, the single typeface (Geist), the fluid type scale and the content widths, and turns off core gradients, duotones and block gaps so the design's own CSS governs spacing.
- `functions.php` enqueues `assets/css/site.css` and `assets/js/site.js` (deferred), registers the pattern category, registers the private **Strategy call requests** post type, and handles the contact form (see below).
- `templates/front-page.html` composes the homepage from six patterns: hero, every-call, industries, hours, oversight, contact. `templates/page.html` and `page-legal.html` render ordinary pages in the same design; `index.html` is a minimal post list.
- `parts/header.html` and `parts/footer.html` reference the header and footer patterns.
- `patterns/*.php` are generated. Each is one HTML block holding the exact markup of the verified static section, with asset paths and links resolved through WordPress. The team edits a section by editing its pattern (or the block on the page); the phone demo, the bento vignettes and the week grid are plain HTML and need no plugin.

## The contact form

The form posts to `admin-post.php` (action `nexus_contact`). The handler
checks a nonce, an invisible honeypot field and a minimum time since page load,
sanitises every field, requires the consent box, then:

1. stores the request as a private **Strategy call request** (visible under Call requests in the admin menu, with each field as post meta and the consent timestamp), and
2. emails it to the site's admin address with Reply-To set to the requester.

It then redirects back to the page with `?sent=1`, which the script turns into
the on-page confirmation. Missing fields or an expired nonce redirect back with
`?problem=` and a message. No plugin is required; if you prefer a CRM
connector, replace the body of `nexus_handle_contact()`.

## Launch steps

1. Install and activate the theme. The homepage template applies automatically to the front page (Settings, Reading can stay on "latest posts" or a static page; `front-page.html` wins either way).
2. Set permalinks to `/%postname%/` if they are not already.
3. Create three pages with the slugs `privacy-policy`, `sms-terms` and `terms`, using the **Legal page** template, and paste in the lawyer-approved text from `../picked-up/legal/`.
4. Confirm the admin email address receives mail (`wp_mail` uses the host's mailer; an SMTP plugin is advisable).
5. Repoint anything still linking to `nexusaihorizon.com`.
6. Deactivate Elementor and Elementor Pro after checking that no other page depends on them. The 85 city pages are Elementor content; decide their fate per the September audit before switching them off.

## Verification

The theme was run under WordPress Playground (WordPress and PHP in Node, no
server needed) with the theme mounted and this blueprint applied, and the
homepage was checked with the same real-Chrome script as the static build. See
`../picked-up/HANDOFF.md` for the recorded results.
