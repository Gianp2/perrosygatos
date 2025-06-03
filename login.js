document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const loginStatus = document.getElementById('loginStatus');

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = loginForm.email.value.trim();
    const password = loginForm.password.value;

    // Validación básica
    if (!email || !password) {
      loginStatus.textContent = 'Por favor, completa todos los campos.';
      loginStatus.classList.remove('success');
      return;
    }

    try {
      // Llamada real al backend Express
      const res = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) {
        loginStatus.textContent = 'Email o contraseña incorrectos.';
        loginStatus.classList.remove('success');
        return;
      }

      // Si las credenciales son válidas
      loginStatus.textContent = '¡Login exitoso! Redirigiendo...';
      loginStatus.classList.add('success');

      // Guardamos el token básico para autenticación en futuras peticiones
      const token = btoa(`${email}:${password}`);
      localStorage.setItem('authToken', token);
      localStorage.setItem('loggedIn', 'true');

      // Redirigir
      setTimeout(() => {
        window.location.href = 'admin.html';
      }, 1500);

    } catch (error) {
      console.error('Error en login:', error);
      loginStatus.textContent = 'Error de conexión con el servidor.';
      loginStatus.classList.remove('success');
    }
  });
});
