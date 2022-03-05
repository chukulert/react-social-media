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

export async function fetchFollowingData(following) {
  try {
    const allFollowingData = [];

    await Promise.all(
      following.map(async (following) => {
        const docRef = db.collection("users").doc(String(following));
        const data = await docRef.get();
        if (data) {
          allFollowingData.push(data.data());
        }
      })
    );
    return allFollowingData;
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
      userLikes: [],
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

export async function updateFollowersFeed(userProfile, postData, postID) {
  try {
    const response = await Promise.all(
      userProfile.following.map(async (following) => {
        console.log(following)
        await db.collection(`users/${following}/feed`).doc(postID).set(postData);
      })
    );
      return response
  } catch (error) {
    console.error(error);
  }
}

export async function updateFollowUser(currentUserID, postUserID, type) {
  try {
    const currentUserRef = db.collection("users").doc(`${currentUserID}`);
    const postUserRef = db.collection("users").doc(`${postUserID}`);

    if (type === "follow") {
      const updateCurrentUser = () => {
        currentUserRef.update({
          following: FieldValue.arrayUnion(`${postUserID}`),
        });
      };

      const updatePostUser = () => {
        postUserRef.update({
          followers: FieldValue.arrayUnion(`${currentUserID}`),
        });
      };
      return await Promise.all([updateCurrentUser(), updatePostUser()]);
    } else {
      const updateCurrentUser = () => {
        currentUserRef.update({
          following: FieldValue.arrayRemove(`${postUserID}`),
        });
      };

      const updatePostUser = () => {
        postUserRef.update({
          followers: FieldValue.arrayRemove(`${currentUserID}`),
        });
      };
      return await Promise.all([updateCurrentUser(), updatePostUser()]);
    }
  } catch (error) {
    console.error(error);
  }
}
