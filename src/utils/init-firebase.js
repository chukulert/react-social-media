import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { getFirestore } from "firebase/firestore";
import { getStorage, ref } from "firebase/storage";

export const FIREBASE_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(FIREBASE_CONFIG)
// export const initializeFireBaseClient = ()=> {
//   initializeApp(FIREBASE_CONFIG)
// }
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app)

// export default function initializeFireBaseClient () {
//   initializeApp(FIREBASE_CONFIG);
//   return getAuth(app)
// }

// export const firestoreFieldValue = firebase.firestore.FieldValue;
// export const timestamp = firebase.firestore.FieldValue.serverTimestamp();
