import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration 
// (Client SDK config is public by design, hardcoding ensures Netlify deployments work flawlessly)
const firebaseConfig = {
  apiKey: "AIzaSyAYUy9X4v9PbOkCHkg2zSNhQ4F6UU7yPgg",
  authDomain: "pawar-enterprises-81739.firebaseapp.com",
  projectId: "pawar-enterprises-81739",
  storageBucket: "pawar-enterprises-81739.firebasestorage.app",
  messagingSenderId: "790467477235",
  appId: "1:790467477235:web:60048612294cdf05ad4186",
  measurementId: "G-C4Z3YYL593"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

let analytics = null;
if (typeof window !== "undefined") {
  isSupported().then(supported => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {});
}

export { analytics };

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;
