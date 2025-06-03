const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// ✅ SERVIR archivos estáticos (html, css, js, img)
app.use(express.static(__dirname));

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Archivo donde guardamos animales
const DATA_FILE = path.join(__dirname, 'animales.json');

// Leer animales desde archivo o iniciar vacío
function leerAnimales() {
  if (!fs.existsSync(DATA_FILE)) {
    return [];
  }
  const data = fs.readFileSync(DATA_FILE);
  return JSON.parse(data);
}

// Guardar animales en archivo
function guardarAnimales(animales) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(animales, null, 2));
}

// Datos del admin
const ADMIN_USER = "admin@perrosygatos.com";
const ADMIN_PASS = "123456";

// Autenticación básica
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return res.status(401).json({ error: 'No autorizado' });
  }
  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [user, pass] = credentials.split(':');

  if (user === ADMIN_USER && pass === ADMIN_PASS) {
    next();
  } else {
    res.status(401).json({ error: 'Credenciales inválidas' });
  }
}

// Rutas API

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (email === ADMIN_USER && password === ADMIN_PASS) {
    res.json({ success: true });
  } else {
    res.status(401).json({ error: 'Credenciales inválidas' });
  }
});

app.get('/animales', authMiddleware, (req, res) => {
  const animales = leerAnimales();
  res.json(animales);
});

app.post('/animales', authMiddleware, (req, res) => {
  const { nombre, descripcion, foto } = req.body;
  if (!nombre || !descripcion || !foto) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }
  const animales = leerAnimales();
  const nuevoAnimal = { id: Date.now(), nombre, descripcion, foto };
  animales.push(nuevoAnimal);
  guardarAnimales(animales);
  res.json(nuevoAnimal);
});

app.put('/animales/:id', authMiddleware, (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, foto } = req.body;
  if (!nombre || !descripcion || !foto) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }
  const animales = leerAnimales();
  const index = animales.findIndex(a => a.id == id);
  if (index === -1) return res.status(404).json({ error: 'Animal no encontrado' });

  animales[index] = { id: Number(id), nombre, descripcion, foto };
  guardarAnimales(animales);
  res.json(animales[index]);
});

app.delete('/animales/:id', authMiddleware, (req, res) => {
  const { id } = req.params;
  let animales = leerAnimales();
  const index = animales.findIndex(a => a.id == id);
  if (index === -1) return res.status(404).json({ error: 'Animal no encontrado' });

  animales.splice(index, 1);
  guardarAnimales(animales);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
