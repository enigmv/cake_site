document.addEventListener('DOMContentLoaded', () => {
  // Универсальная функция показа ошибки
  function showError(errorMsgEl, text, elToFocus, inputsToHighlight = []) {
    if (!errorMsgEl) return;
    errorMsgEl.textContent = text;
    errorMsgEl.style.display = 'block';
    if (elToFocus) {
      elToFocus.classList.add('invalid');
      elToFocus.focus();
    }
    inputsToHighlight.forEach(i => i?.classList.add('invalid'));
  }

  // Универсальная функция очистки ошибки
  function clearError(errorMsgEl, inputs = []) {
    if (!errorMsgEl) return;
    errorMsgEl.textContent = '';
    errorMsgEl.style.display = 'none';
    inputs.forEach(i => i?.classList.remove('invalid'));
  }

  // Переключение видимости пароля
  window.togglePassword = (fieldId) => {
    const input = document.getElementById(fieldId);
    if (!input) return;
    input.type = input.type === 'password' ? 'text' : 'password';
  };

  // Функция для валидации email
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // ОБРАБОТКА ЛОГИНА
  const loginForm = document.getElementById('login-form');
  const loginErrorMsg = document.getElementById('error-msg');
  if (loginForm) {
    const emailInput = loginForm.querySelector('#email');
    const passwordInput = loginForm.querySelector('#password');

    loginForm.addEventListener('submit', e => {
      e.preventDefault();

      const email = emailInput?.value.trim() || '';
      const password = passwordInput?.value.trim() || '';

      if (!email || !password) {
        showError(loginErrorMsg, 'Пожалуйста, заполните все поля.', !email ? emailInput : passwordInput, [emailInput, passwordInput]);
        return;
      }
      if (!emailPattern.test(email)) {
        showError(loginErrorMsg, 'Введите корректный адрес электронной почты.', emailInput);
        return;
      }

      clearError(loginErrorMsg, [emailInput, passwordInput]);

      // Тут можно добавить отправку на сервер
      alert(`Добро пожаловать, ${email}!`);
    });

    [emailInput, passwordInput].forEach(input => {
      input?.addEventListener('input', () => clearError(loginErrorMsg, [emailInput, passwordInput]));
    });
  }

  // ОБРАБОТКА РЕГИСТРАЦИИ
  const registerForm = document.getElementById('register-form');
  const registerErrorMsg = document.getElementById('error-msg');
  if (registerForm) {
    const fullnameInput = registerForm.querySelector('input[name="fullname"]');
    const emailInput = registerForm.querySelector('input[name="email"]');
    const passwordInput = registerForm.querySelector('input[name="password"]');
    const confirmPasswordInput = registerForm.querySelector('input[name="confirm-password"]');

    registerForm.addEventListener('submit', e => {
      e.preventDefault();

      const fullname = fullnameInput?.value.trim() || '';
      const email = emailInput?.value.trim() || '';
      const password = passwordInput?.value.trim() || '';
      const confirmPassword = confirmPasswordInput?.value.trim() || '';

      const inputs = [fullnameInput, emailInput, passwordInput, confirmPasswordInput];
      const emptyInputs = inputs.filter(i => !i?.value.trim());

      clearError(registerErrorMsg, inputs);

      if (emptyInputs.length) {
        showError(registerErrorMsg, 'Пожалуйста, заполните все поля.', emptyInputs[0], emptyInputs);
        return;
      }

      if (!emailPattern.test(email)) {
        showError(registerErrorMsg, 'Введите корректный адрес электронной почты.', emailInput);
        return;
      }

      if (password.length < 6) {
        showError(registerErrorMsg, 'Пароль должен быть минимум 6 символов.', passwordInput);
        return;
      }

      if (password !== confirmPassword) {
        showError(registerErrorMsg, 'Пароли не совпадают.', confirmPasswordInput);
        return;
      }

      alert(`Регистрация успешна!\nДобро пожаловать, ${fullname}!`);
      registerForm.reset();
    });

    [fullnameInput, emailInput, passwordInput, confirmPasswordInput].forEach(input => {
      input?.addEventListener('input', () => clearError(registerErrorMsg, [fullnameInput, emailInput, passwordInput, confirmPasswordInput]));
    });
  }
});
