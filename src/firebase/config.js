import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAENWsxSVplCi2v6GMCw25mmwA-87qKQmY",
  authDomain: "kicks-shoe-store-4b656.firebaseapp.com",
  projectId: "kicks-shoe-store-4b656",
  storageBucket: "kicks-shoe-store-4b656.firebasestorage.app",
  messagingSenderId: "994772431571",
  appId: "1:994772431571:web:1462a5fefe53fcb5abda26"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); // Make sure this line exists

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});