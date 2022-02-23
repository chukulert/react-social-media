import Head from "next/head";
import { useAuth } from "../src/context/AuthContext";
import NewPostForm from "../src/components/Form/NewPostForm";
import { db, storage } from "../src/utils/init-firebase";

import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import initializeFireBaseClient from "../src/utils/init-firebase";
import { auth } from "../src/utils/init-firebase";
import { onIdTokenChanged } from "firebase/auth";
import { fetchHomePageData } from "../src/utils/firebase-helpers";


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
  // const { currentUserProfile } = useAuth();
  const [showPostModal, setShowPostModal] = useState(false);
  const [showFriendsModal, setShowFriendsModal] = useState(false);
  // const [allUsers, setAllUsers] = useState([]);
  const [allFriends, setAllFriends] = useState([]);

  const {userProfile, friendsData, allUsersData} = props

  //fetch a list of all users
  // useEffect(() => {
  //   const fetchAllUsers = async () => {
  //     try {
  //       const allUsers = [];
  //       const allFetchedUsers = await getDocs(collection(db, "users"));
  //       allFetchedUsers.forEach((user) => {
  //         allUsers.push(user.data());
  //       });
  //       setAllUsers(allUsers);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };
  //   fetchAllUsers();
  // }, []);

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

  //fetch a list of all friends data
  // useEffect(() => {
  //   const fetchFriendsData = async () => {
  //     try {
  //       const allFriendsData = [];
  //       currentUserProfile.friends.forEach((friend) => {
  //         const docRef = doc(db, "users", friend);
  //         const userProfile = getDoc(docRef).then((response) => {
  //           allFriendsData.push(response.data());
  //         });
  //       });
  //       setAllFriends(allFriendsData);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };
  //   if (currentUserProfile) {
  //     fetchFriendsData();
  //   }
  // }, [currentUserProfile]);

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
      {/* {currentUserProfile && (
        <div>{`The current user is ${currentUserProfile.userID} Email is ${currentUserProfile.email} Friends: ${currentUserProfile.friends}`}</div>
      )} */}
       {userProfile && (
        <div>{`The current user is ${userProfile.userID} Email is ${userProfile.email} Friends: ${userProfile.friends}`}</div>
      )}
      {userProfile && (
        <button onClick={showPostModalHandler}>New Post</button>
      )}
      {userProfile && (
        <button onClick={showFriendsModalHandler}>Show Friends</button>
      )}
      {/* {currentUserProfile && (
        <Link href="/friends">
          <a>Show Friends</a>
        </Link>
      )} */}

      {allUsersData && userItems}

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
    const token = await verifyToken(cookies.token);
    console.log(token)
    // console.log(user)
    const { uid, email } = token;
    console.log(uid, email)
    //this returns the user profile in firestore

    const userProfile = await setUserProfile(uid)
   console.log(userProfile)
    //get all friends data
    const friendsData = await fetchFriendsData(userProfile)
    const allUsersData = await fetchAllUsers()
    // return Promise.all([userProfile, friendsData, allUsersData]).then(values => {
    //   const userProfileData = userProfile.data()
    //   const friendsData1  = friendsData.data()
    //   const allUsersData1 = allUsersData.data()
    //   console.log(userProfileData, friendsData1, allUsersData1)
    //   return {
    //     props: { userProfile: values[0], friendsData: values[1], allUsersData: values[2] },
    //   }
    // })
    return {
      props: { userProfile: userProfile, friendsData: friendsData, allUsersData: allUsersData },
    }
  } catch (err) {
      console.log(err)
    context.res.writeHead(302, { Location: "/login" });
    context.res.end();
    return { props: {} };
  }
}

// export async function getServerSideProps(context) {
//   try {

//     const cookies = nookies.get(context);
//     //this returns the user
//     const user = await verifyToken(cookies.token);
//     // console.log(user)
//     const {uid} = user
   
   
//     //get all friends data
//     const props =  onAuthStateChanged(auth, async (user) => {
//        //this returns the user profile in firestore
//     const userProfile = await setUserProfile(uid)
//     const friendsData = await fetchFriendsData(userProfile)
//     const allUsersData = await fetchAllUsers()
    
//     return {
//       props: { userProfile: userProfile, friendsData: friendsData, allUsersData: allUsersData },
//     }})
//     console.log(props)
//     return props

//   } catch (err) {
//       console.log(err)
//     context.res.writeHead(302, { Location: "/login" });
//     context.res.end();
//     return { props: {} };
//   }
// }