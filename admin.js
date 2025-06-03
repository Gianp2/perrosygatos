document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    window.location.href = 'login.html';
    return;
  }

  const animalesList = document.getElementById('animalesList');
  const animalForm = document.getElementById('animalForm');
  const logoutBtn = document.getElementById('logoutBtn');
  const cancelEdit = document.getElementById('cancelEdit');
  const animalId = document.getElementById('animalId');

  async function fetchAnimales() {
    const res = await fetch('/animales', {
      headers: {
        Authorization: `Basic ${token}`
      }
    });
    const animales = await res.json();

    animalesList.innerHTML = '';
    animales.forEach(animal => {
      const card = document.createElement('div');
      card.classList.add('animalCard');
      card.innerHTML = `
        <img src="${animal.foto}" alt="${animal.nombre}" />
        <h3>${animal.nombre}</h3>
        <p>${animal.descripcion}</p>
        <button onclick="editarAnimal(${animal.id})">Editar</button>
        <button onclick="eliminarAnimal(${animal.id})">Eliminar</button>
      `;
      animalesList.appendChild(card);
    });
  }

  window.editarAnimal = async (id) => {
    const res = await fetch('/animales', {
      headers: {
        Authorization: `Basic ${token}`
      }
    });
    const animales = await res.json();
    const animal = animales.find(a => a.id == id);
    if (!animal) return;

    animalId.value = animal.id;
    animalForm.nombre.value = animal.nombre;
    animalForm.descripcion.value = animal.descripcion;
    animalForm.foto.value = animal.foto;

    document.getElementById('formTitle').textContent = "Editar Animal";
    cancelEdit.style.display = 'inline';
  };

  window.eliminarAnimal = async (id) => {
    if (!confirm("¿Estás seguro de eliminar este animal?")) return;
    await fetch(`/animales/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Basic ${token}`
      }
    });
    fetchAnimales();
  };

  animalForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = animalId.value;
    const nombre = animalForm.nombre.value.trim();
    const descripcion = animalForm.descripcion.value.trim();
    const foto = animalForm.foto.value.trim();

    const body = JSON.stringify({ nombre, descripcion, foto });
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Basic ${token}`
    };

    if (id) {
      // Editar
      await fetch(`/animales/${id}`, {
        method: 'PUT',
        headers,
        body
      });
    } else {
      // Crear
      await fetch('/animales', {
        method: 'POST',
        headers,
        body
      });
    }

    animalForm.reset();
    animalId.value = '';
    cancelEdit.style.display = 'none';
    document.getElementById('formTitle').textContent = "Agregar Animal";
    fetchAnimales();
  });

  cancelEdit.addEventListener('click', () => {
    animalForm.reset();
    animalId.value = '';
    cancelEdit.style.display = 'none';
    document.getElementById('formTitle').textContent = "Agregar Animal";
  });

  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('authToken');
    window.location.href = 'login.html';
  });

  fetchAnimales();
});
