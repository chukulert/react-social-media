import Head from "next/head";
import { useAuth } from "../src/context/AuthContext";
import NewPostForm from "../src/components/Form/NewPostForm";
import { db, storage } from "../src/utils/init-firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  setDoc,
  query,
  where,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useState } from "react";
import FormModal from "../src/components/Form/FormModal";
import Link from "next/link";
import FriendModal from "../src/components/Friend/FriendModal";

import { verifyToken } from "../src/utils/init-firebaseAdmin";
import nookies from "nookies";
import {
  fetchAllUsers,
  fetchUserProfile,
  fetchFriendsData,
} from "../src/utils/firebase-adminhelpers";

export default function Home(props) {
  const [showPostModal, setShowPostModal] = useState(false);
  const [showFriendsModal, setShowFriendsModal] = useState(false);

  const { userProfile, friendsData, allUsersData } = props;

  const userItems = (
    <ul>
      {allUsersData.map((user) => (
        // eslint-disable-next-line react/jsx-key
        <li key={user.userID}>
          <Link href={`/profile/${user.userID}`}>
            <a>{user.email}</a>
          </Link>
        </li>
      ))}
    </ul>
  );

  const friendsList = (
    <ul>
      {friendsData.map((user) => (
        // eslint-disable-next-line react/jsx-key
        <li key={user.userID}>
          <Link href={`/profile/${user.userID}`}>
            <a>{user.email}</a>
          </Link>
        </li>
      ))}
    </ul>
  );

  //modal handler functions
  const closePostModalHandler = () => {
    setShowPostModal(false);
  };

  const showPostModalHandler = () => {
    setShowPostModal(true);
  };

  const closeFriendsModalHandler = () => {
    setShowFriendsModal(false);
  };

  const showFriendsModalHandler = () => {
    setShowFriendsModal(true);
  };

  const newPostSubmitHandler = async ({ title, description, file }) => {
    try {
      //create post in firestore
      const createPost = await addDoc(collection(db, "posts"), {
        user_id: userProfile.userID,
        title: title,
        description: description,
        created_at: Date.now(),
        likesCount: 0,
        user_displayName: userProfile.displayName,
        user_profilePhoto: userProfile.profilePhoto,
      });

      //if file exists, add to storage and update post
      if (file !== "") {
        const storageRef = ref(
          storage,
          `/${userProfile.userID}/${createPost.id}`
        );
        const uploadTask = await uploadBytesResumable(storageRef, file);
        const fileURL = await getDownloadURL(uploadTask.ref);
        if (fileURL) {
          await setDoc(createPost, { image: fileURL }, { merge: true });
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <div>This is the homepage</div>
      {userProfile && (
        <div>{`The current user is ${userProfile.userID} Email is ${userProfile.email} Friends: ${userProfile.friends}`}</div>
      )}
      {userProfile && <button onClick={showPostModalHandler}>New Post</button>}
      {userProfile && (
        <button onClick={showFriendsModalHandler}>Show Friends</button>
      )}

      {allUsersData && userItems}

      {showFriendsModal && (
        <FriendModal
          closeModal={closeFriendsModalHandler}
          friends={friendsData}
        />
      )}

      {showPostModal && (
        <FormModal
          closeModal={closePostModalHandler}
          submitFormHandler={newPostSubmitHandler}
        />
      )}
    </div>
  );
}

export async function getServerSideProps(context) {
  try {
    const cookies = nookies.get(context);
    const token = await verifyToken(cookies.token);
    const { uid, email } = token;
    console.log(uid, email);
    //this returns the user profile in firestore
    if (uid) {
      const userProfile = await fetchUserProfile(uid);
      if (userProfile.private === false) {
        const friendsData = await fetchFriendsData(userProfile);
        const allUsersData = await fetchAllUsers();
        return {
          props: {
            userProfile: userProfile,
            friendsData: friendsData,
            allUsersData: allUsersData,
          },
        };
      }
    }
    return {
      props: {},
    };
  } catch (err) {
    console.log(err);
    context.res.writeHead(302, { Location: "/login" });
    context.res.end();
    return { props: {} };
  }
}
