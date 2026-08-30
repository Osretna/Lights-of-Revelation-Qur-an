import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User, signInAnonymously } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfigJson from '../../firebase-applet-config.json';

// Configuration matching exactly your provided Firebase project: lights-of-revelation-qur-an
const firebaseConfig = {
  apiKey: "AIzaSyC-XLjvAIFueS3VFjJNc5QGQ4zpwkFEA5Q",
  authDomain: "lights-of-revelation-qur-an.firebaseapp.com",
  databaseURL: "https://lights-of-revelation-qur-an-default-rtdb.firebaseio.com",
  projectId: "lights-of-revelation-qur-an",
  storageBucket: "lights-of-revelation-qur-an.firebasestorage.app",
  messagingSenderId: "320117131959",
  appId: firebaseConfigJson?.appId || "1:320117131959:web:0aa2266299c8499f471b32",
  measurementId: "G-123NQCGXEN"
};

// Initialize Firebase App
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Services
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// If a custom firestoreDatabaseId is present in config, initialize with it
export const db = firebaseConfigJson.firestoreDatabaseId && firebaseConfigJson.firestoreDatabaseId !== '(default)'
  ? getFirestore(app, firebaseConfigJson.firestoreDatabaseId)
  : getFirestore(app);

export { signInWithPopup, signOut, onAuthStateChanged, signInAnonymously };
export type { User };
