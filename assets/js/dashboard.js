/**
 * Stackly — Dashboard Functionality
 */

const StacklyDashboard = (() => {
  function initSidebar() {
    const toggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('dashboardSidebar');
    if (!toggle || !sidebar) return;

    toggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
  }

  function initPanelSwitching() {
    const links = document.querySelectorAll('[data-panel]');
    const panels = document.querySelectorAll('.dashboard-panel');

    function activatePanel(panelId, pushState = true) {
      links.forEach(l => l.classList.toggle('active', l.getAttribute('data-panel') === panelId));
      panels.forEach(p => p.classList.toggle('active', p.id === panelId));
      const link = Array.from(links).find(l => l.getAttribute('data-panel') === panelId);
      const title = link ? link.textContent.trim() : '';
      const titleEl = document.querySelector('.dashboard-content__title');
      if (titleEl && title) titleEl.textContent = title;

      if (pushState && window.history && window.history.pushState) {
        try {
          window.history.pushState({ panel: panelId }, '', '#' + panelId);
        } catch (err) {
          // ignore pushState errors
        }
      }
    }

    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const panelId = link.getAttribute('data-panel');
        activatePanel(panelId, true);
      });
    });

    // Handle browser back/forward to restore panels
    window.addEventListener('popstate', (e) => {
      const statePanel = e.state && e.state.panel;
      const hashPanel = location.hash ? location.hash.replace('#', '') : null;
      const panelToShow = statePanel || hashPanel || null;
      if (panelToShow) {
        activatePanel(panelToShow, false);
      }
    });

    // If URL has a hash on load, activate that panel without pushing state
    const initialHash = location.hash ? location.hash.replace('#', '') : null;
    if (initialHash) activatePanel(initialHash, false);
  }

  function initChartBars() {
    document.querySelectorAll('.chart-bar').forEach((bar, i) => {
      const height = bar.getAttribute('data-height') || (30 + Math.random() * 70);
      bar.style.height = height + '%';
      bar.style.transitionDelay = (i * 0.05) + 's';
    });
  }

  function initAccountSettings() {
    const settingsForm = document.querySelector('#panel-settings form') || document.querySelector('#panel-settings form[novalidate]') || document.querySelector('#panel-settings form[method]') || document.querySelector('#panel-settings form');
    if (!settingsForm) return;

    const nameField = settingsForm.querySelector('#custName') || settingsForm.querySelector('[name="custName"]') || settingsForm.querySelector('[id="custName"]');
    const emailField = settingsForm.querySelector('#custEmail') || settingsForm.querySelector('[name="custEmail"]') || settingsForm.querySelector('[id="custEmail"]');
    const companyField = settingsForm.querySelector('#custCompany');
    const phoneField = settingsForm.querySelector('#custPhone');
    const saveBtn = settingsForm.querySelector('button[type="submit"]') || settingsForm.querySelector('button');

    function showSaveState(ok) {
      if (!saveBtn) return;
      const prevText = saveBtn.textContent;
      saveBtn.textContent = ok ? 'Saved' : 'Error';
      saveBtn.disabled = true;
      setTimeout(() => {
        saveBtn.textContent = prevText;
        saveBtn.disabled = false;
      }, 1500);
    }

    settingsForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameVal = (nameField && nameField.value || '').trim();
      const emailVal = (emailField && emailField.value || '').trim();
      const companyVal = (companyField && companyField.value || '').trim();
      const phoneVal = (phoneField && phoneField.value || '').trim();

      if (!nameVal) {
        if (nameField) nameField.focus();
        showSaveState(false);
        return;
      }
      if (!emailVal || !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(emailVal)) {
        if (emailField) emailField.focus();
        showSaveState(false);
        return;
      }

      try {
        const existing = JSON.parse(localStorage.getItem('stackly_user') || 'null') || {};
        const updated = Object.assign({}, existing, {
          name: nameVal,
          email: emailVal,
          company: companyVal || existing.company || '',
          phone: phoneVal || existing.phone || ''
        });
        localStorage.setItem('stackly_user', JSON.stringify(updated));
        // update visible UI elements
        const nameEls = document.querySelectorAll('[data-user-name]');
        const emailEls = document.querySelectorAll('[data-user-email]');
        const avatarEls = document.querySelectorAll('[data-user-avatar]');
        nameEls.forEach(el => el.textContent = updated.name || updated.email || 'User');
        emailEls.forEach(el => el.textContent = updated.email || 'user@stackly.com');
        avatarEls.forEach(el => el.textContent = (updated.email || updated.name || 'U').trim()[0]?.toUpperCase() || 'U');

        showSaveState(true);
      } catch (err) {
        showSaveState(false);
      }
    });
  }

  function init() {
    initSidebar();
    initPanelSwitching();
    initChartBars();
    initAccountSettings();
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', StacklyDashboard.init);

// Redirect Pay Now / Download clicks on dashboard pages to 404 (robust handler)
document.addEventListener('click', function (e) {
  let target = e.target;
  if (target && target.nodeType === Node.TEXT_NODE) target = target.parentElement;
  const el = target && target.closest ? target.closest('a,button') : null;
  if (!el) return;

  // Ignore sidebar dashboard navigation links (they use data-panel and should not redirect)
  if (el.hasAttribute && el.hasAttribute('data-panel')) return;
  if (el.closest && el.closest('#dashboardSidebar')) return;

  const text = (el.textContent || '').trim();
  const hasDownloadIcon = el.querySelector && el.querySelector('.fa-download');

  if (/^pay\s*now$/i.test(text) || /download/i.test(text) || hasDownloadIcon) {
    e.preventDefault();
    // store source so 404 can reliably return if needed
    try { sessionStorage.setItem('redirectSource', window.location.href); } catch (err) {}
    window.location.href = '404.html';
  }
});
