// Importar Firebase necesarios
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Configuración Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCurIJIVYM8eLvJ-ikM5Q3AetPwdFB9E7U",
  authDomain: "perrosygatos-2025.firebaseapp.com",
  projectId: "perrosygatos-2025",
  storageBucket: "perrosygatos-2025.appspot.com",  // corregido
  messagingSenderId: "525559397218",
  appId: "1:525559397218:web:21d72f0a559874fb6fca3b",  // corregido (el "web:" y formato)
  measurementId: "G-7BH1T0NRNB"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Servicios usados
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
export default app;
