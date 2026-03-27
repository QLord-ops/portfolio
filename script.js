/* ============================================
   PORTFOLIO — Yevhenii Stolovoi
   Premium Interactions — v2
   ============================================ */

(function () {
  'use strict';

  /* ========== UTILITIES ========== */
  function lerp(a, b, t) { return a + (b - a) * t; }

  /* ========== NAVIGATION — Scroll Shrink & Active Link ========== */
  var nav = document.getElementById('nav');
  var sections = document.querySelectorAll('.section, .hero');
  var navLinks = document.querySelectorAll('.nav-links a');

  function handleScroll() {
    var sy = window.scrollY;
    nav.classList.toggle('scrolled', sy > 50);

    var current = '';
    sections.forEach(function (s) {
      if (sy >= s.offsetTop - 250) current = s.id;
    });
    navLinks.forEach(function (l) {
      l.classList.toggle('active', l.getAttribute('href') === '#' + current);
    });
  }

  window.addEventListener('scroll', handleScroll, { passive: true });

  /* ========== MOBILE NAVIGATION ========== */
  var navToggle = document.getElementById('navToggle');
  var navLinksEl = document.getElementById('navLinks');

  navToggle.addEventListener('click', function () {
    navToggle.classList.toggle('active');
    navLinksEl.classList.toggle('open');
    document.body.style.overflow = navLinksEl.classList.contains('open') ? 'hidden' : '';
  });

  navLinksEl.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navToggle.classList.remove('active');
      navLinksEl.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* ========== SMOOTH SCROLL ========== */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        var top = target.getBoundingClientRect().top + window.scrollY - nav.offsetHeight - 24;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* ========== SCROLL REVEAL — Staggered IntersectionObserver ========== */
  var reveals = document.querySelectorAll('.reveal');

  var isMobile = window.innerWidth <= 768;
  var staggerDelay = isMobile ? 80 : 120;
  var revealMargin = isMobile ? '0px 0px -20px 0px' : '0px 0px -60px 0px';

  var revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        var parent = entry.target.parentElement;
        var siblings = Array.from(parent.children).filter(function (el) {
          return el.classList.contains('reveal');
        });
        var idx = siblings.indexOf(entry.target);
        var delay = Math.max(0, idx) * staggerDelay;

        setTimeout(function () {
          entry.target.classList.add('visible');
        }, delay);

        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.06, rootMargin: revealMargin }
  );

  reveals.forEach(function (el) { revealObserver.observe(el); });

  /* ========== DEVICE DETECTION ========== */
  var isTouchDevice = ('ontouchstart' in window) ||
    (navigator.maxTouchPoints > 0) ||
    (window.matchMedia('(hover: none) and (pointer: coarse)').matches);

  /* ========== MAGNETIC BUTTONS ========== */
  var magnetics = document.querySelectorAll('.magnetic');

  if (!isTouchDevice) {
    magnetics.forEach(function (btn) {
      var strength = 0.35;
      var resetId;

      btn.addEventListener('mousemove', function (e) {
        var rect = btn.getBoundingClientRect();
        var cx = rect.left + rect.width / 2;
        var cy = rect.top + rect.height / 2;
        var dx = (e.clientX - cx) * strength;
        var dy = (e.clientY - cy) * strength;
        btn.style.transform = 'translate(' + dx + 'px, ' + dy + 'px)';
        cancelAnimationFrame(resetId);
      });

      btn.addEventListener('mouseleave', function () {
        btn.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
        btn.style.transform = 'translate(0, 0)';
        resetId = requestAnimationFrame(function () {
          btn.addEventListener('mousemove', function handler() {
            btn.style.transition = 'none';
            btn.removeEventListener('mousemove', handler);
          });
        });
      });
    });
  }

  /* ========== CARD CURSOR GLOW — Refined ========== */
  var glowCards = document.querySelectorAll('.project-card, .skill-category, .contact-card');

  if (!isTouchDevice) {
    glowCards.forEach(function (card) {
      var glow = card.querySelector('.project-card-glow');

      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;

        if (glow) {
          glow.style.background =
            'radial-gradient(700px circle at ' + x + 'px ' + y + 'px, ' +
            'rgba(79, 143, 247, 0.07), transparent 40%)';
        }

        card.style.setProperty('--mouse-x', x + 'px');
        card.style.setProperty('--mouse-y', y + 'px');
      });

      card.addEventListener('mouseleave', function () {
        if (glow) glow.style.background = '';
      });
    });
  }

  /* ========== STACK TAG — Micro Interaction ========== */
  document.querySelectorAll('.stack-tag').forEach(function (tag) {
    tag.addEventListener('mouseenter', function () {
      var r = (Math.random() - 0.5) * 4;
      this.style.transform = 'translateY(-4px) scale(1.04) rotate(' + r + 'deg)';
    });
    tag.addEventListener('mouseleave', function () {
      this.style.transform = '';
    });
  });

  /* ========== HERO PARALLAX — Mouse-driven ========== */
  var heroContent = document.querySelector('.hero-content');
  var heroOrbs = document.querySelectorAll('.hero-orb');

  if (!isTouchDevice && heroContent) {
    var currentX = 0, currentY = 0;
    var targetX = 0, targetY = 0;

    document.addEventListener('mousemove', function (e) {
      targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    function parallaxLoop() {
      currentX = lerp(currentX, targetX, 0.04);
      currentY = lerp(currentY, targetY, 0.04);

      heroContent.style.transform =
        'translate(' + (currentX * -8) + 'px, ' + (currentY * -6) + 'px)';

      heroOrbs.forEach(function (orb, i) {
        var factor = (i + 1) * 12;
        orb.style.transform =
          'translate(' + (currentX * factor) + 'px, ' + (currentY * factor) + 'px)';
      });

      requestAnimationFrame(parallaxLoop);
    }

    parallaxLoop();
  }

  /* ========== AMBIENT CURSOR GLOW — Page-wide (desktop only) ========== */
  if (!isTouchDevice && window.innerWidth > 768) {
    var cursorGlow = document.createElement('div');
    cursorGlow.style.cssText =
      'position:fixed;width:400px;height:400px;border-radius:50%;' +
      'background:radial-gradient(circle,rgba(79,143,247,0.04),transparent 70%);' +
      'pointer-events:none;z-index:0;transform:translate(-50%,-50%);' +
      'transition:opacity 0.3s ease;opacity:0;';
    document.body.appendChild(cursorGlow);

    var glowX = 0, glowY = 0, glowTargetX = 0, glowTargetY = 0;

    document.addEventListener('mousemove', function (e) {
      glowTargetX = e.clientX;
      glowTargetY = e.clientY;
      cursorGlow.style.opacity = '1';
    });

    document.addEventListener('mouseleave', function () {
      cursorGlow.style.opacity = '0';
    });

    function moveGlow() {
      glowX = lerp(glowX, glowTargetX, 0.08);
      glowY = lerp(glowY, glowTargetY, 0.08);
      cursorGlow.style.left = glowX + 'px';
      cursorGlow.style.top = glowY + 'px';
      requestAnimationFrame(moveGlow);
    }

    moveGlow();
  }

})();
