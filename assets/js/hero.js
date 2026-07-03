/**
 * Stackly — Hero Effects
 */

const StacklyHero = (() => {
  const phrases = [
    'Digital Innovation',
    'Cloud Solutions',
    'Smart Analytics',
    'Business Growth',
    'Cyber Security'
  ];

  function initTyping() {
    const el = document.getElementById('typingText');
    if (!el) return;

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
      const current = phrases[phraseIndex];
      if (isDeleting) {
        el.textContent = current.substring(0, charIndex - 1);
        charIndex--;
      } else {
        el.textContent = current.substring(0, charIndex + 1);
        charIndex++;
      }

      let speed = isDeleting ? 40 : 80;

      if (!isDeleting && charIndex === current.length) {
        speed = 2000;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        speed = 500;
      }

      setTimeout(type, speed);
    }

    type();
  }

  function initParticles() {
    const container = document.getElementById('heroParticles');
    if (!container) return;

    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 8 + 's';
      particle.style.animationDuration = (6 + Math.random() * 6) + 's';
      particle.style.width = particle.style.height = (2 + Math.random() * 4) + 'px';
      container.appendChild(particle);
    }
  }

  function initParallax() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const visual = hero.querySelector('.hero__visual');
    const shapes = hero.querySelectorAll('.hero__float-card');

    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      if (visual) {
        visual.style.transform = `translate(${x * 15}px, ${y * 15}px)`;
      }

      shapes.forEach((shape, i) => {
        const factor = (i + 1) * 8;
        shape.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
      });
    });
  }

  function initMouseTilt() {
    const dashboard = document.querySelector('.hero__dashboard');
    if (!dashboard) return;

    dashboard.addEventListener('mousemove', (e) => {
      const rect = dashboard.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      dashboard.style.transform = `perspective(1000px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg)`;
    });

    dashboard.addEventListener('mouseleave', () => {
      dashboard.style.transform = '';
    });
  }

  function init() {
    initTyping();
    initParticles();
    initParallax();
    initMouseTilt();
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', StacklyHero.init);
