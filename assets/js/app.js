(function () {
  'use strict';

  var root = document.documentElement;
  var WA_NUMBER = '22389854352';

  // ── Thème clair / sombre ──
  var toggle = document.querySelector('.nav__theme-toggle');
  if (toggle) {
    var syncLabel = function () {
      var dark = root.getAttribute('data-theme') === 'dark';
      toggle.setAttribute('aria-label', dark ? 'Passer en mode clair' : 'Passer en mode sombre');
    };
    syncLabel();
    toggle.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('genesis-theme', next); } catch (e) {}
      syncLabel();
    });
  }

  // ── Ombre de la barre de navigation au défilement ──
  var nav = document.querySelector('.nav');
  var onScroll = function () { if (nav) nav.classList.toggle('is-scrolled', window.scrollY > 8); };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ── Menu mobile ──
  var burger = document.querySelector('.nav__burger');
  var menu = document.getElementById('mobile-menu');
  var setMenu = function (open) {
    if (!burger || !menu) return;
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    menu.classList.toggle('is-open', open);
    menu.setAttribute('aria-hidden', String(!open));
    document.body.classList.toggle('menu-open', open);
  };
  if (burger && menu) {
    burger.addEventListener('click', function () {
      setMenu(burger.getAttribute('aria-expanded') !== 'true');
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setMenu(false);
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 1000) setMenu(false);
    });
  }

  // ── Apparition des blocs au défilement ──
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // ── Lien actif dans le menu ──
  var links = document.querySelectorAll('.nav__link');
  if ('IntersectionObserver' in window && links.length) {
    var byId = {};
    links.forEach(function (l) { byId[l.getAttribute('href').slice(1)] = l; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (l) { l.classList.remove('is-active'); });
        var active = byId[entry.target.id];
        if (active) active.classList.add('is-active');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(byId).forEach(function (id) {
      var s = document.getElementById(id);
      if (s) spy.observe(s);
    });
  }

  // ── FAQ : une seule réponse ouverte à la fois ──
  var faqs = document.querySelectorAll('.faq-item');
  faqs.forEach(function (item) {
    item.addEventListener('toggle', function () {
      if (!item.open) return;
      faqs.forEach(function (other) { if (other !== item) other.open = false; });
    });
  });

  // ── Pré-inscription → WhatsApp ──
  var form = document.getElementById('preinscription-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      var v = function (id) { return document.getElementById(id).value.trim(); };
      var lines = [
        'Bonjour École Genesis,',
        '',
        'Je souhaite pré-inscrire mon enfant :',
        '• Parent : ' + v('f-parent'),
        '• Téléphone : ' + v('f-tel'),
        '• Enfant : ' + v('f-enfant'),
        '• Cycle : ' + v('f-cycle')
      ];
      var msg = v('f-message');
      if (msg) lines.push('• Message : ' + msg);
      var url = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(lines.join('\n'));
      var win = window.open(url, '_blank', 'noopener');
      if (!win) window.location.href = url;
    });
  }

  // ── Année du pied de page ──
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
