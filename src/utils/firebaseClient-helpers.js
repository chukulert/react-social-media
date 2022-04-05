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
import { db } from "./init-firebaseAdmin";

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

export async function fetchFollowingData(userProfile) {
  try {
    const allFollowingData = [];
    userProfile.following.forEach((friend) => {
      const docRef = doc(db, "users", friend);
      getDoc(docRef).then((response) => {
        allFollowingData.push(response.data());
      });
    });
    return allFollowingData;
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

// export async function fetchHomePageData(uid) {
//   try {
//     const userProfile = await setUserProfile(uid);
//     const friendsData = await fetchFriendsData(userProfile);
//     const allUsersData = await fetchAllUsers();
//     return {
//       props: {
//         userProfile: userProfile,
//         friendsData: friendsData,
//         allUsersData: allUsersData,
//       },
//     };
//   } catch (error) {
//     console.error(error);
//   }
// }

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
