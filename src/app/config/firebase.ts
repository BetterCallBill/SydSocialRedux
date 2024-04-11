import { initializeApp } from "firebase/app";
import 'firebase/firestore';
import 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "syd-social.firebaseapp.com",
  projectId: "syd-social",
  storageBucket: "syd-social.appspot.com",
  messagingSenderId: "663290298308",
  appId: "1:663290298308:web:24c37a0f7942a3a91a6e91",
  measurementId: "G-2E9FH8081T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);