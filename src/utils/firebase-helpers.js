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
  query,
  where,
} from "firebase/firestore";
import nookies from "nookies";
import authenticatedPage from "../../pages/authenticated";
import { db } from "./init-firebase";
import { auth } from "./init-firebase";

export async function setUserProfile(uid) {
  try {
    // if (auth.currentUser) {
    const docRef = doc(db, "users", `${uid}`);
    const userProfile = await getDoc(docRef);
    //   console.log(userProfile)
    return userProfile.data();
    // console.log(userProfile)
    //   return userProfile.data();
    //   if (userProfile.exists()) {
    //     setCurrentUserProfile(userProfile.data());
    //   }
    // }
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

export async function fetchHomePageData(uid) {
  try {
    const userProfile = await setUserProfile(uid);
    const friendsData = await fetchFriendsData(userProfile);
    const allUsersData = await fetchAllUsers();
    return {
      props: {
        userProfile: userProfile,
        friendsData: friendsData,
        allUsersData: allUsersData,
      },
    };
  } catch (error) {
    console.error(error);
  }
}

export async function fetchUserPosts(uid) {
  try {
    //get posts of user page
    const userPosts = [];
    const q = query(collection(db, "posts"), where("user_id", "==", uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      //   const data = doc.data()
      const data = {
        ...doc.data(),
        id: doc.id,
      };
      // doc.data() is never undefined for query doc snapshots
      userPosts.push(data);
    });
    return userPosts;
  } catch (error) {
    console.error(error);
  }
}
