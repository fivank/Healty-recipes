// Minimal Firebase wrapper using modular v12 CDN imports.
// Provides: initFirebase, ensureSignedIn, loadRemoteState, saveRemoteState

import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

let app = null;
let auth = null;
let db = null;
let provider = null;

// NOTE: Replace these values with your project's config if needed.
const firebaseConfig = {
  apiKey: "AIzaSyDaLFW-Y95jBkxdSv9t0VYXWiJa9bhXHE0",
  authDomain: "simplyhealthy-c04e9.firebaseapp.com",
  projectId: "simplyhealthy-c04e9",
  storageBucket: "simplyhealthy-c04e9.firebasestorage.app",
  messagingSenderId: "191075238537",
  appId: "1:191075238537:web:e4f33f8a6a918e1c833c58"
};

export function initFirebase() {
  if (!getApps || getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  }
  auth = getAuth();
  db = getFirestore();
  provider = new GoogleAuthProvider();
}

export function subscribeAuth(callback) {
  if (!auth) return () => {};
  return onAuthStateChanged(auth, callback);
}

export async function ensureSignedIn() {
  if (!auth) initFirebase();
  if (auth.currentUser) return auth.currentUser;
  const result = await signInWithPopup(auth, provider);
  return result.user;
}

export async function signOutUser() {
  if (!auth) initFirebase();
  return signOut(auth);
}

export async function saveRemoteState(uid, state) {
  if (!db) initFirebase();
  const ref = doc(db, 'userStates', uid);
  const payload = { version: 2, updatedAt: serverTimestamp(), state };
  await setDoc(ref, payload, { merge: true });
}

export async function loadRemoteState(uid) {
  if (!db) initFirebase();
  const ref = doc(db, 'userStates', uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const data = snap.data() || {};
  return { state: data.state || null, updatedAt: data.updatedAt || null, version: data.version || null };
}
