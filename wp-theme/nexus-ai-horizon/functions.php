<?php
/**
 * Nexus AI Horizon block theme.
 *
 * Styles and scripts come from the verified static build; the patterns in
 * /patterns are generated from it by wp-theme/build-theme.cjs. The contact
 * form posts to admin-post.php and is handled below without a plugin: each
 * request is stored as a private "Strategy call request" and emailed to the
 * site's admin address.
 *
 * @package nexus-ai-horizon
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'NEXUS_THEME_VERSION', '1.2.0' );

/* ------------------------------------------------------------ setup */

function nexus_setup() {
	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'html5', array( 'search-form', 'gallery', 'caption', 'style', 'script' ) );
	add_theme_support( 'responsive-embeds' );
	add_theme_support( 'editor-styles' );
	add_editor_style( 'assets/css/site.css' );
	remove_theme_support( 'core-block-patterns' );
}
add_action( 'after_setup_theme', 'nexus_setup' );

/* ------------------------------------------------------------ assets */

function nexus_assets() {
	$uri = get_template_directory_uri();
	wp_enqueue_style(
		'nexus-fonts',
		'https://fonts.googleapis.com/css2?family=Geist:wght@300..800&display=swap',
		array(),
		null
	);
	wp_enqueue_style( 'nexus-site', $uri . '/assets/css/site.css', array( 'nexus-fonts' ), NEXUS_THEME_VERSION );
	// GSAP and ScrollTrigger drive the scroll choreography; the page is fully
	// readable without them, so a blocked CDN degrades to static content.
	wp_enqueue_script( 'gsap', 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js', array(), '3.12.5', array( 'strategy' => 'defer', 'in_footer' => true ) );
	wp_enqueue_script( 'gsap-scrolltrigger', 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js', array( 'gsap' ), '3.12.5', array( 'strategy' => 'defer', 'in_footer' => true ) );
	wp_enqueue_script( 'nexus-site', $uri . '/assets/js/site.js', array( 'gsap', 'gsap-scrolltrigger' ), NEXUS_THEME_VERSION, array( 'strategy' => 'defer', 'in_footer' => true ) );
}
add_action( 'wp_enqueue_scripts', 'nexus_assets' );

// The static build adds a "js" class before paint so that reveal states only
// apply when scripts run. Do the same here, as early as possible.
function nexus_js_class() {
	echo "<script>document.documentElement.classList.add('js');</script>\n";
}
add_action( 'wp_head', 'nexus_js_class', 1 );

function nexus_preconnect( $urls, $relation_type ) {
	if ( 'preconnect' === $relation_type ) {
		$urls[] = array( 'href' => 'https://fonts.gstatic.com', 'crossorigin' => 'anonymous' );
	}
	return $urls;
}
add_filter( 'wp_resource_hints', 'nexus_preconnect', 10, 2 );

function nexus_theme_color() {
	echo '<meta name="theme-color" content="#ffffff">' . "\n";
}
add_action( 'wp_head', 'nexus_theme_color', 2 );

/* ------------------------------------------------------------ patterns */

function nexus_pattern_category() {
	register_block_pattern_category(
		'nexus',
		array( 'label' => __( 'Nexus AI Horizon', 'nexus-ai-horizon' ) )
	);
}
add_action( 'init', 'nexus_pattern_category', 9 );

/* ------------------------------------------------------------ strategy call requests */

function nexus_register_request_type() {
	register_post_type(
		'nexus_request',
		array(
			'labels'          => array(
				'name'          => __( 'Strategy call requests', 'nexus-ai-horizon' ),
				'singular_name' => __( 'Strategy call request', 'nexus-ai-horizon' ),
				'menu_name'     => __( 'Call requests', 'nexus-ai-horizon' ),
			),
			'public'          => false,
			'show_ui'         => true,
			'show_in_menu'    => true,
			'menu_icon'       => 'dashicons-phone',
			'menu_position'   => 25,
			'capability_type' => 'post',
			'capabilities'    => array( 'create_posts' => 'do_not_allow' ),
			'map_meta_cap'    => true,
			'supports'        => array( 'title', 'editor', 'custom-fields' ),
			'show_in_rest'    => false,
		)
	);
}
add_action( 'init', 'nexus_register_request_type' );

/**
 * Handle the contact form. Requires a valid nonce, an empty honeypot, and at
 * least a few seconds between the page loading and the submit.
 */
function nexus_handle_contact() {
	$back = wp_get_referer() ? wp_get_referer() : home_url( '/' );
	$back = remove_query_arg( array( 'sent', 'problem' ), $back );

	if ( ! isset( $_POST['nexus_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['nexus_nonce'] ) ), 'nexus_contact' ) ) {
		wp_safe_redirect( add_query_arg( 'problem', 'expired', $back ) . '#contact' );
		exit;
	}

	// Honeypot: a real visitor never fills this field.
	if ( ! empty( $_POST['website_url'] ) ) {
		wp_safe_redirect( add_query_arg( 'sent', '1', $back ) . '#contact' );
		exit;
	}

	// Timing: bots submit instantly.
	$started = isset( $_POST['nexus_t'] ) ? (int) $_POST['nexus_t'] : 0;
	if ( $started && ( time() - $started ) < 3 ) {
		wp_safe_redirect( add_query_arg( 'sent', '1', $back ) . '#contact' );
		exit;
	}

	$fields = array(
		'first_name' => 'text',
		'last_name'  => 'text',
		'company'    => 'text',
		'industry'   => 'text',
		'email'      => 'email',
		'phone'      => 'text',
		'best_time'  => 'text',
		'message'    => 'textarea',
	);
	$data = array();
	foreach ( $fields as $key => $kind ) {
		$raw = isset( $_POST[ $key ] ) ? wp_unslash( $_POST[ $key ] ) : '';
		if ( 'email' === $kind ) {
			$data[ $key ] = sanitize_email( $raw );
		} elseif ( 'textarea' === $kind ) {
			$data[ $key ] = sanitize_textarea_field( $raw );
		} else {
			$data[ $key ] = sanitize_text_field( $raw );
		}
	}
	$consent = ! empty( $_POST['consent'] );

	$required_ok = $data['first_name'] && $data['last_name'] && $data['company'] && $data['industry'] && is_email( $data['email'] ) && $data['phone'] && $data['message'] && $consent;
	if ( ! $required_ok ) {
		wp_safe_redirect( add_query_arg( 'problem', 'fields', $back ) . '#contact' );
		exit;
	}

	$title = sprintf( '%s %s, %s', $data['first_name'], $data['last_name'], $data['company'] );
	$body  = sprintf(
		"Name: %s %s\nCompany: %s\nIndustry: %s\nEmail: %s\nMobile: %s\nBest time to call: %s\n\nWhat they are trying to fix:\n%s\n\nConsent to call or text: yes, recorded %s",
		$data['first_name'],
		$data['last_name'],
		$data['company'],
		$data['industry'],
		$data['email'],
		$data['phone'],
		$data['best_time'],
		$data['message'],
		current_time( 'mysql' )
	);

	$post_id = wp_insert_post(
		array(
			'post_type'    => 'nexus_request',
			'post_status'  => 'private',
			'post_title'   => $title,
			'post_content' => $body,
		),
		true
	);
	if ( ! is_wp_error( $post_id ) ) {
		foreach ( $data as $key => $value ) {
			update_post_meta( $post_id, 'nexus_' . $key, $value );
		}
		update_post_meta( $post_id, 'nexus_consent_at', current_time( 'mysql' ) );
		update_post_meta( $post_id, 'nexus_ip', isset( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) ) : '' );
	}

	$to      = get_option( 'admin_email' );
	$subject = sprintf( '[nxaihorizon.com] Strategy call request from %s', $title );
	$headers = array( 'Reply-To: ' . $data['email'] );
	wp_mail( $to, $subject, $body, $headers );

	wp_safe_redirect( add_query_arg( 'sent', '1', $back ) . '#contact' );
	exit;
}
add_action( 'admin_post_nopriv_nexus_contact', 'nexus_handle_contact' );
add_action( 'admin_post_nexus_contact', 'nexus_handle_contact' );

/* ------------------------------------------------------------ housekeeping */

// The site does not use emoji, embeds or the block directory on the front end.
add_action(
	'init',
	function () {
		remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
		remove_action( 'wp_print_styles', 'print_emoji_styles' );
		remove_action( 'wp_head', 'wp_generator' );
	}
);
