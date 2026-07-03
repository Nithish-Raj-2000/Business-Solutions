/**
 * Stackly — Navigation & Header Behavior
 */

const StacklyNav = (() => {
  let ticking = false;

  function initHeaderScroll() {
    const header = document.getElementById('header');
    if (!header) return;

    const isHome = window.location.pathname.endsWith('index.html') ||
                   window.location.pathname.endsWith('/') ||
                   !window.location.pathname.split('/').pop().includes('.');

    function updateHeader() {
      const scrolled = window.scrollY > 80;
      if (isHome) {
        header.classList.toggle('header--solid', scrolled);
        header.classList.toggle('header--transparent', !scrolled);
      }
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateHeader);
        ticking = true;
      }
    }, { passive: true });

    updateHeader();
  }

  function initMobileMenu() {
    const toggle = document.getElementById('menuToggle');
    const drawer = document.getElementById('mobileDrawer');
    const overlay = document.getElementById('drawerOverlay');
    if (!toggle || !drawer) return;

    function closeDrawer() {
      toggle.classList.remove('active');
      drawer.classList.remove('open');
      overlay?.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    function openDrawer() {
      toggle.classList.add('active');
      drawer.classList.add('open');
      overlay?.classList.add('open');
      toggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }

    toggle.addEventListener('click', () => {
      drawer.classList.contains('open') ? closeDrawer() : openDrawer();
    });

    overlay?.addEventListener('click', closeDrawer);

    drawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeDrawer);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeDrawer();
    });
  }

  function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  function initScrollSpy() {
    const sections = document.querySelectorAll('[data-section]');
    const navLinks = document.querySelectorAll('.nav__link');
    if (!sections.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('data-section');
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    }, { threshold: 0.3, rootMargin: '-80px 0px' });

    sections.forEach(section => observer.observe(section));
  }

  function initInactiveLinks() {
    document.addEventListener('click', (e) => {
      const target = e.target.closest('[data-inactive="true"]');
      if (target) {
        e.preventDefault();
        window.location.href = '404.html';
      }
    });
  }

  function init() {
    initHeaderScroll();
    initMobileMenu();
    initBackToTop();
    initScrollSpy();
    initInactiveLinks();
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(StacklyNav.init, 50);
});
