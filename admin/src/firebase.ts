import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCYnuFOZ9di7DW4uO3aHf2amD1EfTmhjrA",
  authDomain: "cms-gf-udi.firebaseapp.com",
  projectId: "cms-gf-udi",
  storageBucket: "cms-gf-udi.firebasestorage.app",
  messagingSenderId: "555579628992",
  appId: "1:555579628992:web:65e7040e863c756e357c25",
  measurementId: "G-R7BLX76ZL6"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);
export const storage = getStorage(app);

// Connect to local emulators only when running locally
if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
  connectAuthEmulator(auth, "http://127.0.0.1:9099");
  connectFirestoreEmulator(db, '127.0.0.1', 8080);
  connectFunctionsEmulator(functions, "127.0.0.1", 5001);
  connectStorageEmulator(storage, "127.0.0.1", 9199);
}
