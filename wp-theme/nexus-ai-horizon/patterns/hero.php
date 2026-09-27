<?php
/**
 * Title: Hero with the call demonstration
 * Slug: nexus/hero
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
<section class="hero scene" aria-labelledby="h-hero">
      <div class="stage">
        <div class="stage-inner">
          <div class="device" data-state="call" role="figure" aria-label="A phone showing the staged demonstration call as live captions">
            <div class="screen">
              <div class="island" aria-hidden="true"></div>
              <div class="status" aria-hidden="true"><span>2:14</span><span class="right"><i></i></span></div>

              <div class="view ring-view" aria-hidden="true">
                <div class="ring-pulse"><span></span><span></span><span></span></div>
                <div class="ring-name">Verrazano Pipe &amp; Heat</div>
                <div class="ring-sub">Incoming call, after-hours line</div>
                <div class="ring-actions"><i class="decline"></i><i class="accept"></i></div>
              </div>

              <div class="view call-view">
                <div class="call-head">
                  <div class="line-name">Verrazano Pipe &amp; Heat</div>
                  <div class="line-state">After-hours line, <b>02:07</b></div>
                </div>
                <ol class="captions" aria-live="polite" aria-label="Live captions">
                  <li class="caller is-in"><span class="who">Caller</span>Yes. Please.</li>
                  <li class="agent is-in"><span class="who">Agent</span>Booked. You&rsquo;ll get a text in a moment with the window and the technician&rsquo;s first name. Keep that valve closed, and put a bucket under the drip if you can. Anything else?</li>
                  <li class="caller is-in"><span class="who">Caller</span>No. Thank you.</li>
                  <li class="agent is-in"><span class="who">Agent</span>You&rsquo;re welcome. Someone will be there between 7:30 and 9.</li>
                </ol>
                <ul class="chips" aria-label="What the call produced">
                  <li class="info is-in">Automated, disclosed</li>
                  <li class="info is-in">Safety step first</li>
                  <li class="is-in">Name taken</li>
                  <li class="is-in">Address taken</li>
                  <li class="is-in">Callback number taken</li>
                  <li class="warn is-in">Urgent, on-call texted</li>
                  <li class="is-in">Booked 7:30 to 9:00</li>
                  <li class="is-in">Confirmation texted</li>
                  <li class="is-in">Saved to CRM</li>
                </ul>
              </div>
            </div>
          </div>
          <div class="stage-tools">
            <button class="btn btn-secondary btn-sm replay" type="button">Replay the call</button>
          </div>
        </div>
      </div>

      <div class="acts">
        <div class="act act-0 wrap" data-act="0">
          <p class="act-time">Tuesday, 2:14 a.m.</p>
          <h1 id="h-hero"><span class="w">The</span> <span class="w">phone</span> <span class="w">rings.</span> <span class="w">It</span> <span class="w">gets</span> <span class="w">answered.</span></h1>
          <p class="lede">Nexus AI Horizon builds AI voice and SMS systems for New York service businesses: calls answered, qualified and booked, then written into the tools you already run.</p>
          <div class="hero-actions">
            <a class="btn btn-primary" href="#contact">Book a strategy call</a>
          </div>
          <p class="hero-note">Staged demonstration. The business, the caller and the number are fictional.</p>
        </div>
        <div class="act wrap" data-act="1">
          <p class="act-line">The office closed eight hours ago. The line rings anyway.</p>
        </div>
        <div class="act wrap" data-act="2">
          <p class="act-line">Answered on your number. It says it is automated, then asks about the shutoff valve before anything else.</p>
        </div>
        <div class="act wrap" data-act="3">
          <p class="act-line">Name, address, callback number. Urgent under your after-hours rule, so the on-call phone gets a text.</p>
        </div>
        <div class="act wrap" data-act="4">
          <p class="act-line">Booked for 7:30. Confirmation texted. Written to your CRM.</p>
          <p class="act-more">Two minutes, start to finish.</p>
        </div>
      </div>
  </section>
<!-- /wp:html -->
