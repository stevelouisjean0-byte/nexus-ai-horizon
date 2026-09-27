<?php
/**
 * Title: Header
 * Slug: nexus/header
 * Categories: nexus
 * Block Types: core/template-part/header
 * Inserter: no
 *
 * Generated from picked-up/index.html by wp-theme/build-theme.cjs. Edit the
 * static build and rerun the script rather than editing this file by hand.
 *
 * @package nexus-ai-horizon
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }
$uri = get_template_directory_uri();
?>
<!-- wp:html -->
<div class="top" id="top">
  <div class="wrap">
    <a class="brand" href="<?php echo esc_url( home_url( '/' ) ); ?>" aria-label="Nexus AI Horizon, home">
      <img src="<?php echo esc_url( $uri ); ?>/assets/img/logo.png" alt="" width="583" height="211" fetchpriority="high">
      <span translate="no">Nexus AI Horizon</span>
    </a>
    <nav class="nav" id="nav" aria-label="Site">
      <a href="<?php echo esc_url( home_url( '/' ) ); ?>#every-call">How it works</a>
      <a href="<?php echo esc_url( home_url( '/' ) ); ?>#industries">Industries</a>
      <a href="<?php echo esc_url( home_url( '/' ) ); ?>#person">Oversight</a>
      <a href="<?php echo esc_url( home_url( '/' ) ); ?>#contact">Contact</a>
      <a class="btn btn-primary" href="<?php echo esc_url( home_url( '/' ) ); ?>#contact">Book a strategy call</a>
    </nav>
    <a class="btn btn-primary btn-sm" href="<?php echo esc_url( home_url( '/' ) ); ?>#contact">Book a strategy call</a>
    <button class="menu-btn" type="button" aria-expanded="false" aria-controls="nav">Menu</button>
  </div>
</div>
<!-- /wp:html -->
