/**
 * Stackly — Custom Select
 * Replaces native <select> rendering with an in-page dropdown so the
 * options list can never overflow the viewport (native popups can).
 */

const StacklyCustomSelect = (() => {
  function enhance(select) {
    if (select.dataset.enhanced) return;
    select.dataset.enhanced = 'true';

    const wrapper = document.createElement('div');
    wrapper.className = 'custom-select';
    if (select.hasAttribute('style')) {
      wrapper.setAttribute('style', select.getAttribute('style'));
      select.removeAttribute('style');
    }

    select.parentNode.insertBefore(wrapper, select);
    select.classList.add('custom-select__native');
    wrapper.appendChild(select);

    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'custom-select__trigger';
    trigger.innerHTML = '<span></span><i class="fas fa-chevron-down"></i>';
    wrapper.appendChild(trigger);

    const panel = document.createElement('div');
    panel.className = 'custom-select__panel';
    wrapper.appendChild(panel);

    const label = trigger.querySelector('span');

    function buildOptions() {
      panel.innerHTML = '';
      Array.from(select.options).forEach((option, i) => {
        const item = document.createElement('div');
        item.className = 'custom-select__option' + (option.selected ? ' selected' : '');
        item.textContent = option.textContent;
        item.setAttribute('role', 'option');
        item.addEventListener('click', () => {
          select.selectedIndex = i;
          select.dispatchEvent(new Event('change', { bubbles: true }));
          select.dispatchEvent(new Event('input', { bubbles: true }));
          select.dispatchEvent(new Event('blur', { bubbles: true }));
          close();
        });
        panel.appendChild(item);
      });
    }

    function syncLabel() {
      const selected = select.options[select.selectedIndex];
      label.textContent = selected ? selected.textContent : '';
      panel.querySelectorAll('.custom-select__option').forEach((el, i) => {
        el.classList.toggle('selected', i === select.selectedIndex);
      });
      wrapper.classList.toggle('error', select.classList.contains('error'));
    }

    function open() {
      document.querySelectorAll('.custom-select.open').forEach(el => {
        if (el !== wrapper) el.classList.remove('open');
      });
      wrapper.classList.add('open');
    }

    function close() {
      wrapper.classList.remove('open');
    }

    trigger.addEventListener('click', () => {
      wrapper.classList.contains('open') ? close() : open();
    });

    document.addEventListener('click', (e) => {
      if (!wrapper.contains(e.target)) close();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close();
    });

    const observer = new MutationObserver(() => syncLabel());
    observer.observe(select, { attributes: true, attributeFilter: ['class'] });

    buildOptions();
    syncLabel();
  }

  function init() {
    document.querySelectorAll('select.form-select').forEach(enhance);
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', StacklyCustomSelect.init);
