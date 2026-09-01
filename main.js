/* ============================================================================
   BOS — Business Operating System | main.js
   Vanilla JS only. No frameworks, no build step.
   ============================================================================

   HOW TO CHANGE THE CONTACT CHANNEL LINKS
   ----------------------------------------------------------------------------
   All outbound contact links live in ONE place: the CONTACT_LINKS object
   below. Used by /contact/ page rows (.contact-channel[data-channel]).
   If you change these URLs, also update JSON-LD "sameAs" / telephone where
   relevant so search engines stay in sync.
   ============================================================================ */

const CONTACT_LINKS = {
  facebook: 'https://www.facebook.com/bostechmy',
  instagram: 'https://www.instagram.com/bostechmy/',
  whatsapp: 'https://wa.me/601116641914',
};

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /** Normalize path for compare: "/faq/" and "/faq" → "/faq", root → "/". */
  function normalizePath(pathname) {
    if (!pathname) return '/';
    let p = pathname.replace(/\/index\.html$/i, '');
    if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1);
    return p || '/';
  }

  function pathFromHref(href) {
    try {
      return normalizePath(new URL(href, window.location.href).pathname);
    } catch (err) {
      return '';
    }
  }

  /* --------------------------------------------------------------------
     1. Wire contact channel URLs onto any [data-channel] links
     -------------------------------------------------------------------- */
  function applyContactLinks() {
    document.querySelectorAll('[data-channel]').forEach((link) => {
      const channel = link.getAttribute('data-channel');
      if (Object.prototype.hasOwnProperty.call(CONTACT_LINKS, channel)) {
        link.setAttribute('href', CONTACT_LINKS[channel]);
      }
    });
  }

  /* --------------------------------------------------------------------
     2. Mobile nav: toggle, outside click, Esc, scroll lock, focus trap
     -------------------------------------------------------------------- */
  function initMobileNav() {
    const toggle = document.getElementById('navToggle');
    const links = document.getElementById('navLinks');
    const nav = document.getElementById('siteNav');
    if (!toggle || !links) return;

    let lastFocused = null;

    function isOpen() {
      return toggle.getAttribute('aria-expanded') === 'true';
    }

    function focusableInMenu() {
      return [toggle].concat(
        Array.from(links.querySelectorAll('a[href]')).filter((el) => !el.hasAttribute('disabled'))
      );
    }

    function setOpen(open) {
      toggle.setAttribute('aria-expanded', String(open));
      links.setAttribute('data-open', String(open));
      document.body.classList.toggle('nav-open', open);

      const labelOpen = toggle.getAttribute('data-label-open') || 'Open menu';
      const labelClose = toggle.getAttribute('data-label-close') || 'Close menu';
      toggle.setAttribute('aria-label', open ? labelClose : labelOpen);

      if (open) {
        lastFocused = document.activeElement;
        const items = focusableInMenu();
        const firstLink = items.find((el) => el !== toggle) || toggle;
        window.setTimeout(() => firstLink.focus(), 50);
      } else if (lastFocused && typeof lastFocused.focus === 'function') {
        lastFocused.focus();
        lastFocused = null;
      }
    }

    toggle.addEventListener('click', () => {
      setOpen(!isOpen());
    });

    links.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => setOpen(false));
    });

    document.addEventListener('click', (event) => {
      if (isOpen() && nav && !nav.contains(event.target)) {
        setOpen(false);
      }
    });

    document.addEventListener('keydown', (event) => {
      if (!isOpen()) return;

      if (event.key === 'Escape') {
        setOpen(false);
        toggle.focus();
        return;
      }

      if (event.key !== 'Tab') return;

      const items = focusableInMenu();
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    });
  }

  /* --------------------------------------------------------------------
     3. Nav highlight: path match + homepage light spy (#process)
     -------------------------------------------------------------------- */
  function initNavScrollBehaviour() {
    const nav = document.getElementById('siteNav');
    if (!nav) return;

    const links = Array.from(nav.querySelectorAll('.nav-links a'));
    const here = normalizePath(window.location.pathname);
    const isLangHome = here === '/' || here === '/zh';

    function updateScrolledState() {
      nav.classList.toggle('is-scrolled', window.scrollY > 8);
    }

    // Deep pages / non-home: highlight by matching pathname.
    if (!isLangHome) {
      links.forEach((link) => {
        const href = link.getAttribute('href');
        if (!href || href.startsWith('#')) return;
        const p = pathFromHref(href);
        const match = p === here;
        link.classList.toggle('is-active', match);
        if (match && !link.hasAttribute('aria-current')) {
          link.setAttribute('aria-current', 'page');
        }
      });
      updateScrolledState();
      window.addEventListener('scroll', updateScrolledState, { passive: true });
      return;
    }

    const homeLink = links.find((link) => pathFromHref(link.getAttribute('href')) === here);
    const processLink = links.find((link) => pathFromHref(link.getAttribute('href')) === '/process');
    const processSection = document.getElementById('process');

    function updateActiveFromScroll() {
      const probe = nav.offsetHeight + 48;
      const atProcess =
        processSection && processSection.getBoundingClientRect().top <= probe;

      links.forEach((link) => {
        if (link === homeLink || link === processLink) {
          link.classList.remove('is-active');
        }
      });

      if (atProcess && processLink) {
        processLink.classList.add('is-active');
      } else if (homeLink) {
        homeLink.classList.add('is-active');
      }
    }

    function onScroll() {
      updateActiveFromScroll();
      updateScrolledState();
    }

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* --------------------------------------------------------------------
     4. Scroll-reveal (stagger siblings under the same parent)
     -------------------------------------------------------------------- */
  function initScrollReveal() {
    const items = Array.from(document.querySelectorAll('.reveal'));
    if (items.length === 0) return;

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const groups = new Map();
    items.forEach((el) => {
      const parent = el.parentElement;
      if (!groups.has(parent)) groups.set(parent, []);
      groups.get(parent).push(el);
    });

    const delayFor = new Map();
    groups.forEach((siblings) => {
      siblings.forEach((el, index) => {
        delayFor.set(el, Math.min(index, 5) * 90);
      });
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const delay = delayFor.get(el) || 0;

          el.style.transitionDelay = `${delay}ms`;
          el.classList.add('is-visible');

          window.setTimeout(() => {
            el.style.transitionDelay = '';
          }, delay + 750);

          observer.unobserve(el);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -32px 0px' }
    );

    items.forEach((el) => observer.observe(el));
  }

  /* --------------------------------------------------------------------
     5. FAQ accordion: one open at a time (details/summary)
     -------------------------------------------------------------------- */
  function initFaqAccordion() {
    // Support multiple FAQ lists on one page (e.g. capability Q&A layers).
    document.querySelectorAll('.faq-list').forEach((list) => {
      list.addEventListener(
        'toggle',
        (event) => {
          const target = event.target;
          if (!(target instanceof HTMLDetailsElement) || !target.open) return;
          list.querySelectorAll('details.faq-item[open]').forEach((item) => {
            if (item !== target) item.open = false;
          });
        },
        true
      );
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    applyContactLinks();
    initMobileNav();
    initNavScrollBehaviour();
    initScrollReveal();
    initFaqAccordion();
  });
})();
