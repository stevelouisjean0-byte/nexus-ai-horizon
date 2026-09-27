(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO = 'IntersectionObserver' in window;
  var wide = window.matchMedia('(min-width: 901px)');

  /* ---------------------------------------------------------- menu */
  var top = document.getElementById('top');
  var menuBtn = document.querySelector('.menu-btn');
  function closeMenu() {
    if (!top || !menuBtn) return;
    top.classList.remove('is-open');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.textContent = 'Menu';
  }
  if (menuBtn && top) {
    menuBtn.addEventListener('click', function () {
      var open = top.classList.toggle('is-open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      menuBtn.textContent = open ? 'Close' : 'Menu';
    });
    top.querySelectorAll('.nav a').forEach(function (a) { a.addEventListener('click', closeMenu); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && top.classList.contains('is-open')) { closeMenu(); menuBtn.focus(); }
    });
  }

  /* ---------------------------------------------------------- load sequence */
  document.querySelectorAll('.hero h1 .w').forEach(function (w, i) { w.style.setProperty('--i', i); });
  document.querySelectorAll('.statement .w').forEach(function (w, i) { w.style.setProperty('--p', (i * 0.9) + '%'); });
  var ready = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
  ready.then(function () {
    window.requestAnimationFrame(function () { document.documentElement.classList.add('is-loaded'); });
  });
  window.setTimeout(function () { document.documentElement.classList.add('is-loaded'); }, 1800);

  /* ---------------------------------------------------------- reveals */
  var reveals = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  if (reduce || !hasIO) {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var parents = new Map();
    reveals.forEach(function (el) {
      var p = el.parentNode;
      var n = parents.get(p) || 0;
      el.style.setProperty('--d', Math.min(n, 5) * 70 + 'ms');
      parents.set(p, n + 1);
    });
    var revIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); revIO.unobserve(en.target); }
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -6% 0px' });
    reveals.forEach(function (el) { revIO.observe(el); });
  }

  /* ---------------------------------------------------------- week grid */
  var week = document.querySelector('.week');
  if (week) {
    week.querySelectorAll('.h.on').forEach(function (c, i) { c.style.setProperty('--i', i); });
    if (reduce || !hasIO) week.classList.add('is-in');
    else {
      var wIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) { week.classList.add('is-in'); wIO.disconnect(); } });
      }, { threshold: 0.4 });
      wIO.observe(week);
    }
  }

  /* ---------------------------------------------------------- chapter video */
  // Present only when a clip has been dropped in (see HANDOFF.md); the still
  // image is used otherwise.
  var video = document.querySelector('.chapter-video');
  if (video && video.getAttribute('data-src')) {
    var canPlay = !reduce && hasIO && !(navigator.connection && navigator.connection.saveData);
    if (canPlay) {
      var vIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            if (!video.getAttribute('src')) { video.setAttribute('src', video.getAttribute('data-src')); video.load(); }
            var p = video.play(); if (p && p.catch) p.catch(function () {});
          } else if (!video.paused) {
            video.pause();
          }
        });
      }, { threshold: 0.15, rootMargin: '200px 0px' });
      vIO.observe(video);
    }
  }

  /* ---------------------------------------------------------- gallery */
  var track = document.querySelector('.gallery-track');
  var prev = document.querySelector('.gallery-nav .prev');
  var next = document.querySelector('.gallery-nav .next');
  if (track && prev && next) {
    var cardWidth = function () { var c = track.querySelector('.card'); return c ? c.getBoundingClientRect().width + 16 : 400; };
    var updateNav = function () {
      var max = track.scrollWidth - track.clientWidth - 2;
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft >= max;
    };
    prev.addEventListener('click', function () { track.scrollBy({ left: -cardWidth(), behavior: reduce ? 'auto' : 'smooth' }); });
    next.addEventListener('click', function () { track.scrollBy({ left: cardWidth(), behavior: reduce ? 'auto' : 'smooth' }); });
    track.addEventListener('scroll', function () { window.requestAnimationFrame(updateNav); }, { passive: true });
    track.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); next.click(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); prev.click(); }
    });
    window.addEventListener('resize', updateNav);
    updateNav();
  }

  /* ---------------------------------------------------------- the call */
  // The transcript in the <details> element is the single source of truth.
  // On wide screens the phone is pinned and the call advances act by act as
  // the copy scrolls past. On narrow screens it plays through when in view.
  var device = document.querySelector('.device');
  var captions = document.querySelector('.captions');
  var chips = document.querySelector('.chips');
  var timer = document.querySelector('.line-state b');
  var replay = document.querySelector('.replay');
  var source = Array.prototype.slice.call(document.querySelectorAll('.transcript li'));
  var acts = Array.prototype.slice.call(document.querySelectorAll('.act'));
  var actStart = { 2: 0, 3: 32, 4: 80 };

  var timers = [];
  var clock = null;
  var seconds = 0;

  function clearTimers() {
    timers.forEach(function (t) { window.clearTimeout(t); });
    timers = [];
    if (clock) { window.clearInterval(clock); clock = null; }
  }
  function fmt(s) { var m = Math.floor(s / 60), r = s % 60; return (m < 10 ? '0' : '') + m + ':' + (r < 10 ? '0' : '') + r; }
  function chipIcon() {
    return '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8.5l3.2 3L13 4.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }
  function captionEl(li, shown) {
    var isAgent = li.classList.contains('agent');
    var el = document.createElement('li');
    el.className = (isAgent ? 'agent' : 'caller') + (shown ? ' is-in' : '');
    el.innerHTML = '<span class="who">' + (isAgent ? 'Agent' : 'Caller') + '</span>' + li.querySelector('.said').textContent;
    return el;
  }
  function chipEl(li, shown) {
    var c = document.createElement('li');
    c.className = (li.getAttribute('data-kind') || '') + (shown ? ' is-in' : '');
    c.innerHTML = chipIcon() + li.getAttribute('data-chip');
    return c;
  }
  function trimCaptions() { while (captions.children.length > 4) captions.removeChild(captions.firstChild); }

  function renderUpTo(lines, shownCount) {
    // Show the last lines instantly, and all chips so far.
    captions.innerHTML = '';
    chips.innerHTML = '';
    lines.slice(-4).forEach(function (li) { captions.appendChild(captionEl(li, true)); });
    lines.forEach(function (li) { if (li.getAttribute('data-chip')) chips.appendChild(chipEl(li, true)); });
    if (timer) timer.textContent = fmt(shownCount);
  }

  function playLines(lines, startSeconds, onDone) {
    seconds = startSeconds;
    if (timer) timer.textContent = fmt(seconds);
    clock = window.setInterval(function () { seconds += 1; if (timer) timer.textContent = fmt(seconds); }, 1000);
    var at = 500;
    lines.forEach(function (li, idx) {
      timers.push(window.setTimeout(function () {
        var el = captionEl(li, false);
        captions.appendChild(el);
        trimCaptions();
        window.requestAnimationFrame(function () { el.classList.add('is-in'); });
        if (li.getAttribute('data-chip')) {
          var c = chipEl(li, false);
          chips.appendChild(c);
          window.setTimeout(function () { c.classList.add('is-in'); }, 260);
        }
        if (idx === lines.length - 1) {
          timers.push(window.setTimeout(function () { if (clock) { window.clearInterval(clock); clock = null; } if (onDone) onDone(); }, 900));
        }
      }, at));
      var words = li.querySelector('.said').textContent.split(/\s+/).length;
      at += Math.min(4200, 1300 + words * 170);
    });
  }

  function buildStatic() {
    device.setAttribute('data-state', 'call');
    renderUpTo(source, 127);
  }

  function playAll() {
    clearTimers();
    device.setAttribute('data-state', 'call');
    captions.innerHTML = '';
    chips.innerHTML = '';
    playLines(source, 0, null);
  }

  // Scene mode: acts drive the phone.
  var scene = document.querySelector('.scene');
  var currentAct = -1;
  function goToAct(n) {
    if (n === currentAct) return;
    currentAct = n;
    acts.forEach(function (a) {
      var k = parseInt(a.getAttribute('data-act'), 10);
      a.classList.toggle('is-active', k === n);
      a.classList.toggle('is-past', k !== 0 && k < n);
    });
    if (scene) scene.classList.toggle('is-shifted', n >= 1);
    clearTimers();
    if (n <= 1) {
      device.setAttribute('data-state', 'ring');
      captions.innerHTML = '';
      chips.innerHTML = '';
      return;
    }
    device.setAttribute('data-state', 'call');
    var before = source.filter(function (li) { return parseInt(li.getAttribute('data-act'), 10) < n; });
    var now = source.filter(function (li) { return parseInt(li.getAttribute('data-act'), 10) === n; });
    renderUpTo(before, actStart[n] || 0);
    playLines(now, actStart[n] || 0, null);
  }

  if (device && captions && chips && source.length) {
    var sceneMode = wide.matches && !reduce && hasIO && acts.length > 1;
    if (reduce || !hasIO) {
      buildStatic();
    } else if (sceneMode) {
      device.setAttribute('data-state', 'ring');
      captions.innerHTML = '';
      chips.innerHTML = '';
      var aIO = new IntersectionObserver(function (entries) {
        // pick the act closest to the middle of the viewport among those intersecting
        var best = null, bestD = Infinity, mid = window.innerHeight / 2;
        acts.forEach(function (a) {
          var r = a.getBoundingClientRect();
          if (r.bottom < 0 || r.top > window.innerHeight) return;
          var c = (r.top + r.bottom) / 2;
          var d = Math.abs(c - mid);
          if (d < bestD) { bestD = d; best = a; }
        });
        if (best) goToAct(parseInt(best.getAttribute('data-act'), 10));
      }, { threshold: [0, 0.25, 0.5, 0.75, 1] });
      acts.forEach(function (a) { aIO.observe(a); });
      goToAct(0);
    } else {
      // Narrow screens: play the whole call once the phone is in view.
      captions.innerHTML = '';
      chips.innerHTML = '';
      device.setAttribute('data-state', 'ring');
      var started = false;
      var dIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting && !started) {
            started = true;
            window.setTimeout(playAll, 900);
            dIO.disconnect();
          }
        });
      }, { threshold: 0.25 });
      dIO.observe(device);
    }
    if (replay) {
      replay.addEventListener('click', function () {
        if (reduce) { buildStatic(); return; }
        if (sceneMode && currentAct >= 2) { var n = currentAct; currentAct = -1; goToAct(n); return; }
        playAll();
      });
    }
  }

  /* ---------------------------------------------------------- contact form */
  var form = document.getElementById('contact-form');
  if (form) {
    var status = form.querySelector('.form-status');

    function setInvalid(field, bad) {
      var wrap = field.closest('.field') || field.closest('.consent');
      if (!wrap) return;
      wrap.classList.toggle('is-invalid', bad);
      field.setAttribute('aria-invalid', bad ? 'true' : 'false');
      var err = wrap.querySelector('.err');
      if (err) {
        if (bad) field.setAttribute('aria-describedby', err.id);
        else field.removeAttribute('aria-describedby');
      }
    }

    function validate(field) {
      var v = (field.value || '').trim();
      var bad = false;
      if (field.type === 'checkbox') bad = !field.checked;
      else if (field.required && !v) bad = true;
      else if (field.type === 'email' && v && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) bad = true;
      else if (field.type === 'tel' && v && v.replace(/\D/g, '').length < 10) bad = true;
      setInvalid(field, bad);
      return !bad;
    }

    var fields = Array.prototype.slice.call(form.querySelectorAll('input, select, textarea'));
    fields.forEach(function (f) {
      f.addEventListener('blur', function () { if (f.value || f.type === 'checkbox') validate(f); });
      f.addEventListener('input', function () {
        var wrap = f.closest('.field') || f.closest('.consent');
        if (wrap && wrap.classList.contains('is-invalid')) validate(f);
      });
    });

    var live = form.getAttribute('data-live') === '1';

    form.addEventListener('submit', function (e) {
      var ok = true;
      var first = null;
      fields.forEach(function (f) {
        if (f.type === 'hidden' || f.closest('.hp')) return;
        var good = validate(f);
        if (!good && !first) first = f;
        ok = ok && good;
      });
      if (!ok) {
        e.preventDefault();
        status.hidden = false;
        status.textContent = 'A few fields need attention. The first one is marked.';
        if (first) first.focus();
        return;
      }
      if (live) {
        form.querySelector('button[type=submit]').disabled = true;
        return;
      }
      e.preventDefault();
      status.hidden = false;
      status.textContent = 'Message received. Someone at Nexus AI Horizon will call or email you to set a time.';
      form.querySelector('button[type=submit]').disabled = true;
    });

    var params = new URLSearchParams(window.location.search);
    if (params.get('sent') === '1') {
      status.hidden = false;
      status.textContent = 'Message received. Someone at Nexus AI Horizon will call or email you to set a time.';
      form.querySelector('button[type=submit]').disabled = true;
    } else if (params.get('problem') === 'fields') {
      status.hidden = false;
      status.textContent = 'Something was missing. Please check the fields and send again.';
    } else if (params.get('problem') === 'expired') {
      status.hidden = false;
      status.textContent = 'The page had been open too long. Please send the form again.';
    }
  }
})();
