// index.js
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import app from "./firebase";

const auth = getAuth(app);

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = e.target.email.value;
  const password = e.target.password.value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    document.getElementById("loginStatus").textContent = `Bienvenido, ${user.email}!`;

    const token = await user.getIdToken();
    localStorage.setItem("authToken", token);

    // Opcional: Ocultar formulario login tras éxito
    document.getElementById("loginSection").style.display = "none";

    // Aquí puedes mostrar el formulario para agregar/eliminar animales

  } catch (error) {
    document.getElementById("loginStatus").textContent = "Error: " + error.message;
  }
});

// Buscador (copiado del HTML original)
const buscador = document.getElementById('buscador');
buscador.addEventListener('input', function () {
  const valor = this.value.toLowerCase();
  document.querySelectorAll('.tarjeta').forEach(card => {
    const texto = card.innerText.toLowerCase();
    card.style.display = texto.includes(valor) ? 'block' : 'none';
  });
});
