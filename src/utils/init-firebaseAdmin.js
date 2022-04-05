import { initializeApp } from "firebase-admin/app";

const { getFirestore } = require("firebase-admin/firestore");

const admin = require("firebase-admin");

let app;

if (!admin.apps.length) {
  app = initializeApp({
    credential: admin.credential.cert({
      privateKey: process.env.FIREBASE_PRIVATE_KEY
        ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/gm, "\n")
        : undefined,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      projectId: process.env.FIREBASE_PROJECT_ID,
    }),
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  });
}

export const verifyToken = async (token) => {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        privateKey: process.env.FIREBASE_PRIVATE_KEY,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        projectId: process.env.FIREBASE_PROJECT_ID,
      }),
      databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    });
  }

  return admin
    .auth()
    .verifyIdToken(token)
    .catch((error) => {
      throw error;
    });
};

export const db = getFirestore(app);
