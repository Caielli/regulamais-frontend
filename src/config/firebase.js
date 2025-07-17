// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA1eGJhc1x1W92oKioSmm0IZ7xwwHZxHWc",
  authDomain: "regulamais-463618.firebaseapp.com",
  projectId: "regulamais-463618",
  storageBucket: "regulamais-463618.firebasestorage.app",
  messagingSenderId: "406470295622",
  appId: "1:406470295622:web:c7ab9e5b71320d12f28a47",
  measurementId: "G-VZ0Y0WJ3VC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app, 'us-central1');
export const analytics = getAnalytics(app);

// Connect to emulators in development (Create React App uses process.env.NODE_ENV)
if (process.env.NODE_ENV === 'development') {
  // Uncomment these lines if you want to use emulators in development
  // connectAuthEmulator(auth, 'http://localhost:9099');
  // connectFirestoreEmulator(db, 'localhost', 8080);
  // connectStorageEmulator(storage, 'localhost', 9199);
  // connectFunctionsEmulator(functions, 'localhost', 5001);
}

export default app;

