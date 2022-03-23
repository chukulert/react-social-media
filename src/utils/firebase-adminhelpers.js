import { FieldValue } from "firebase-admin/firestore";
import { useDebugValue } from "react";
import { unstable_renderSubtreeIntoContainer } from "react-dom";
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
        const docRef = db.collection("users").doc(following);
        const doc = await docRef.get();
        if (doc) {
          allFollowingData.push(doc.data());
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
    const usersRef = db.collection("users")
    const allFetchedUsers = await usersRef.get();
    allFetchedUsers.forEach((user) => {
      allUsers.push(user.data());
    });
    return allUsers;
  } catch (error) {
    console.error(error);
  }
}

export async function fetchAllUsersData(uid) {
  try {
    // const db = getAdminDB()
    const allUsers = [];
    const usersRef = db.collection("users").where('userID', '!=', uid);
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
      .orderBy("likesCount", "desc")
      .orderBy("created_at", "desc")
      .limit(5)
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

export async function fetchMorePostComments(postID, snapshot) {
  try {
    //get posts of user page
    const comments = [];
    const commentsRef = db.collection("comments");

    const querySnapshot = await commentsRef
      .where("post_ID", "==", postID)
      .orderBy("likesCount", "desc")
      .orderBy("created_at", "desc")
      .startAfter(snapshot)
      .limit(5)
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

export async function getCommentSnapshotByID(commentID) {
  try {
    const doc = db.collection("comments").doc(commentID).get();
    return doc;
  } catch (error) {
    console.error(error);
  }
}

export async function updateFollowersFeed(userProfile, postData, postID) {
  try {
    const response = await Promise.all(
      userProfile.following.map(async (following) => {
        await db
          .collection(`users/${following}/feed`)
          .doc(postID)
          .set(postData);
      })
    );
    return response;
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

export async function updatePostFollowing(currentUserID, postID, type) {
  try {
    const postRef = db.collection("posts").doc(postID);
    if (type === "follow") {
      return await postRef.update({
        followers: FieldValue.arrayUnion(currentUserID),
      });
    } else {
      return await postRef.update({
        followers: FieldValue.arrayRemove(currentUserID),
      });
    }
  } catch (error) {
    console.error(error);
  }
}

// const fetchMoreComments = async () => {
// const nextQuery = query(
//   collection(db, "comments"),
//   where("post_ID", "==", props.postID),
//   orderBy("created_at", "desc"),
//   orderBy("likesCount", "desc"),
//   startAfter(lastDoc),
//   limit(2)
// );
//   const documentSnapshots = await getDocs(nextQuery);
//   updateCommentsState(documentSnapshots);
// };

export async function fetchInitialFeedData(userID) {
  try {
    const query = db
      .collection(`posts`)
      .where("followers", "array-contains", userID)
      .orderBy("created_at", "desc")
      .orderBy("likesCount", "desc")
      .limit(4);
    const snapshots = await query.get();
    const initialFeedData = snapshots.docs.map((post) => {
      const data = {
        ...post.data(),
        id: post.id,
      };
      return data;
    });
    const lastDoc = snapshots.docs[snapshots.docs.length - 1].data();
    return {
      initialFeedData,
      lastDoc,
    };
  } catch (error) {
    console.error(error);
  }
}

export async function fetchMoreFeed(userID, lastPost) {
  try {
    const query = db
      .collection(`posts`)
      .where("followers", "array-contains", userID)
      .orderBy("created_at", "desc")
      .orderBy("likesCount", "desc")
      .startAfter(lastPost.created_at)
      .limit(4);
    const snapshots = await query.get();

    const postsData = snapshots.docs.map((post) => {
      const data = {
        ...post.data(),
        id: post.id,
      };
      return data;
    });

    const lastDoc = snapshots.docs[snapshots.docs.length - 1].data();
    return {
      postsData,
      lastDoc,
    };
  } catch (error) {
    console.error(error);
  }
}

export async function createNewNotification({
  sent_user_id,
  sent_user_displayName,
  user_id,
  link,
  type,
  message,
}) {
  try {
    const notificationData = {
      sent_user_id,
      sent_user_displayName,
      user_id,
      link,
      created_at: Date.now(),
      type,
      read: false,
      message,
    };

    return await db.collection("notifications").add(notificationData);
  } catch (e) {
    console.error(e);
  }
}

//fetch data for an array of groups by user ID
export async function fetchGroupsByUser({ userID, displayName, profilePhoto }) {
  try {
    const snapshots = await db
      .collection("groups")
      .where("members", "array-contains", {
        id: userID,
        displayName,
        profilePhoto,
      })
      .get();

    const groupData = snapshots.docs.map((group) => {
      const data = {
        ...group.data(),
        id: group.id,
      };
      return data;
    });

    return groupData;
  } catch (e) {
    console.error(e);
  }
}

// get data for message groups that an array of users are in
export async function fetchGroupByUserArray(userArray) {
  try {
    let groupRef = db.collection("groups");
    // userArray.forEach((user) => {
    //   console.log(user)
    //   groupRef = groupRef.where("members", "==", user);
    // });
    // const snapshots = await groupRef.where("members", 'array-contains', userArray[0]).where("members", 'array-contains', userArray[1]).get();
    const snapshots = await groupRef
      .where("members", "array-contains", userArray[0])
      .get();
    const groupsData = snapshots.docs.map((group) => {
      const data = {
        ...group.data(),
        id: group.id,
      };
      return data;
    });
    return groupsData;
  } catch (error) {
    console.error(error);
  }
}

//save new message
export async function saveNewMessage({ messageText, userID, groupID }) {
  try {
    const messageRef = db
      .collection("messages")
      .doc(`${groupID}`)
      .collection("messages");

    const messageData = {
      messageText,
      sent_by: userID,
      sent_at: Date.now(),
      read: false,
    };
    return await messageRef.add(messageData);
  } catch (e) {
    console.error(e);
  }
}

//save new group
export async function saveNewGroup({ userID, userArray, type, groupName }) {
  try {
    const groupData = {
      created_at: Date.now(),
      created_by: userID,
      members: userArray,
      type,
      groupName,
    };
    return await db.collection("groups").add(groupData);
  } catch (e) {
    console.error(e);
  }
}

//fetch messages using a group id
export async function fetchMessagesByGroupID(groupID) {
  try {
    const query = db
      .collection("messages")
      .doc(groupID)
      .collection("messages")
      .orderBy("sent_at", "desc")
      .limit(15);
    const snapshots = await query.get();
    const messages = snapshots.docs.map((message) => {
      const data = {
        ...message.data(),
        id: message.id,
      };
      return data;
    });
    return messages;
  } catch (e) {
    console.error(e);
  }
}

export async function fetchMoreMessagesByGroupID(groupID, snapshot) {
  try {
    const query = db
      .collection("messages")
      .doc(groupID)
      .collection("messages")
      .orderBy("sent_at", "desc")
      .startAfter(snapshot)
      .limit(15);
    const snapshots = await query.get();
    const messages = snapshots.docs.map((message) => {
      const data = {
        ...message.data(),
        id: message.id,
      };
      return data;
    });
    return messages;
    // const lastDoc = snapshots.docs[snapshots.docs.length - 1].data();
    // return {
    //   messages,
    //   lastDoc,
    // };
  } catch (e) {
    console.error(e);
  }
}

export async function getMessageSnapshotByID(groupID, messageID) {
  try {
    const messageRef = db
      .collection("messages")
      .doc(groupID)
      .collection("messages")
      .doc(messageID);
    const doc = await messageRef.get();
    return doc;
  } catch (error) {
    console.error(error);
  }
}

export async function postNewMessage({ sent_by, messageText, messageGroupID }) {

  try {
    const messageRef = db
      .collection("messages")
      .doc(messageGroupID)
      .collection("messages");

    const timeStamp = Date.now();

    const groupRef = db.collection("groups").doc(messageGroupID);

    const messageData = {
      sent_at: timeStamp,
      sent_by,
      messageText,
      read: false,
    };
    const addMessage = async () => {
      await messageRef.add(messageData);
    };
    const updateGroup = async () => {
      await groupRef.update({
        modified_at: timeStamp,
        "last_message.created_at": timeStamp,
        "last_message.textContent": messageText,
      });
    };

    return await Promise.all([addMessage(), updateGroup()]);
  } catch (error) {}
}

export async function createNewMessageGroup({ membersArray, currentUserID }) {
  // console.log(membersArray,currentUserID)
  try {
    const groupData = {
      created_at: Date.now(),
      created_by: currentUserID,
      members: membersArray,
      groupName: "",
      modified_at: Date.now(),
      type: "private",
    };
    const group = await db.collection("groups").add(groupData);
    const fetchedGroup = await db.collection("groups").doc(group.id).get();
    const data = {
      ...fetchedGroup.data(),
      id: group.id,
    };
    return data;
  } catch (error) {}
}
