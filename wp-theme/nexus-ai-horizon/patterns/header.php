<?php
/**
 * Title: Header
 * Slug: nexus/header
 * Categories: nexus
 * Block Types: core/template-part/header
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
<div class="top" id="top">
  <div class="wrap">
    <a class="brand" href="<?php echo esc_url( home_url( '/' ) ); ?>" aria-label="Nexus AI Horizon, home">
      <img src="<?php echo esc_url( $uri ); ?>/assets/img/logo.png" alt="" width="583" height="211" fetchpriority="high">
      <span translate="no">Nexus AI Horizon</span>
    </a>
    <nav class="nav" id="nav" aria-label="Site">
      <a href="<?php echo esc_url( home_url( '/how-it-works/' ) ); ?>"<?php echo is_page( 'how-it-works' ) ? ' aria-current="page"' : ''; ?>>How it works</a>
      <a href="<?php echo esc_url( home_url( '/industries/' ) ); ?>"<?php echo is_page( 'industries' ) ? ' aria-current="page"' : ''; ?>>Industries</a>
      <a href="<?php echo esc_url( home_url( '/oversight/' ) ); ?>"<?php echo is_page( 'oversight' ) ? ' aria-current="page"' : ''; ?>>Oversight</a>
      <a href="<?php echo esc_url( home_url( '/contact/' ) ); ?>"<?php echo is_page( 'contact' ) ? ' aria-current="page"' : ''; ?>>Contact</a>
      <a class="btn btn-primary" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>">Book a strategy call</a>
    </nav>
    <a class="btn btn-primary btn-sm" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>">Book a strategy call</a>
    <button class="menu-btn" type="button" aria-expanded="false" aria-controls="nav">Menu</button>
  </div>
</div>
<!-- /wp:html -->
