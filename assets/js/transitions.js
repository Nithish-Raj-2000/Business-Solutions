/**
 * Stackly — Page Transitions
 *
 * Navigation is left entirely to the browser. The previous implementation
 * intercepted link clicks, showed the preloader, and navigated after a
 * 500ms delay — on real network latency (e.g. GitHub Pages) that caused
 * stuck preloader overlays after Back navigation, races with other click
 * handlers, and polluted browser history.
 */

// Safety net: if a page is restored from the back/forward cache with the
// preloader still visible, hide it.
window.addEventListener('pageshow', (e) => {
  if (e.persisted) {
    const preloader = document.getElementById('preloader');
    if (preloader) preloader.classList.add('hidden');
  }
});
