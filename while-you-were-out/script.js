(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO = 'IntersectionObserver' in window;

  /* ---------------------------------------------------------- menu */
  var top = document.getElementById('top');
  var menuBtn = document.querySelector('.menu-btn');
  if (menuBtn && top) {
    menuBtn.addEventListener('click', function () {
      var open = top.classList.toggle('is-open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      menuBtn.textContent = open ? 'Close' : 'Menu';
    });
    top.querySelectorAll('.nav a').forEach(function (a) {
      a.addEventListener('click', function () {
        top.classList.remove('is-open');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.textContent = 'Menu';
      });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && top.classList.contains('is-open')) {
        top.classList.remove('is-open');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.textContent = 'Menu';
        menuBtn.focus();
      }
    });
  }

  /* ------------------------------------------------- slip fill-in */
  // Each slip fills in field by field. Order: fields, then checks, then signature.
  function indexSlip(slip) {
    var i = 0;
    slip.querySelectorAll('.slip-fields dd').forEach(function (dd) { dd.style.setProperty('--i', i++); });
    slip.querySelectorAll('.slip-checks li').forEach(function (li) { li.style.setProperty('--i', i++); });
    slip.querySelectorAll('.slip-foot b').forEach(function (b) { b.style.setProperty('--i', i++); });
  }

  var slips = Array.prototype.slice.call(document.querySelectorAll('.slip[data-fill]'));
  slips.forEach(indexSlip);

  function fill(slip) { slip.classList.add('is-filled'); }

  var heroSlip = document.querySelector('.hero .slip[data-fill]');
  var others = slips.filter(function (s) { return s !== heroSlip; });

  if (reduce || !hasIO) {
    slips.forEach(fill);
  } else {
    var ready = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    ready.then(function () {
      if (heroSlip) window.setTimeout(function () { fill(heroSlip); }, 320);
    });
    var slipIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { fill(en.target); slipIO.unobserve(en.target); }
      });
    }, { threshold: 0.3, rootMargin: '0px 0px -8% 0px' });
    others.forEach(function (s) { slipIO.observe(s); });
  }

  /* ------------------------------------------------- reveals */
  var reveals = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  if (reduce || !hasIO) {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    // stagger within each parent list
    var parents = new Map();
    reveals.forEach(function (el) {
      var p = el.parentNode;
      var n = parents.get(p) || 0;
      el.style.setProperty('--d', Math.min(n, 6) * 60 + 'ms');
      parents.set(p, n + 1);
    });
    var revIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); revIO.unobserve(en.target); }
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -6% 0px' });
    reveals.forEach(function (el) { revIO.observe(el); });
  }

  /* ------------------------------------------------- checklist ticks */
  var checks = Array.prototype.slice.call(document.querySelectorAll('.checks li'));
  if (reduce || !hasIO) {
    checks.forEach(function (li) { li.classList.add('is-on'); });
  } else {
    var ckIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          var li = en.target;
          window.setTimeout(function () { li.classList.add('is-on'); }, 140);
          ckIO.unobserve(li);
        }
      });
    }, { threshold: 0.6 });
    checks.forEach(function (li) { ckIO.observe(li); });
  }

  /* ------------------------------------------------- contact form */
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

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      var first = null;
      fields.forEach(function (f) {
        var good = validate(f);
        if (!good && !first) first = f;
        ok = ok && good;
      });
      if (!ok) {
        status.hidden = false;
        status.textContent = 'A few fields need attention. The first one is marked.';
        if (first) first.focus();
        return;
      }
      // No backend is wired in this prototype. The WordPress build posts this
      // to the site's form handler and CRM; see HANDOFF.md.
      status.hidden = false;
      status.textContent = 'Message received. Someone at Nexus AI Horizon will call or email you to set a time for the strategy call.';
      form.querySelector('button[type=submit]').disabled = true;
    });
  }
})();
