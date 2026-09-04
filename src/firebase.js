import { getAnalytics, isSupported } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBjpzMIYj1Ga8HtiRAzA0cxKRJO_896ZVs",
  authDomain: "itihasa-3c43c.firebaseapp.com",
  projectId: "itihasa-3c43c",
  storageBucket: "itihasa-3c43c.firebasestorage.app",
  messagingSenderId: "515368085342",
  appId: "1:515368085342:web:875271647eadc5d84e11cf",
  measurementId: "G-P6XT7JGLGQ",
};

export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);

export const analyticsPromise = isSupported().then((supported) =>
  supported ? getAnalytics(firebaseApp) : null,
);
