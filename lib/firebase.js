// /* eslint-disable react-hooks/rules-of-hooks */
// import {
//   collection,
//   addDoc,
//   getDocs,
//   doc,
//   getDoc,
//   query,
//   where,
// } from "firebase/firestore";

// import { db } from "../src/utils/init-firebase";
// import { useAuth } from "../src/context/AuthContext";

// // const {currentUser} = useAuth()

// export const addPost = async ({ title, description }) => {
//   try {
//     const docRef = await addDoc(collection(db, "posts"), {
//       user_id: currentUser.uid,
//       title: title,
//       description: description,
//       created_at: Date.now(),
//     });
//   } catch (e) {
//     console.error(e);
//   }
// };
