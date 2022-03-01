import { initializeApp } from 'firebase-admin/app';

const { getFirestore } = require('firebase-admin/firestore');

const admin = require("firebase-admin");

const serviceAccount = require("../../secret.json");

let app;

if (!admin.apps.length) {app = initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
})}

export const verifyToken = async (token) => {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
      // apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      // authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      // projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });
  }

  return admin
    .auth()
    .verifyIdToken(token)
    .catch((error) => {
      throw error;
    });
};

export const db = getFirestore(app)
// const adminApp =  admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
// });

// export const db = getFirestore(adminApp)

// export const adminDB = getFirestore()



// import { initializeApp } from 'firebase-admin/app';
// import { getAuth } from 'firebase/auth';

// export const verifyToken = (token) => {
//    const app = initializeApp({
//         credential: "../../nextjs-auth-fa0e8-firebase-adminsdk-jxky4-4dc1c1f4d0.json",
//         databaseURL: "https://nextjs-auth-fa0e8-default-rtdb.asia-southeast1.firebasedatabase.app",
//         // projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//       });
//       // console.log('1')
//       // console.log(app)
//       console.log(getAuth(app))
  
//       return getAuth(app)
//       .verifyIdToken(token)
//       // .then((decodedToken) => {
//       //   const uid = decodedToken.uid;
//       //   // ...
//       // })
//       .catch((error) => {
//         // Handle errort
//         console.log(error)
//       })}
    