/**
 * Stackly — Page Transitions
 */

const StacklyTransitions = (() => {
  function initPageTransitions() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    document.querySelectorAll('a').forEach(link => {
      const href = link.getAttribute('href');

      // Ignore links that are not for navigation
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || link.getAttribute('target') === '_blank' || link.hasAttribute('data-video')) {
        return;
      }

      link.addEventListener('click', (e) => {
        e.preventDefault();

        // Show preloader
        preloader.classList.remove('hidden');

        // Wait for the preloader fade to play then navigate
        setTimeout(() => {
          window.location.href = href;
        }, 500);
      });
    });
  }

  function init() {
    initPageTransitions();
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(StacklyTransitions.init, 150);
});

// When the browser restores a page from the back/forward cache (e.g. the user
// pressed Back), the preloader shown just before leaving would still be
// covering the page — hide it again.
window.addEventListener('pageshow', (e) => {
  if (e.persisted) {
    const preloader = document.getElementById('preloader');
    if (preloader) preloader.classList.add('hidden');
  }
});
