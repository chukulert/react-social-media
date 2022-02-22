import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
  onIdTokenChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  confirmPasswordReset,
} from "firebase/auth";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import nookies from "nookies";
import { db } from "./init-firebase";

export async function setUserProfile(user) {
  try {
    const docRef = doc(db, "users", `${user.uid}`);
    const userProfile = await getDoc(docRef);
    // console.log(userProfile)
    return userProfile.data();
    //   if (userProfile.exists()) {
    //     setCurrentUserProfile(userProfile.data());
    //   }
  } catch (e) {
    console.error(e);
  }
}

export async function fetchFriendsData(userProfile) {
  try {
    const allFriendsData = [];
    userProfile.friends.forEach((friend) => {
      const docRef = doc(db, "users", friend);
      getDoc(docRef).then((response) => {
        allFriendsData.push(response.data());
      });
    });
    return allFriendsData;
  } catch (error) {
    console.error(error);
  }
}

export async function fetchAllUsers() {
  try {
    const allUsers = [];
    const allFetchedUsers = await getDocs(collection(db, "users"));
    allFetchedUsers.forEach((user) => {
      allUsers.push(user.data());
    });
    return allUsers;
  } catch (error) {
    console.error(error);
  }
}
