import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAENWsxSVplCi2v6GMCw25mmwA-87qKQmY",
  authDomain: "kicks-shoe-store-4b656.firebaseapp.com",
  projectId: "kicks-shoe-store-4b656",
  storageBucket: "kicks-shoe-store-4b656.firebasestorage.app",
  messagingSenderId: "994772431571",
  appId: "1:994772431571:web:1462a5fefe53fcb5abda26"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Configure Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Remove GitHub provider since you're not using it