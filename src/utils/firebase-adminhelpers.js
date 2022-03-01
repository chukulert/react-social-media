import { FieldValue } from "firebase-admin/firestore";
import { db } from "./init-firebaseAdmin";

export async function fetchUserProfile(uid) {
  try {
    const docRef = db.collection("users").doc(`${uid}`);
    const userProfile = await docRef.get();
    if (userProfile) {
      return userProfile.data();
    }
  } catch (e) {
    console.error(e);
  }
}

export async function fetchFriendsData(userProfile) {
  try {
    // const db = getAdminDB()
    const allFriendsData = [];
    await Promise.all(
      userProfile.friends.map(async (friend) => {
        const docRef = db.collection("users").doc(friend);

        const friendUserProfile = await docRef.get();
        allFriendsData.push(friendUserProfile.data());
      })
    );
    return allFriendsData;
  } catch (error) {
    console.error(error);
  }
}

export async function fetchAllUsers() {
  try {
    // const db = getAdminDB()
    const allUsers = [];
    const usersRef = db.collection("users");
    const allFetchedUsers = await usersRef.get();
    allFetchedUsers.forEach((user) => {
      allUsers.push(user.data());
    });
    return allUsers;
  } catch (error) {
    console.error(error);
  }
}

export async function fetchUserPosts(uid) {
  try {
    //get posts of user page
    const userPosts = [];
    const postsRef = db.collection("posts");

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
    const postRef = db.collection("posts").doc(`${id}`);
    const post = await postRef.get();
    if (post) {
      return post.data();
    }
  } catch (e) {
    console.error(e);
  }
}

export async function updateLikePost(uid, postId, type) {
  try {
    const userRef = db.collection("users").doc(`${uid}`);
    const postRef = db.collection("posts").doc(`${postId}`);

    if (type === "like") {
      const updateUser = () => {
        userRef.update({
          likedPosts: FieldValue.arrayUnion(`${postId}`),
        });
      };

      const updatePost = () => {
        postRef.update({
          likesCount: FieldValue.increment(1),
        });
      };
      return await Promise.all([updateUser(), updatePost()]);
    } else {
      const updateUser = () => {
        userRef.update({
          likedPosts: FieldValue.arrayRemove(`${postId}`),
        });
      };

      const updatePost = () => {
        postRef.update({
          likesCount: FieldValue.increment(-1),
        });
      };
      return await Promise.all([updateUser(), updatePost()]);
    }
  } catch (e) {
    console.error(e);
  }
}

export async function updateLikeComment(uid, commentID, type) {
  try {
    const commentRef = db.collection("comments").doc(`${commentID}`);

    if (type === "like") {
      return await commentRef.update({
        likesCount: FieldValue.increment(1),
        userLikes: FieldValue.arrayUnion(`${uid}`),
      });
    } else {
      return await commentRef.update({
        likesCount: FieldValue.increment(-1),
        userLikes: FieldValue.arrayRemove(`${uid}`),
      });
    }
  } catch (e) {
    console.error(e);
  }
}

export async function postNewComment({
  user_id,
  user_displayName,
  user_profilePhoto,
  content,
  postID,
}) {
  try {
    const postRef = db.collection("posts").doc(`${postID}`);

    const commentData = {
      user_id,
      user_displayName,
      user_profilePhoto,
      content,
      created_at: Date.now(),
      likesCount: 0,
      post_ID: postID,
      userLikes: []
    };

    // Add a new document in collection "cities" with ID 'LA'
    const newComment = () => {
      db.collection("comments").add(commentData);
    };
    const updatePostComments = () => {
      postRef.update({
        commentsCount: FieldValue.increment(1),
      });
    };
    return await Promise.all([newComment(), updatePostComments()]);
  } catch (e) {
    console.error(e);
  }
}


export async function fetchPostComments(postID) {
  try {
    //get posts of user page
    const comments = [];
    const commentsRef = db.collection("comments");

    const querySnapshot = await commentsRef
      .where("post_ID", "==", postID)
      .get();
    querySnapshot.forEach((doc) => {
      const data = {
        ...doc.data(),
        id: doc.id,
      };
      comments.push(data);
    });
    return comments;
  } catch (error) {
    console.error(error);
  }
}
