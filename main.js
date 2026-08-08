/* ============================================================================
   BOS — Business Operating System | main.js
   Vanilla JS only. No frameworks, no build step.
   ============================================================================

   HOW TO CHANGE THE CONTACT CHANNEL LINKS
   ----------------------------------------------------------------------------
   All outbound contact links live in ONE place: the CONTACT_LINKS object
   directly below. Replace the placeholder "#" values with your real URLs,
   e.g.:

     const CONTACT_LINKS = {
       facebook:  'https://facebook.com/yourpage',
       instagram: 'https://instagram.com/yourhandle',
       whatsapp:  'https://wa.me/60123456789',
     };

   The keys (facebook / instagram / whatsapp) must match the
   `data-channel="..."` attributes on the .contact-option links inside the
   dialog markup in index.html. On page load, this script reads
   CONTACT_LINKS and writes each URL into the matching link's href
   automatically — you never need to touch index.html to update a link.
   ============================================================================ */

const CONTACT_LINKS = {
  facebook: '#',  // TODO: replace with the real Facebook Page URL
  instagram: '#', // TODO: replace with the real Instagram profile URL
  whatsapp: '#',  // TODO: replace with the real WhatsApp chat link (e.g. https://wa.me/60XXXXXXXXX)
};

(function () {
  'use strict';

  /* --------------------------------------------------------------------
     0. Small helpers
     -------------------------------------------------------------------- */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const FOCUSABLE_SELECTOR =
    'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

  /* --------------------------------------------------------------------
     1. Wire up contact channel URLs from the config object above
     -------------------------------------------------------------------- */
  function applyContactLinks() {
    document.querySelectorAll('.contact-option[data-channel]').forEach((link) => {
      const channel = link.getAttribute('data-channel');
      if (Object.prototype.hasOwnProperty.call(CONTACT_LINKS, channel)) {
        link.setAttribute('href', CONTACT_LINKS[channel]);
      }
    });
  }

  /* --------------------------------------------------------------------
     2. Contact channel dialog
        — open / close, focus trap, Esc to close
        — staggered entrance for the three options
        — Arrow Up/Down to move between options
        — mobile: swipe the handle down to dismiss (bottom-sheet gesture)
     -------------------------------------------------------------------- */
  function initContactDialog() {
    const overlay = document.querySelector('.js-contact-overlay');
    const panel = overlay ? overlay.querySelector('.contact-panel') : null;
    const handle = overlay ? overlay.querySelector('.contact-panel-handle') : null;
    const closeBtn = overlay ? overlay.querySelector('.js-contact-close') : null;
    const options = overlay ? Array.from(overlay.querySelectorAll('.contact-option')) : [];
    const triggers = document.querySelectorAll('.js-contact-trigger');

    if (!overlay || !panel) return;

    let lastFocusedEl = null;

    function getFocusable() {
      return Array.from(panel.querySelectorAll(FOCUSABLE_SELECTOR)).filter(
        (el) => el.offsetParent !== null
      );
    }

    // Stagger the three contact options in on open. The inline delay is
    // cleared again once each option has settled, so it never lingers
    // around and slows down later hover/focus transitions.
    function staggerOptionsIn() {
      if (prefersReducedMotion) return;
      options.forEach((option, index) => {
        const delay = index * 70;
        option.style.transitionDelay = `${delay}ms`;
        window.setTimeout(() => {
          option.style.transitionDelay = '';
        }, delay + 450);
      });
    }

    function openDialog(triggerEl) {
      lastFocusedEl = triggerEl || document.activeElement;

      overlay.hidden = false;
      // Force layout so the transition below actually animates in.
      // eslint-disable-next-line no-unused-expressions
      overlay.offsetHeight;
      overlay.setAttribute('data-open', 'true');
      staggerOptionsIn();

      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', onKeydown, true);

      const focusable = getFocusable();
      (focusable[0] || panel).focus();
    }

    function closeDialog() {
      overlay.setAttribute('data-open', 'false');
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKeydown, true);
      panel.style.transform = '';

      const finish = () => {
        overlay.hidden = true;
      };

      if (prefersReducedMotion) {
        finish();
      } else {
        window.setTimeout(finish, 320);
      }

      if (lastFocusedEl && typeof lastFocusedEl.focus === 'function') {
        lastFocusedEl.focus();
      }
    }

    function onKeydown(event) {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeDialog();
        return;
      }

      // Basic focus trap: keep Tab cycling inside the panel.
      if (event.key === 'Tab') {
        const focusable = getFocusable();
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
        return;
      }

      // Arrow keys: move focus between the contact channel icons. The
      // options are laid out in a horizontal row, so Left/Right is the
      // primary pairing, but Up/Down still works too for convenience.
      const isNext = event.key === 'ArrowRight' || event.key === 'ArrowDown';
      const isPrev = event.key === 'ArrowLeft' || event.key === 'ArrowUp';
      if ((isNext || isPrev) && options.length > 0) {
        event.preventDefault();
        const currentIndex = options.indexOf(document.activeElement);
        let nextIndex;
        if (currentIndex === -1) {
          nextIndex = 0;
        } else if (isNext) {
          nextIndex = (currentIndex + 1) % options.length;
        } else {
          nextIndex = (currentIndex - 1 + options.length) % options.length;
        }
        options[nextIndex].focus();
      }
    }

    triggers.forEach((trigger) => {
      trigger.addEventListener('click', () => openDialog(trigger));
    });

    closeBtn.addEventListener('click', closeDialog);

    // Click on the dimmed backdrop (outside the panel) closes the dialog.
    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) {
        closeDialog();
      }
    });

    // Mobile gesture: drag the handle down to dismiss the bottom sheet.
    if (handle && 'ontouchstart' in window) {
      let startY = 0;
      let deltaY = 0;
      let dragging = false;

      handle.addEventListener(
        'touchstart',
        (event) => {
          dragging = true;
          startY = event.touches[0].clientY;
          panel.style.transition = 'none';
        },
        { passive: true }
      );

      handle.addEventListener(
        'touchmove',
        (event) => {
          if (!dragging) return;
          deltaY = event.touches[0].clientY - startY;
          if (deltaY > 0) {
            panel.style.transform = `translateY(${deltaY}px)`;
          }
        },
        { passive: true }
      );

      handle.addEventListener('touchend', () => {
        if (!dragging) return;
        dragging = false;
        panel.style.transition = '';

        if (deltaY > 90) {
          closeDialog();
        } else {
          panel.style.transform = '';
        }
        deltaY = 0;
      });
    }
  }

  /* --------------------------------------------------------------------
     3. Mobile nav toggle
        — open/close, close on outside click, close on Escape
     -------------------------------------------------------------------- */
  function initMobileNav() {
    const toggle = document.getElementById('navToggle');
    const links = document.getElementById('navLinks');
    const nav = document.getElementById('siteNav');
    if (!toggle || !links) return;

    function isOpen() {
      return toggle.getAttribute('aria-expanded') === 'true';
    }

    function setOpen(open) {
      toggle.setAttribute('aria-expanded', String(open));
      links.setAttribute('data-open', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }

    toggle.addEventListener('click', () => {
      setOpen(!isOpen());
    });

    // Close the mobile menu whenever a nav link is followed.
    links.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => setOpen(false));
    });

    // Close when tapping/clicking outside the nav entirely.
    document.addEventListener('click', (event) => {
      if (isOpen() && nav && !nav.contains(event.target)) {
        setOpen(false);
      }
    });

    // Close on Escape, and return focus to the toggle button.
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && isOpen()) {
        setOpen(false);
        toggle.focus();
      }
    });
  }

  /* --------------------------------------------------------------------
     4. Nav on scroll
        — subtle border/shadow once the page has scrolled
        — scroll-spy: highlight the nav link for the section in view
        The nav itself is always pinned to the top (see `.nav { position:
        sticky; top: 0; }` in styles.css) and never hides while scrolling.
     -------------------------------------------------------------------- */
  function initNavScrollBehaviour() {
    const nav = document.getElementById('siteNav');
    if (!nav) return;

    const links = Array.from(nav.querySelectorAll('.nav-links a[href^="#"]'));
    const sections = links
      .map((link) => document.querySelector(link.getAttribute('href')))
      .filter(Boolean);

    function updateActiveLink() {
      const probe = nav.offsetHeight + 48;
      let currentId = '';

      sections.forEach((section) => {
        if (section.getBoundingClientRect().top <= probe) {
          currentId = section.id;
        }
      });

      links.forEach((link) => {
        link.classList.toggle('is-active', link.getAttribute('href') === `#${currentId}`);
      });
    }

    function updateScrolledState() {
      nav.classList.toggle('is-scrolled', window.scrollY > 8);
    }

    function onScroll() {
      updateActiveLink();
      updateScrolledState();
    }

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* --------------------------------------------------------------------
     5. Scroll-reveal for section content
        Items that share the same parent (e.g. the five service rows, or
        the three process steps) are staggered in one after another
        instead of all fading in at once. The inline delay is cleared
        again right after each element settles, so it can never bleed
        into later hover/focus transitions.
     -------------------------------------------------------------------- */
  function initScrollReveal() {
    const items = Array.from(document.querySelectorAll('.reveal'));
    if (items.length === 0) return;

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    // Group siblings so we can stagger each group independently.
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

          // Clear the inline delay once the reveal transition has
          // finished so it doesn't affect this element's own hover
          // transitions later on.
          window.setTimeout(() => {
            el.style.transitionDelay = '';
          }, delay + 750);

          observer.unobserve(el);
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    items.forEach((el) => observer.observe(el));
  }

  /* --------------------------------------------------------------------
     Init
     -------------------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', () => {
    applyContactLinks();
    initContactDialog();
    initMobileNav();
    initNavScrollBehaviour();
    initScrollReveal();
  });
})();
