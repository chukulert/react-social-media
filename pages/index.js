import Head from "next/head";
import { useAuth } from "../src/context/AuthContext";
import NewPostForm from "../src/components/Form/NewPostForm";
import { db, storage } from "../src/utils/init-firebase";
// import { addPost } from "../lib/firebase";
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
import { useEffect } from "react/cjs/react.development";
import FriendModal from "../src/components/Friend/FriendModal";

import { verifyToken } from '../src/utils/init-firebaseAdmin';
import nookies from 'nookies'
import { fetchAllUsers, fetchFriendsData, setUserProfile } from '../src/utils/firebase-helpers';

export default function Home(props) {
  const { currentUserProfile } = useAuth();
  const [showPostModal, setShowPostModal] = useState(false);
  const [showFriendsModal, setShowFriendsModal] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [allFriends, setAllFriends] = useState([]);

  //fetch a list of all users
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const allUsers = [];
        const allFetchedUsers = await getDocs(collection(db, "users"));
        allFetchedUsers.forEach((user) => {
          allUsers.push(user.data());
        });
        setAllUsers(allUsers);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAllUsers();
  }, []);

  const userItems = (
    <ul>
      {allUsers.map((user) => (
        // eslint-disable-next-line react/jsx-key
        <li key={user.userID}>
          <Link href={`/profile/${user.userID}`}>
            <a>{user.email}</a>
          </Link>
        </li>
      ))}
    </ul>
  );

  //fetch a list of all friends data
  useEffect(() => {
    const fetchFriendsData = async () => {
      try {
        const allFriendsData = [];
        currentUserProfile.friends.forEach((friend) => {
          const docRef = doc(db, "users", friend);
          const userProfile = getDoc(docRef).then((response) => {
            allFriendsData.push(response.data());
          });
        });
        setAllFriends(allFriendsData);
      } catch (error) {
        console.error(error);
      }
    };
    if (currentUserProfile) {
      fetchFriendsData();
    }
  }, [currentUserProfile]);

  const friendsList = (
    <ul>
      {allFriends.map((user) => (
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
        user_id: currentUserProfile.userID,
        title: title,
        description: description,
        created_at: Date.now(),
        likesCount: 0,
      });

      //if file exists, add to storage and update post
      if (file !== "") {
        const storageRef = ref(
          storage,
          `/${currentUserProfile.userID}/${createPost.id}`
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
      {currentUserProfile && (
        <div>{`The current user is ${currentUserProfile.userID} Email is ${currentUserProfile.email} Friends: ${currentUserProfile.friends}`}</div>
      )}
      {currentUserProfile && (
        <button onClick={showPostModalHandler}>New Post</button>
      )}
      {currentUserProfile && (
        <button onClick={showFriendsModalHandler}>Show Friends</button>
      )}
      {/* {currentUserProfile && (
        <Link href="/friends">
          <a>Show Friends</a>
        </Link>
      )} */}

      {allUsers && userItems}

      {showFriendsModal && (
        <FriendModal
          closeModal={closeFriendsModalHandler}
          // submitFormHandler={newPostSubmitHandler}
          friends={allFriends}
        />
      )}

      {showPostModal && (
        <FormModal
          closeModal={closePostModalHandler}
          submitFormHandler={newPostSubmitHandler}
        />
      )}

      {/* {showFriendModal && (
        <FormModal
          closeModal={closeFriendModalHandler}
        />
      )} */}
    </div>
  );
}

export async function getServerSideProps(context) {
  try {
     
    const cookies = nookies.get(context);
    //this returns the user
    const user = await verifyToken(cookies.token);
    //this returns the user profile in firestore
    const userProfile = await setUserProfile(user)
    //get all friends data
    const friendsData = await fetchFriendsData(userProfile)
    const allUsersData = await fetchAllUsers()
    return {
      props: { userProfile: userProfile, friendsData: friendsData, allUsersData: allUsersData },
    };
  } catch (err) {
      console.log(err)
    context.res.writeHead(302, { Location: "/login" });
    context.res.end();
    return { props: {} };
  }
}

