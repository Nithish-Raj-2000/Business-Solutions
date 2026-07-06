/**
 * Stackly — Authentication Flow
 */

const StacklyAuth = (() => {
  let selectedRole = 'customer';
  const patterns = {
    email: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
    name: /^[A-Za-z][A-Za-z\s'.-]{1,49}$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,64}$/
  };

  function setFieldError(field, message = '') {
    if (!field) return false;
    const errorEl = field.closest('.form-group')?.querySelector('.form-error');
    field.classList.toggle('error', !!message);
    field.classList.toggle('success', !message && field.value.trim() !== '');
    if (errorEl) errorEl.textContent = message;
    return !message;
  }

  function validateEmail(field) {
    const value = field?.value.trim() || '';
    if (!value) return setFieldError(field, 'Email is required');
    if (!patterns.email.test(value)) return setFieldError(field, 'Enter a valid business email');
    return setFieldError(field);
  }

  function validatePassword(field) {
    const value = field?.value || '';
    if (!value) return setFieldError(field, 'Password is required');
    if (!patterns.password.test(value)) {
      return setFieldError(field, 'Use 8+ chars with uppercase, lowercase, number, and symbol');
    }
    return setFieldError(field);
  }

  function initRoleSelector() {
    document.querySelectorAll('.role-option').forEach(option => {
      option.addEventListener('click', () => {
        document.querySelectorAll('.role-option').forEach(o => o.classList.remove('active'));
        option.classList.add('active');
        selectedRole = option.getAttribute('data-role');
      });
    });

    const defaultRole = document.querySelector('.role-option[data-role="customer"]');
    defaultRole?.classList.add('active');
  }

  function initLogin() {
    const form = document.getElementById('loginForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = form.querySelector('[name="email"]');
      const password = form.querySelector('[name="password"]');

      const valid = validateEmail(email) && validatePassword(password);
      if (!valid) return;

      const user = {
        email: email.value,
        role: selectedRole,
        name: email.value.split('@')[0],
        loginTime: new Date().toISOString()
      };

      localStorage.setItem('stackly_user', JSON.stringify(user));
      sessionStorage.setItem('stackly_session', 'active');

      window.location.href = selectedRole === 'admin'
        ? 'admin-dashboard.html'
        : 'customer-dashboard.html';
    });
  }

  function initSignup() {
    const form = document.getElementById('signupForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.querySelector('[name="name"]');
      const email = form.querySelector('[name="email"]');
      const password = form.querySelector('[name="password"]');
      const confirm = form.querySelector('[name="confirmPassword"]');
      const terms = form.querySelector('[name="terms"]');

      const nameValid = patterns.name.test(name?.value.trim() || '')
        ? setFieldError(name)
        : setFieldError(name, 'Use 2-50 letters only');
      const emailValid = validateEmail(email);
      const passwordValid = validatePassword(password);
      const confirmValid = confirm?.value === password?.value
        ? setFieldError(confirm)
        : setFieldError(confirm, 'Passwords do not match');
      const termsValid = terms?.checked || false;
      const termsError = form.querySelector('[data-terms-error]');
      if (termsError) termsError.textContent = termsValid ? '' : 'You must accept the terms';
      if (!(nameValid && emailValid && passwordValid && confirmValid && termsValid)) return;

      window.location.href = 'login.html';
    });
  }

  function validateOtp(field) {
    const value = field?.value.trim() || '';
    if (!value) return setFieldError(field, 'Verification code is required');
    if (!/^[0-9]{6}$/.test(value)) return setFieldError(field, 'Enter a valid 6-digit code');
    return setFieldError(field);
  }

  function initForgotPassword() {
    const emailForm = document.getElementById('forgotEmailForm');
    const otpForm = document.getElementById('forgotOtpForm');
    const resetForm = document.getElementById('resetPasswordForm');
    const successEl = document.getElementById('forgotSuccess');

    if (emailForm) {
      emailForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = emailForm.querySelector('[name="email"]');
        if (!validateEmail(email)) return;
        emailForm.style.display = 'none';
        otpForm.style.display = 'block';
      });
    }

    if (otpForm) {
      otpForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const otp = otpForm.querySelector('[name="otp"]');
        if (!validateOtp(otp)) return;
        otpForm.style.display = 'none';
        resetForm.style.display = 'block';
      });
    }

    if (resetForm) {
      resetForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const password = resetForm.querySelector('[name="newPassword"]');
        const confirm = resetForm.querySelector('[name="confirmPassword"]');
        const passwordValid = validatePassword(password);
        const confirmValid = confirm?.value === password?.value
          ? setFieldError(confirm)
          : setFieldError(confirm, 'Passwords do not match');
        if (!passwordValid || !confirmValid) return;
        resetForm.style.display = 'none';
        if (successEl) successEl.style.display = 'block';
      });
    }
  }

  function protectDashboard() {
    const isAdminDash = window.location.pathname.includes('admin-dashboard');
    const isCustomerDash = window.location.pathname.includes('customer-dashboard');
    if (!isAdminDash && !isCustomerDash) return;

    const session = sessionStorage.getItem('stackly_session');
    const user = JSON.parse(localStorage.getItem('stackly_user') || 'null');

    if (!session || !user) {
      window.location.href = 'login.html';
      return;
    }

    if (isAdminDash && user.role !== 'admin') {
      window.location.href = 'customer-dashboard.html';
    }
    if (isCustomerDash && user.role !== 'customer') {
      window.location.href = 'admin-dashboard.html';
    }

    const email = user.email || '';
    const nameEl = document.querySelector('[data-user-name]');
    const emailEl = document.querySelector('[data-user-email]');
    const avatarEl = document.querySelector('[data-user-avatar]');

    if (nameEl) nameEl.textContent = user.name || email || 'User';
    if (emailEl) emailEl.textContent = email || 'user@stackly.com';
    if (avatarEl) avatarEl.textContent = (email.trim()[0] || 'U').toUpperCase();
  }

  function initLogout() {
    document.querySelectorAll('[data-logout]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('stackly_user');
        sessionStorage.removeItem('stackly_session');
        window.location.href = 'login.html';
      });
    });
  }

  function init() {
    initRoleSelector();
    initLogin();
    initSignup();
    initForgotPassword();
    protectDashboard();
    initLogout();
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', StacklyAuth.init);
