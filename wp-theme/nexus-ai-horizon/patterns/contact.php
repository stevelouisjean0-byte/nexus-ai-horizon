<?php
/**
 * Title: Book a strategy call (form)
 * Slug: nexus/contact
 * Categories: nexus
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
<section class="band grey contact" id="contact" aria-labelledby="h-contact">
    <div class="wrap">
      <div class="reveal">
        <h2 id="h-contact">Book a strategy call.</h2>
        <p class="lede">Twenty minutes. A walk-through of the system handling calls from your industry, and an honest answer on whether your business is one it can help. No deck.</p>
        <p class="aside">What happens next: someone at Nexus AI Horizon reads your message and calls or emails to set a time. Nothing on this side of the form is automated.</p>
      </div>

      <form class="form-card reveal" id="contact-form" method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" data-live="1" novalidate aria-label="Book a strategy call">
        <input type="hidden" name="action" value="nexus_contact">
        <input type="hidden" name="nexus_t" value="<?php echo esc_attr( time() ); ?>">
        <?php wp_nonce_field( 'nexus_contact', 'nexus_nonce' ); ?>
        <div class="hp" aria-hidden="true"><label for="website_url">Leave this empty</label><input id="website_url" name="website_url" type="text" tabindex="-1" autocomplete="off"></div>
        <div class="grid-2">
          <div class="field">
            <label for="first">First name</label>
            <input id="first" name="first_name" type="text" autocomplete="given-name" required>
            <span class="err" id="first-err">Enter your first name.</span>
          </div>
          <div class="field">
            <label for="last">Last name</label>
            <input id="last" name="last_name" type="text" autocomplete="family-name" required>
            <span class="err" id="last-err">Enter your last name.</span>
          </div>
        </div>
        <div class="field">
          <label for="company">Company</label>
          <input id="company" name="company" type="text" autocomplete="organization" required>
          <span class="err" id="company-err">Enter the business name.</span>
        </div>
        <div class="field">
          <label for="industry">Industry</label>
          <select id="industry" name="industry" required>
            <option value="">Choose one</option>
            <option>Emergency home services (plumbing, HVAC, electrical, restoration)</option>
            <option>Property management</option>
            <option>Moving and relocation</option>
            <option>Financial services</option>
            <option>Something else</option>
          </select>
          <span class="err" id="industry-err">Choose the closest industry.</span>
        </div>
        <div class="grid-2">
          <div class="field">
            <label for="email">Work email</label>
            <input id="email" name="email" type="email" autocomplete="email" inputmode="email" spellcheck="false" required>
            <span class="err" id="email-err">Enter an email address, like name@company.com.</span>
          </div>
          <div class="field">
            <label for="phone">Mobile</label>
            <input id="phone" name="phone" type="tel" autocomplete="tel" inputmode="tel" required>
            <span class="err" id="phone-err">Enter a phone number with area code.</span>
          </div>
        </div>
        <div class="field">
          <label for="when">Best time to call</label>
          <select id="when" name="best_time">
            <option>Morning</option>
            <option>Afternoon</option>
            <option>Evening</option>
          </select>
        </div>
        <div class="field">
          <label for="message">What are you trying to fix?</label>
          <textarea id="message" name="message" rows="3" required></textarea>
          <span class="err" id="message-err">Tell us in a sentence or two what is going wrong with your calls.</span>
        </div>
        <label class="consent">
          <input type="checkbox" id="consent" name="consent" required>
          <span>Nexus AI Horizon may call or text me about this request. Message and data rates may apply. See the <a href="<?php echo esc_url( home_url( '/privacy-policy/' ) ); ?>">privacy policy</a>.</span>
        </label>
        <div class="form-actions">
          <button class="btn btn-primary" type="submit">Book a strategy call</button>
          <span class="small">Twenty minutes. No deck.</span>
        </div>
        <p class="form-status" role="status" aria-live="polite" hidden></p>
      </form>
    </div>
  </section>
<!-- /wp:html -->
