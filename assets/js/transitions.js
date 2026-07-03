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

        // Wait for 2 seconds then navigate
        setTimeout(() => {
          window.location.href = href;
        }, 2000);
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
