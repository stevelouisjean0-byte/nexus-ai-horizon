<?php
/**
 * Title: Footer
 * Slug: nexus/footer
 * Categories: nexus
 * Block Types: core/template-part/footer
 * Inserter: no
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
<div class="foot">
  <div class="wrap">
    <div>
      <a class="brand" href="<?php echo esc_url( home_url( '/' ) ); ?>" aria-label="Nexus AI Horizon, top of page">
        <img src="<?php echo esc_url( $uri ); ?>/assets/img/logo.png" alt="" width="583" height="211" loading="lazy">
        <span translate="no">Nexus AI Horizon</span>
      </a>
      <p>An AI automation studio in Lower Manhattan. Voice and SMS systems for service businesses across the New York metro, in four industries.</p>
    </div>
    <ul>
      <li><a href="<?php echo esc_url( home_url( '/how-it-works/' ) ); ?>">How it works</a></li>
      <li><a href="<?php echo esc_url( home_url( '/industries/' ) ); ?>">Industries</a></li>
      <li><a href="<?php echo esc_url( home_url( '/oversight/' ) ); ?>">Oversight</a></li>
      <li><a href="<?php echo esc_url( home_url( '/contact/' ) ); ?>">Contact</a></li>
    </ul>
    <ul>
      <li><a href="<?php echo esc_url( home_url( '/privacy-policy/' ) ); ?>">Privacy policy</a></li>
      <li><a href="<?php echo esc_url( home_url( '/sms-terms/' ) ); ?>">SMS terms</a></li>
      <li><a href="<?php echo esc_url( home_url( '/terms/' ) ); ?>">Terms of service</a></li>
    </ul>
    <div class="legal">
      <span>&copy; <?php echo esc_html( gmdate( 'Y' ) ); ?> Nexus AI Horizon, New York, NY.</span>
      <span>Every call, business and caller shown on this page is a staged demonstration.</span>
    </div>
  </div>
</div>
<!-- /wp:html -->
