
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  FacebookAuthProvider,
  browserLocalPersistence,
  browserSessionPersistence,
  initializeAuth
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Configuração do Firebase para o app
const firebaseConfig = {
  apiKey: "YOUR_API_KEY", // Substitua com sua chave de API Firebase
  authDomain: "YOUR_AUTH_DOMAIN.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Inicializa Auth com persistência
export const auth = initializeAuth(app, {
  persistence: [browserLocalPersistence, browserSessionPersistence]
});

// Provedores de autenticação
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account",
  theme: "dark"
});

export const facebookProvider = new FacebookAuthProvider();
facebookProvider.addScope("public_profile");
facebookProvider.setCustomParameters({
  display: "popup"
});

// Inicializa Firestore
export const db = getFirestore(app);

export { app };
