import { db } from "./init-firebaseAdmin";


export async function fetchUserProfile(uid) {

  try {
      const docRef = db.collection('users').doc(`${uid}`)
      const userProfile = await docRef.get()
      if (userProfile) {
          return userProfile.data()
      }
    
  } catch (e) {
    console.error(e);
  }
}

export async function fetchFriendsData(userProfile) {
  try {
    // const db = getAdminDB()
    const allFriendsData = [];
    await Promise.all(userProfile.friends.map(async(friend) => {
      const docRef = db.collection('users').doc(friend)

      const friendUserProfile = await docRef.get()
        allFriendsData.push(friendUserProfile.data())
    }));
    return allFriendsData;
  } catch (error) {
    console.error(error);
  }
}

export async function fetchAllUsers() {
  try {
    // const db = getAdminDB()
    const allUsers = [];
    const usersRef = db.collection('users')
    const allFetchedUsers = await usersRef.get()
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
    const postsRef = db.collection('posts')

    const querySnapshot = await postsRef.where("user_id", "==", uid).get();
    querySnapshot.forEach((doc) => {

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

export async function fetchPostDataById(id) {
  try {
    const postRef = db.collection('posts').doc(`${id}`)
    const post = await docRef.get()
    if (post) {
        return post.data()
    }
} catch (e) {
  console.error(e);
}
}