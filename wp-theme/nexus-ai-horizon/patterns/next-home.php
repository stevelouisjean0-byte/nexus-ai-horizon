<?php
/**
 * Title: Home: see the rest of the call
 * Slug: nexus/next-home
 * Categories: nexus
 *
 * Generated from picked-up/sections.html by wp-theme/build-theme.cjs. Edit the
 * static build and rerun the script rather than editing this file by hand.
 *
 * @package nexus-ai-horizon
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }
$uri = get_template_directory_uri();
?>
<!-- wp:html -->
<section class="band next-band seam" data-for="index" aria-labelledby="h-next-index">
    <div class="wrap">
      <h2 id="h-next-index" class="caps reveal">See the rest of the call.</h2>
      <div class="next-grid">
        <a class="next-card reveal" href="<?php echo esc_url( home_url( '/how-it-works/' ) ); ?>"><span class="k">How it works</span><span class="t">What happens on every call, and the 118 hours a week that voicemail covers now.</span></a>
        <a class="next-card reveal" href="<?php echo esc_url( home_url( '/industries/' ) ); ?>"><span class="k">Industries</span><span class="t">Four industries, four staged calls. Nothing else.</span></a>
        <a class="next-card reveal" href="<?php echo esc_url( home_url( '/oversight/' ) ); ?>"><span class="k">Oversight</span><span class="t">A person reviews the early calls before the system runs on its own.</span></a>
        <a class="next-card next-cta reveal" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>"><span class="k">Book a strategy call</span><span class="t">Twenty minutes. No deck.</span></a>
      </div>
    </div>
  </section>
<!-- /wp:html -->
