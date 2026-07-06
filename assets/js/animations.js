/**
 * Stackly — Animations, Counters, Scroll Reveal
 */

const StacklyAnimations = (() => {
  function initPreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    const hidePreloader = () => preloader.classList.add('hidden');

    if (document.readyState === 'complete') {
      hidePreloader();
    } else {
      window.addEventListener('load', hidePreloader, { once: true });
    }

    setTimeout(hidePreloader, 500);
  }

  function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    if (!reveals.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    reveals.forEach(el => observer.observe(el));
  }

  function initCounters() {
    const counters = document.querySelectorAll('[data-counter]');
    if (!counters.length) return;

    const animateCounter = (el) => {
      const target = parseInt(el.getAttribute('data-counter'), 10);
      const suffix = el.getAttribute('data-suffix') || '';
      const prefix = el.getAttribute('data-prefix') || '';
      const duration = 2000;
      const start = performance.now();

      function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * target);
        el.textContent = prefix + current.toLocaleString() + suffix;
        if (progress < 1) requestAnimationFrame(update);
      }

      requestAnimationFrame(update);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
  }

  function initProgressBars() {
    const bars = document.querySelectorAll('.progress-bar__fill[data-progress]');
    if (!bars.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const progress = entry.target.getAttribute('data-progress');
          entry.target.style.width = progress + '%';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    bars.forEach(bar => observer.observe(bar));
  }

  function initAccordion() {
    document.querySelectorAll('.accordion-header').forEach(header => {
      header.addEventListener('click', () => {
        const item = header.closest('.accordion-item');
        const body = item.querySelector('.accordion-body');
        const isActive = item.classList.contains('active');

        item.closest('.accordion')?.querySelectorAll('.accordion-item').forEach(i => {
          i.classList.remove('active');
          i.querySelector('.accordion-body').style.maxHeight = null;
        });

        if (!isActive) {
          item.classList.add('active');
          body.style.maxHeight = body.scrollHeight + 'px';
        }
      });
    });
  }

  function initTabs() {
    document.querySelectorAll('.tabs').forEach(tabGroup => {
      const buttons = tabGroup.querySelectorAll('.tabs__btn');
      const panels = tabGroup.querySelectorAll('.tabs__panel');

      buttons.forEach((btn, index) => {
        btn.addEventListener('click', () => {
          buttons.forEach(b => b.classList.remove('active'));
          panels.forEach(p => p.classList.remove('active'));
          btn.classList.add('active');
          panels[index]?.classList.add('active');
        });
      });
    });
  }

  function initCarousel() {
    document.querySelectorAll('.carousel').forEach(carousel => {
      const track = carousel.querySelector('.carousel__track');
      const slides = carousel.querySelectorAll('.carousel__slide');
      const prevBtn = carousel.querySelector('.carousel__btn--prev');
      const nextBtn = carousel.querySelector('.carousel__btn--next');
      const dots = carousel.querySelectorAll('.carousel__dot');
      let current = 0;
      const total = slides.length;
      if (!total) return;

      function goTo(index) {
        current = (index + total) % total;
        track.style.transform = `translateX(-${current * 100}%)`;
        dots.forEach((dot, i) => dot.classList.toggle('active', i === current));
      }

      prevBtn?.addEventListener('click', () => goTo(current - 1));
      nextBtn?.addEventListener('click', () => goTo(current + 1));
      dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

      let autoplay = setInterval(() => goTo(current + 1), 5000);
      carousel.addEventListener('mouseenter', () => clearInterval(autoplay));
      carousel.addEventListener('mouseleave', () => {
        autoplay = setInterval(() => goTo(current + 1), 5000);
      });
    });
  }

  function initRipple() {
    document.querySelectorAll('.btn--primary, .btn--secondary').forEach(btn => {
      btn.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        ripple.classList.add('btn-ripple');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
        ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
      });
    });
  }

  function initMagneticButtons() {
    document.querySelectorAll('.btn-magnetic').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  function initCardTilt() {
    document.querySelectorAll('.card-tilt').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  function initVideoPopup() {
    document.querySelectorAll('[data-video]').forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = '404.html';
      });
    });
  }

  function initBeforeAfter() {
    document.querySelectorAll('.before-after').forEach(slider => {
      const after = slider.querySelector('.before-after__after');
      const handle = slider.querySelector('.before-after__handle');
      let dragging = false;

      function update(x) {
        const rect = slider.getBoundingClientRect();
        let percent = ((x - rect.left) / rect.width) * 100;
        percent = Math.max(0, Math.min(100, percent));
        after.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
        handle.style.left = percent + '%';
      }

      slider.addEventListener('mousedown', () => dragging = true);
      document.addEventListener('mouseup', () => dragging = false);
      slider.addEventListener('mousemove', (e) => { if (dragging) update(e.clientX); });
      slider.addEventListener('touchmove', (e) => update(e.touches[0].clientX), { passive: true });
    });
  }

  function initPricingToggle() {
    const toggle = document.querySelector('.pricing-toggle__switch');
    if (!toggle) return;

    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      const isYearly = toggle.classList.contains('active');
      document.querySelectorAll('[data-monthly]').forEach(el => {
        el.textContent = isYearly ? el.getAttribute('data-yearly') : el.getAttribute('data-monthly');
      });
    });
  }

  function initButtonFallbackNavigation() {
    if (window.location.pathname.endsWith('404.html')) return;

    const allowedControls = [
      '.accordion-header',
      '.carousel__btn',
      '.carousel__dot',
      '.menu-toggle',
      '.pricing-toggle__switch',
      '.play-btn',
      '.tag-cloud__item',
      '.tabs__btn',
      '.video-popup__close',
      '#backToTop',
      '#sidebarToggle',
      '#sidebarClose',
      '.custom-select__trigger',
      '[data-video]',
      '[data-allow-action="true"]'
    ].join(',');

    document.addEventListener('click', (e) => {
      const target = e.target.closest('.btn, button');
      if (!target || target.matches(allowedControls) || target.closest('form')) return;

      const href = target.getAttribute('href');
      if (href && (href.startsWith('mailto:') || href.startsWith('tel:'))) return;
      if (href === 'login.html' || href === 'signup.html') return;

      e.preventDefault();
      e.stopImmediatePropagation();
      window.location.href = '404.html';
    });
  }

  function init() {
    initPreloader();
    initScrollReveal();
    initCounters();
    initProgressBars();
    initAccordion();
    initTabs();
    initCarousel();
    initRipple();
    initMagneticButtons();
    initCardTilt();
    initVideoPopup();
    initBeforeAfter();
    initPricingToggle();
    initButtonFallbackNavigation();
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(StacklyAnimations.init, 100);
});
