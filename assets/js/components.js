/**
 * Stackly Business Solutions — Shared Components
 * Injects header, topbar, footer across all pages
 */

const StacklyComponents = (() => {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  const navItems = [
    { href: 'index.html', label: 'Home' },
    { href: 'about.html', label: 'About' },
    { href: 'services.html', label: 'Services' },
    { href: 'solutions.html', label: 'Solutions' },
    { href: 'team.html', label: 'Team' },
    { href: 'blog.html', label: 'Blog' },
    { href: 'contact.html', label: 'Contact' }
  ];

  const isActive = (href) => {
    if (href === 'index.html' && (currentPage === '' || currentPage === 'index.html')) return 'active';
    return currentPage === href ? 'active' : '';
  };

  const isDashboard = currentPage.includes('dashboard');
  const isAuth = ['login.html', 'signup.html', 'forgot-password.html', 'reset-password.html'].includes(currentPage);
  const is404 = currentPage === '404.html';

  function renderTopbar() {
    return '';
  }

  function renderNavItem(item) {
    const active = isActive(item.href);
    return `
      <li class="nav__item">
        <a href="${item.href}" class="nav__link ${active}">${item.label}</a>
      </li>`;
  }

  function renderHeader() {
    if (isDashboard || isAuth || is404) return '';
    const transparent = currentPage === '' || currentPage === 'index.html' ? 'header--transparent' : 'header--solid';
    const navLinks = navItems.map(renderNavItem).join('');
    const mobileLinks = navItems.map(item => {
      return `<a href="${item.href}" class="mobile-nav__link ${isActive(item.href)}">${item.label}</a>`;
    }).join('');

    return `
      <header class="header ${transparent}" id="header" role="navigation" aria-label="Main navigation">
        <div class="container header__inner">
          <a href="index.html" class="logo" aria-label="Stackly Business Solutions Home">
            <span class="logo__mark" role="img" aria-label="Stackly"></span>
            <span class="logo__tagline">Business Solutions</span>
          </a>
          <nav class="nav" aria-label="Primary">
            <ul class="nav__list">${navLinks}</ul>
          </nav>
          <div class="header__actions">
            <a href="login.html" class="btn btn--outline btn--sm">Login</a>
            <button class="menu-toggle" id="menuToggle" aria-label="Toggle menu" aria-expanded="false">
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>
      </header>
      <div class="mobile-drawer__overlay" id="drawerOverlay"></div>
      <aside class="mobile-drawer" id="mobileDrawer" aria-label="Mobile navigation">
        <nav class="mobile-nav">${mobileLinks}</nav>
        <div style="margin-top: 2rem; display: flex; flex-direction: column; gap: 0.75rem;">
          <a href="login.html" class="btn btn--outline" style="color: var(--color-primary); border-color: var(--color-primary);">Login</a>
        </div>
      </aside>`;
  }

  function renderFooter() {
    if (isDashboard || isAuth || is404) return '';
    return `
      <footer class="footer" role="contentinfo">
        <div class="footer__decor footer__decor--1"></div>
        <div class="footer__decor footer__decor--2"></div>
        <div class="footer__top">
          <div class="container">
            <div class="footer__grid">
              <div class="footer__brand">
                <a href="index.html" class="logo">
                  <span class="logo__mark" role="img" aria-label="Stackly"></span>
                  <span class="logo__tagline">Business Solutions</span>
                </a>
                <p class="footer__desc">Empowering Businesses Through Smart Digital Innovation. We deliver cutting-edge technology solutions that drive growth, efficiency, and competitive advantage.</p>
                <div class="footer__social">
                  <a href="404.html" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
                  <a href="404.html" aria-label="Twitter"><i class="fab fa-x-twitter"></i></a>
                  <a href="404.html" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a>
                  <a href="404.html" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
                  <a href="404.html" aria-label="YouTube"><i class="fab fa-youtube"></i></a>
                </div>
              </div>
              <div>
                <h4 class="footer__title">Quick Links</h4>
                <ul class="footer__links">
                  <li><a href="index.html">Home</a></li>
                  <li><a href="about.html">About Us</a></li>
                  <li><a href="solutions.html">Solutions</a></li>
                  <li><a href="blog.html">Blog</a></li>
                  <li><a href="team.html">Team</a></li>
                  <li><a href="contact.html">Contact</a></li>
                </ul>
              </div>
              <div>
                <h4 class="footer__title">Services</h4>
                <ul class="footer__links">
                  <li><a href="404.html">IT Consulting</a></li>
                  <li><a href="404.html">Cloud Solutions</a></li>
                  <li><a href="404.html">Cyber Security</a></li>
                  <li><a href="404.html">Digital Transformation</a></li>
                  <li><a href="404.html">Data Analytics</a></li>
                  <li><a href="404.html">Software Development</a></li>
                </ul>
              </div>
              <div>
                <h4 class="footer__title">Contact Us</h4>
                <div class="footer__contact-item">
                  <i class="fas fa-location-dot"></i>
                  <span>27 Innovation Drive, Tech City, TC 10001</span>
                </div>
                <div class="footer__contact-item">
                  <i class="fas fa-phone"></i>
                  <a href="404.html">+1 (800) 555-1234</a>
                </div>
                <div class="footer__contact-item">
                  <i class="fas fa-envelope"></i>
                  <a href="404.html">hello@stackly.com</a>
                </div>
                <div class="footer__newsletter">
                  <h4 class="footer__title" style="margin-top: 1.5rem;">Newsletter</h4>
                  <form class="footer__newsletter-form" id="footerNewsletter" data-validate-form data-handler="newsletter" novalidate>
                    <input type="email" placeholder="Your email" aria-label="Email for newsletter" data-validate="required|email" required>
                    <button type="submit" aria-label="Subscribe"><i class="fas fa-paper-plane"></i></button>
                    <span class="form-error" aria-live="polite"></span>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="footer__bottom">
          <div class="container footer__bottom-inner">
            <p>&copy; ${new Date().getFullYear()} Stackly Business Solutions. All Rights Reserved.</p>
            <div class="footer__legal">
              <a href="404.html">Privacy</a>
              <a href="404.html">Terms</a>
            </div>
          </div>
        </div>
      </footer>`;
  }

  function renderPreloader() {
    if (isDashboard) return '';
    return `
      <div class="preloader" id="preloader" aria-hidden="true">
        <div class="preloader__logo">Stackly</div>
        <div class="preloader__bar"><div class="preloader__bar-fill"></div></div>
      </div>`;
  }

  function renderBackToTop() {
    if (isDashboard || isAuth) return '';
    return `<button class="back-to-top" id="backToTop" aria-label="Back to top"><i class="fas fa-arrow-up"></i></button>`;
  }

  function init() {
    const topbarEl = document.getElementById('topbar');
    const headerEl = document.getElementById('header-placeholder');
    const footerEl = document.getElementById('footer-placeholder');
    const preloaderEl = document.getElementById('preloader-placeholder');
    const backToTopEl = document.getElementById('back-to-top-placeholder');

    if (topbarEl) topbarEl.innerHTML = renderTopbar();
    if (headerEl) headerEl.innerHTML = renderHeader();
    if (footerEl) footerEl.innerHTML = renderFooter();
    if (preloaderEl) preloaderEl.innerHTML = renderPreloader();
    if (backToTopEl) backToTopEl.innerHTML = renderBackToTop();
    injectLogoTintFilter();
  }

  function injectLogoTintFilter() {
    if (document.getElementById('logoTintDefs')) return;
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('id', 'logoTintDefs');
    svg.setAttribute('width', '0');
    svg.setAttribute('height', '0');
    svg.style.position = 'absolute';
    svg.innerHTML = `
      <filter id="logoTintPrimary" color-interpolation-filters="sRGB">
        <feFlood flood-color="#1a237e" result="flood"/>
        <feComposite in="flood" in2="SourceAlpha" operator="in"/>
      </filter>`;
    document.body.appendChild(svg);
  }

  return { init, isDashboard, isAuth };
})();

document.addEventListener('DOMContentLoaded', StacklyComponents.init);

// Redirect Pay Now / Download clicks (robust handler)
document.addEventListener('click', function (e) {
  let target = e.target;
  if (target && target.nodeType === Node.TEXT_NODE) target = target.parentElement;
  const el = target && target.closest ? target.closest('a,button') : null;
  if (!el) return;

  const text = (el.textContent || '').trim();
  const hasDownloadIcon = el.querySelector && el.querySelector('.fa-download');
  const ctaRedirectPattern = /\b(pay\s*now|learn\s*more|view\s*more|view\s*all|explore|view|read\s*more|read\s*article)\b/i;

  if (ctaRedirectPattern.test(text) || /download/i.test(text) || hasDownloadIcon) {
    e.preventDefault();
    window.location.href = '404.html';
  }
});
