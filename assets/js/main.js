/**
 * Stackly Business Solutions — Main Entry
 */

const Stackly = (() => {
  function debounce(fn, delay) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  }

  function throttle(fn, limit) {
    let inThrottle;
    return (...args) => {
      if (!inThrottle) {
        fn(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  function initLazyLoad() {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
            }
            observer.unobserve(img);
          }
        });
      });
      lazyImages.forEach(img => observer.observe(img));
    }
  }

  function initSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  function initSolutionTabs() {
    const items = document.querySelectorAll('.solution-item');
    const preview = document.getElementById('solutionPreview');
    if (!items.length) return;

    items.forEach(item => {
      item.addEventListener('click', () => {
        items.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        if (preview) {
          const img = item.getAttribute('data-image');
          const title = item.querySelector('.solution-item__title')?.textContent;
          const desc = item.getAttribute('data-desc');
          if (img) preview.querySelector('img').src = img;
          if (title) preview.querySelector('h3').textContent = title;
          if (desc) preview.querySelector('p').textContent = desc;
        }
      });
    });
  }

  function initProjectFilter() {
    const tags = document.querySelectorAll('.tag-cloud__item[data-filter]');
    const cards = document.querySelectorAll('[data-category]');
    if (!tags.length || !cards.length) return;

    tags.forEach(tag => {
      tag.addEventListener('click', () => {
        const filter = tag.getAttribute('data-filter');
        tags.forEach(t => t.classList.remove('active'));
        tag.classList.add('active');
        cards.forEach(card => {
          const category = card.getAttribute('data-category');
          const show = filter === 'all' || category === filter;
          card.style.display = show ? '' : 'none';
        });
      });
    });
  }

  function init() {
    initLazyLoad();
    initSmoothAnchors();
    initSolutionTabs();
    initProjectFilter();
  }

  return { init, debounce, throttle };
})();

document.addEventListener('DOMContentLoaded', Stackly.init);
