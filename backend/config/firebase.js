import dotenv from 'dotenv';
import { initializeApp as initAdminApp, getApps as getAdminApps, cert } from 'firebase-admin/app';
import { getFirestore as getAdminFirestore } from 'firebase-admin/firestore';
import { getAuth as getAdminAuth } from 'firebase-admin/auth';
import { initializeApp as initClientApp, getApps as getClientApps } from 'firebase/app';
import { getFirestore as getClientFirestore } from 'firebase/firestore';
import { getAuth as getClientAuth } from 'firebase/auth';

dotenv.config();

let db;
let auth;
let adminMode = false;

// Check if Firebase Admin Service Account credentials are fully provided and not placeholder
const hasAdminCredentials = 
  Boolean(process.env.FIREBASE_PROJECT_ID) &&
  process.env.FIREBASE_PROJECT_ID !== 'your-project-id' &&
  Boolean(process.env.FIREBASE_CLIENT_EMAIL) &&
  process.env.FIREBASE_CLIENT_EMAIL.includes('@') &&
  !process.env.FIREBASE_CLIENT_EMAIL.includes('xxxxx') &&
  Boolean(process.env.FIREBASE_PRIVATE_KEY) &&
  !process.env.FIREBASE_PRIVATE_KEY.includes('Your\\nPrivate\\nKey');

if (hasAdminCredentials) {
  try {
    const adminApps = getAdminApps();
    const app = adminApps.length === 0 ? initAdminApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET
    }) : adminApps[0];

    db = getAdminFirestore(app);
    auth = getAdminAuth(app);
    adminMode = true;
    console.log('🔥 Firebase Admin SDK initialized successfully');
  } catch (error) {
    console.warn('⚠️ Firebase Admin init failed, falling back to Client SDK:', error.message);
  }
}

// Fallback to client SDK if Admin credentials are placeholders or not configured yet
if (!db) {
  const firebaseClientConfig = {
    apiKey: process.env.FIREBASE_API_KEY || "AIzaSyAYUy9X4v9PbOkCHkg2zSNhQ4F6UU7yPgg",
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || "pawar-enterprises-81739.firebaseapp.com",
    projectId: (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PROJECT_ID !== 'your-project-id')
      ? process.env.FIREBASE_PROJECT_ID 
      : "pawar-enterprises-81739",
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "pawar-enterprises-81739.firebasestorage.app",
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "790467477235",
    appId: process.env.FIREBASE_APP_ID || "1:790467477235:web:60048612294cdf05ad4186",
  };

  const clientApps = getClientApps();
  const clientApp = clientApps.length === 0 ? initClientApp(firebaseClientConfig) : clientApps[0];
  db = getClientFirestore(clientApp);
  auth = getClientAuth(clientApp);
  console.log('🔥 Firebase Client SDK initialized for backend Firestore operations');
}

export { db, auth, adminMode };
export default db;
