// main-auth.js (VERSIÓN ROBUSTA y COMPATIBLE)
console.log("✅ login.js cargado correctamente desde access/login/js/");
console.log("➡ Redirigiendo a ../../../webSite/dashboard.html");
document.addEventListener('DOMContentLoaded', () => {
  const safeQuery = (selectors) => {
    for (const s of selectors) {
      const el = document.querySelector(s);
      if (el) return el;
    }
    return null;
  };

  // Buscar botones/forms por varias convenciones posibles
  const btnLogin = safeQuery(['#showLogin', '#show-login', '[data-action="show-login"]']);
  const btnRegister = safeQuery(['#showRegister', '#show-register', '[data-action="show-register"]']);
  const loginForm = safeQuery(['#loginForm', '#login-form', 'form.login', 'form[data-form="login"]']);
  const registerForm = safeQuery(['#registerForm', '#register-form', 'form.register', 'form[data-form="register"]']);

  // debug
  console.log('main-auth: btnLogin', !!btnLogin, 'btnRegister', !!btnRegister, 'loginForm', !!loginForm, 'registerForm', !!registerForm);

  // toggle-pass buttons (may be inside forms)
  const togglePassButtons = Array.from(document.querySelectorAll('.toggle-pass'));

  // helper para obtener input por nombre o fallback por type
  function getInput(form, name, typeFallback) {
    if (!form) return null;
    let el = null;
    if (name) el = form.querySelector(`input[name="${name}"]`);
    if (!el && typeFallback) el = form.querySelector(`input[type="${typeFallback}"]`);
    // último recurso: el primer input del form
    if (!el) el = form.querySelector('input');
    return el;
  }

  // Alternar visibilidad de contraseña
  if (togglePassButtons.length) {
    togglePassButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const field = btn.closest('.field') || btn.parentElement;
        if (!field) return;
        const input = field.querySelector('input');
        const icon = btn.querySelector('i');
        if (!input) return;
        if (input.type === 'password') {
          input.type = 'text';
          if (icon) icon.className = 'fa-regular fa-eye-slash';
          btn.setAttribute('aria-pressed', 'true');
        } else {
          input.type = 'password';
          if (icon) icon.className = 'fa-regular fa-eye';
          btn.setAttribute('aria-pressed', 'false');
        }
      });
    });
  }

  // GSAP-safe showForm (no-op si faltan forms)
  function showForm(target) {
    if (!loginForm && !registerForm) return;
    const fromEl = (target === 'login') ? registerForm : loginForm;
    const toEl = (target === 'login') ? loginForm : registerForm;

    if (btnLogin) btnLogin.classList.toggle('active', target === 'login');
    if (btnRegister) btnRegister.classList.toggle('active', target !== 'login');

    // si fromEl no existe o no tiene 'active', mostrar toEl directamente
    if (!fromEl || !fromEl.classList || !fromEl.classList.contains('active')) {
      if (toEl) {
        toEl.classList.add('active');
        if (window.gsap) gsap.fromTo(toEl, { x: 20, opacity: 0 }, { x: 0, opacity: 1, duration: 0.45 });
      }
      return;
    }

    // animación de intercambio (segura)
    if (window.gsap && fromEl && toEl) {
      gsap.to(fromEl, {
        x: -30, opacity: 0, duration: 0.28, ease: 'power2.in',
        onComplete() {
          fromEl.classList.remove('active');
          toEl.classList.add('active');
          gsap.fromTo(toEl, { x: 30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.45, ease: 'elastic.out(1,0.6)' });
        }
      });
    } else {
      // fallback sin GSAP
      if (fromEl) fromEl.classList.remove('active');
      if (toEl) toEl.classList.add('active');
    }
  }

  // Attach listeners for switch buttons (if exist)
  if (btnLogin) btnLogin.addEventListener('click', () => showForm('login'));
  if (btnRegister) btnRegister.addEventListener('click', () => showForm('register'));

  // validate fields helper (visual)
  function validateFields(form) {
    const inputs = Array.from(form.querySelectorAll('input[required]'));
    let ok = true;
    inputs.forEach(i => {
      i.classList.remove('invalid');
      if (!i.value || !i.value.trim()) {
        i.classList.add('invalid');
        ok = false;
      }
    });
    if (!ok && window.gsap) gsap.fromTo(form, { x: -6 }, { x: 0, duration: 0.35, ease: 'elastic.out(1,0.5)' });
    return ok;
  }

  // REGISTRATION: safe handler
  if (registerForm) {
    registerForm.addEventListener('submit', (ev) => {
      ev.preventDefault();

      // intenta recoger los inputs por name; si no existen, busca por type
      const nameInput = getInput(registerForm, 'name', 'text');
      const emailInput = getInput(registerForm, 'email', 'email');
      const passwordInput = getInput(registerForm, 'password', 'password');

      if (!nameInput || !emailInput || !passwordInput) {
        console.error('Registro: no se encontraron inputs en el formulario. nameInput, emailInput, passwordInput:', !!nameInput, !!emailInput, !!passwordInput);
        alert('Formulario incompleto (campos no encontrados). Revisa el HTML.');
        return;
      }

      if (!validateFields(registerForm)) return;

      const name = nameInput.value.trim();
      const email = emailInput.value.trim().toLowerCase();
      const password = passwordInput.value.trim();

      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const exists = users.some(u => u.email === email);

      if (exists) {
        alert('Este correo ya está registrado. Por favor inicia sesión.');
        showForm('login');
        return;
      }

      users.push({ name, email, password });
      localStorage.setItem('users', JSON.stringify(users));
      console.log('Usuario registrado:', { name, email });

      // feedback y reset
      alert('Registro exitoso. Ahora puedes iniciar sesión.');
      registerForm.reset();
      showForm('login');
    });
  } else {
    console.info('No se encontró formulario de registro en la página.');
  }

  // LOGIN: safe handler
  if (loginForm) {
    loginForm.addEventListener('submit', (ev) => {
      ev.preventDefault();

      const emailInput = getInput(loginForm, 'email', 'email');
      const passwordInput = getInput(loginForm, 'password', 'password');

      if (!emailInput || !passwordInput) {
        console.error('Login: inputs no encontrados.', !!emailInput, !!passwordInput);
        alert('Formulario incompleto (campos no encontrados). Revisa el HTML.');
        return;
      }

      if (!validateFields(loginForm)) return;

      const email = emailInput.value.trim().toLowerCase();
      const password = passwordInput.value.trim();
      const users = JSON.parse(localStorage.getItem('users') || '[]');

      const found = users.find(u => u.email === email && u.password === password);
      if (!found) {
        alert('Usuario o contraseña incorrectos.');
        return;
      }

      // login ok
      localStorage.setItem('activeUser', JSON.stringify(found));
      console.log('Login exitoso:', found);
      alert(`Bienvenido ${found.name}!`);
      // redirigir
      window.location.href = window.location.origin + '/webSite/dashboard.html';
    });
  } else {
    console.info('No se encontró formulario de login en la página.');
  }

  // Partículas (opcional): si existe canvas#particles
  const canvas = document.getElementById('particles');
  if (canvas && canvas.getContext) {
    (function setupParticles() {
      const ctx = canvas.getContext('2d');
      let w, h, particles = [];
      const opts = { count: 40, maxSize: 2.6, speed: 0.25 };

      function resize() {
        w = canvas.width = innerWidth;
        h = canvas.height = innerHeight;
        init();
      }
      function init() {
        particles = [];
        for (let i = 0; i < opts.count; i++) {
          particles.push({
            x: Math.random() * w,
            y: Math.random() * h,
            r: Math.random() * opts.maxSize + 0.2,
            vx: (Math.random() - 0.5) * opts.speed,
            vy: (Math.random() - 0.5) * opts.speed,
            alpha: 0.6 + Math.random() * 0.4
          });
        }
      }
      function render() {
        ctx.clearRect(0, 0, w, h);
        particles.forEach(p => {
          ctx.beginPath();
          ctx.fillStyle = `rgba(0,229,255,${p.alpha * 0.6})`;
          ctx.shadowColor = 'rgba(0,229,255,0.9)';
          ctx.shadowBlur = 12;
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
          p.x += p.vx; p.y += p.vy;
          if (p.x < -20) p.x = w + 20;
          if (p.x > w + 20) p.x = -20;
          if (p.y < -20) p.y = h + 20;
          if (p.y > h + 20) p.y = -20;
        });
        requestAnimationFrame(render);
      }
      window.addEventListener('resize', resize);
      resize();
      render();
    })();
  }
});
console.log(window.location.href);

