/* ============================================
   PREMIUM PRO CONTRACTORS — main.js
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ── Mobile Menu ── */
  const toggle = document.querySelector('.menu-toggle');
  const nav    = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      const open = nav.classList.toggle('open');
      toggle.classList.toggle('active', open);
      toggle.setAttribute('aria-expanded', open);
    });
    document.addEventListener('click', function (e) {
      if (!toggle.contains(e.target) && !nav.contains(e.target)) {
        nav.classList.remove('open');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', false);
      }
    });
  }

  /* ── FAQ Accordion ── */
  document.querySelectorAll('.faq__q').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const item = btn.closest('.faq__item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq__item.open').forEach(function (el) {
        el.classList.remove('open');
      });
      if (!isOpen) item.classList.add('open');
    });
  });

  /* ── Reveal on Scroll ── */
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    reveals.forEach(function (el) { observer.observe(el); });
  }

  /* ── Sticky header shadow ── */
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', function () {
      header.style.boxShadow = window.scrollY > 20
        ? '0 4px 20px rgba(0,0,0,.35)'
        : 'none';
    }, { passive: true });
  }

  /* ── Form submit feedback ── */
  document.querySelectorAll('form[data-feedback]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const msg = form.querySelector('.form__success');
      if (msg) {
        form.style.display = 'none';
        msg.style.display  = 'block';
      }
    });
  });

  /* ── Smooth anchor scrolling ── */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── Active nav link ── */
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  document.querySelectorAll('.nav a').forEach(function (a) {
    const href = a.getAttribute('href').replace(/\/$/, '') || '/';
    if (path === href || (href !== '/' && path.startsWith(href))) {
      a.classList.add('active');
    }
  });

  /* ── Before/After slider (pointer events + rAF) ── */
  document.querySelectorAll('[data-ba]').forEach(function (container) {
    const after   = container.querySelector('.before-after__after');
    const divider = container.querySelector('.before-after__divider');
    const handle  = container.querySelector('.before-after__handle');
    let dragging  = false;
    let pendingPct = null;
    let rafId = 0;

    function apply(pct) {
      const pctStr = pct + '%';
      after.style.clipPath = 'inset(0 ' + (100 - pct) + '% 0 0)';
      divider.style.left   = pctStr;
      handle.style.left    = pctStr;
    }

    function schedule(pct) {
      pendingPct = Math.max(2, Math.min(98, pct));
      if (rafId) return;
      rafId = requestAnimationFrame(function () {
        rafId = 0;
        if (pendingPct !== null) apply(pendingPct);
      });
    }

    function getPercent(e) {
      const rect = container.getBoundingClientRect();
      return ((e.clientX - rect.left) / rect.width) * 100;
    }

    container.addEventListener('pointerdown', function (e) {
      dragging = true;
      container.setPointerCapture(e.pointerId);
      container.classList.add('is-dragging');
      schedule(getPercent(e));
      e.preventDefault();
    });
    container.addEventListener('pointermove', function (e) {
      if (dragging) schedule(getPercent(e));
    });
    function stop(e) {
      if (!dragging) return;
      dragging = false;
      container.classList.remove('is-dragging');
      try { container.releasePointerCapture(e.pointerId); } catch (_) {}
    }
    container.addEventListener('pointerup', stop);
    container.addEventListener('pointercancel', stop);
    container.addEventListener('pointerleave', stop);
  });

  /* ── Video Sound Toggle ── */
  document.querySelectorAll('.video-sound').forEach(function (btn) {
    const video = btn.closest('.video-wrap').querySelector('video');
    if (!video) return;
    video.muted = true;
    btn.setAttribute('aria-pressed', 'false');
    btn.addEventListener('click', function () {
      video.muted = !video.muted;
      btn.setAttribute('aria-pressed', video.muted ? 'false' : 'true');
      btn.setAttribute('aria-label', video.muted ? 'Unmute video' : 'Mute video');
      if (!video.muted) {
        const p = video.play();
        if (p && p.catch) p.catch(function () {});
      }
    });
  });

});
