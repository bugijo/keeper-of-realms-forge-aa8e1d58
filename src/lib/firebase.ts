
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

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "YOUR_API_KEY", // Replace with your Firebase API key
  authDomain: "YOUR_AUTH_DOMAIN.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with persistence
export const auth = initializeAuth(app, {
  persistence: [browserLocalPersistence, browserSessionPersistence]
});

// Auth providers
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account",
  theme: "dark"
});

export const facebookProvider = new FacebookAuthProvider();
facebookProvider.addScope("public_profile");

// Initialize Firestore
export const db = getFirestore(app);

export { app };
