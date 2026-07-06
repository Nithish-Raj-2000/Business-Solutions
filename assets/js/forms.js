/**
 * Stackly — Form Validation
 */

const StacklyForms = (() => {
  const validators = {
    required: (value, _param, field) => {
      if (field?.type === 'checkbox') return field.checked || 'This field is required';
      return value.trim() !== '' || 'This field is required';
    },
    email: (value) => /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(value.trim()) || 'Please enter a valid email',
    phone: (value) => value.trim() === '' || /^[0-9]{10}$/.test(value.trim()) || 'Phone number must be exactly 10 digits',
    name: (value) => /^[A-Za-z][A-Za-z\s'.-]{1,49}$/.test(value.trim()) || 'Use 2-50 letters only',
    company: (value) => /^[A-Za-z0-9][A-Za-z0-9\s&.,'-]{1,79}$/.test(value.trim()) || 'Use 2-80 valid company characters',
    subject: (value) => /^[A-Za-z0-9][A-Za-z0-9\s.,!?&()'":;-]{4,99}$/.test(value.trim()) || 'Use 5-100 valid characters',
    message: (value) => /^[A-Za-z0-9\s.,!?&()'":;@%+\-/#\r\n]{20,1000}$/.test(value.trim()) || 'Use 20-1000 valid characters',
    text: (value) => /^[A-Za-z0-9][A-Za-z0-9\s'.,-]{1,199}$/.test(value.trim()) || 'Use valid characters only',
    code: (value) => /^[0-9]{6}$/.test(value.trim()) || 'Enter a valid 6-digit code',
    minLength: (value, min) => value.trim().length >= min || `Minimum ${min} characters required`,
    maxLength: (value, max) => value.trim().length <= max || `Maximum ${max} characters allowed`,
    password: (value) => {
      // Requires 8-64 characters, at least one uppercase, one lowercase, one number, and one symbol
      return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,64}$/.test(value) || 'Use 8-64 chars with uppercase, lowercase, number, and symbol';
    },
    confirmPassword: (value, form) => {
      const password = form.querySelector('[name="password"]')?.value ||
                       form.querySelector('[name="newPassword"]')?.value;
      return value === password || 'Passwords do not match';
    }
  };

  function validateField(field, form) {
    const rules = (field.getAttribute('data-validate') || '').split('|');
    const value = field.value;
    let error = '';

    for (const rule of rules) {
      if (!rule) continue;
      const [name, param] = rule.split(':');
      let result;
      if (name === 'confirmPassword') {
        result = validators.confirmPassword(value, form);
      } else if (name === 'minLength' || name === 'maxLength') {
        result = validators[name](value, parseInt(param, 10));
      } else if (validators[name]) {
        result = validators[name](value, param, field);
      }
      if (result !== true) {
        error = result;
        break;
      }
    }

    const errorEl = field.parentElement.querySelector('.form-error') ||
                    field.closest('.form-group')?.querySelector('.form-error');

    field.classList.toggle('error', !!error);
    field.classList.toggle('success', !error && value.trim() !== '');

    if (errorEl) errorEl.textContent = error;
    return !error;
  }

  function initPasswordStrength(input) {
    const bar = input.parentElement.querySelector('.password-strength__bar');
    if (!bar) return;

    input.addEventListener('input', () => {
      const val = input.value;
      let strength = 0;
      if (val.length >= 8) strength++;
      if (/[A-Z]/.test(val)) strength++;
      if (/[a-z]/.test(val)) strength++;
      if (/[0-9]/.test(val)) strength++;
      if (/[^A-Za-z0-9]/.test(val)) strength++;

      const widths = ['0%', '20%', '40%', '60%', '80%', '100%'];
      const colors = ['#e2e8f0', '#dc2626', '#f59e0b', '#f59e0b', '#10b981', '#10b981'];
      bar.style.width = widths[strength];
      bar.style.background = colors[strength];
    });
  }

  function showToast(message) {
    let toast = document.getElementById('stacklyToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'stacklyToast';
      toast.setAttribute('role', 'status');
      toast.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:10000;display:flex;align-items:center;gap:0.6rem;padding:1rem 1.5rem;background:#10b981;color:#fff;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,0.3);font-weight:500;opacity:0;transform:translateY(12px);transition:opacity 0.3s ease, transform 0.3s ease;pointer-events:none;';
      document.body.appendChild(toast);
    }
    toast.innerHTML = '<i class="fas fa-circle-check"></i>' + message;
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    });
    clearTimeout(toast._hideTimer);
    toast._hideTimer = setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(12px)';
    }, 3500);
  }

  function showSuccess(form, message) {
    let successEl = form.querySelector('.form-success');
    if (!successEl) {
      successEl = document.createElement('div');
      successEl.className = 'form-success';
      successEl.style.cssText = 'padding:1rem;background:rgba(16,185,129,0.1);color:#10b981;border-radius:12px;margin-top:1rem;text-align:center;font-weight:500;';
      form.appendChild(successEl);
    }
    successEl.textContent = message;
    successEl.style.display = 'block';
    setTimeout(() => {
      successEl.style.display = 'none';
      const redirectUrl = form.getAttribute('data-redirect-url');
      if (redirectUrl) window.location.href = redirectUrl;
    }, 3000); // Reduced timeout for quicker redirection
  }

  function initForm(form) {
    const fields = form.querySelectorAll('[data-validate]');

    fields.forEach(field => {
      field.addEventListener('blur', () => validateField(field, form));
      field.addEventListener('input', () => {
        if (field.classList.contains('error')) validateField(field, form);
      });

      if (field.type === 'password' && field.closest('.form-group')?.querySelector('.password-strength')) {
        initPasswordStrength(field);
      }
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;
      fields.forEach(field => {
        if (!validateField(field, form)) valid = false;
      });

      if (!valid) return;

      const handler = form.getAttribute('data-handler');
      if (handler && StacklyForms.handlers[handler]) {
        StacklyForms.handlers[handler](form);
      } else if (handler && typeof StacklyAuth !== 'undefined' && StacklyAuth.handlers && StacklyAuth.handlers[handler]) {
        StacklyAuth.handlers[handler](form);
      } else {
        showSuccess(form, form.getAttribute('data-success') || 'Form submitted successfully!');
        form.reset();
        fields.forEach(f => f.classList.remove('success', 'error'));
      }
    });
  }

  const handlers = {
    contact(form) {
      showSuccess(form, form.getAttribute('data-success') || 'Thank you! Your message has been sent. We\'ll respond within 24 hours.');
      form.reset(); // Reset after success message
    },
    newsletter(form) {
      showToast('Successfully subscribed to our newsletter!');
      form.reset();
      form.querySelectorAll('[data-validate]').forEach(f => f.classList.remove('success', 'error'));
    },
    quote(form) {
      showSuccess(form, 'Quote request received! Our team will contact you shortly.');
      form.reset();
    },
    jobApplication(form) {
      showSuccess(form, 'Application submitted successfully! We\'ll review and get back to you.');
      form.reset();
    }
  };

  function init() {
    const skipIds = ['loginForm', 'signupForm', 'forgotEmailForm', 'forgotOtpForm', 'resetPasswordForm'];
    document.querySelectorAll('form[data-validate-form]').forEach(form => {
      if (!skipIds.includes(form.id)) initForm(form);
    });
    document.querySelectorAll('form:not([data-validate-form])').forEach(form => {
      if (skipIds.includes(form.id)) return;
      if (form.querySelector('[data-validate]')) {
        form.setAttribute('data-validate-form', '');
        initForm(form);
      }
    });

  }

  return { init, handlers, showSuccess, showToast };
})();

document.addEventListener('DOMContentLoaded', StacklyForms.init);
