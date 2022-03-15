import Head from "next/head";
import { db, storage } from "../src/utils/init-firebase";
import { collection, addDoc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useCallback, useRef, useState } from "react";
import FormModal from "../src/components/Form/FormModal";
import Link from "next/link";
import FollowingModal from "../src/components/Friend/FollowingModal";
import Post from "../src/components/Post/Post";

import { verifyToken } from "../src/utils/init-firebaseAdmin";
import nookies from "nookies";
import {
  fetchAllUsers,
  fetchUserProfile,
  fetchFollowingData,
  // fetchInitialFeedData,
} from "../src/utils/firebase-adminhelpers";


import { useEffect } from "react/cjs/react.development";

export default function Home(props) {
  const [showPostModal, setShowPostModal] = useState(false);
  const [showFriendsModal, setShowFriendsModal] = useState(false);
  const [feed, setFeed] = useState([]);
  const [lastFeedPost, setLastFeedPost] = useState("");
  const [element, setElement] = useState(null);
  const [loading, setIsLoading] = useState(true);
  const [error, setError] = useState(true);
  const [noMorePosts, setNoMorePosts] = useState(false);

  const { userProfile, followingData, allUsersData, feedData } = props;
  const observer = useRef();

  //get initial feeds and setup intersection observer
  useEffect(() => {
    if (feed?.length === 0) {
      getInitialFeed();
    }
    let currentElement;
    let currentObserver;
    observer.current = new IntersectionObserver(handleObserver, {
      threshold: 1,
    });
    currentElement = element;
    currentObserver = observer.current;

    if (currentElement) {
      currentObserver.observe(currentElement);
    }
    return () => {
      if (currentElement) {
        currentObserver.disconnect();
      }
    };
  }, [feed, lastFeedPost]);

  const handleObserver = useCallback(
    (entries) => {
      if (entries[0].isIntersecting) {
        fetchMoreFeedHandler();
      }
    },
    [feed, lastFeedPost]
  );

  const userItems = (
    <ul>
      {allUsersData.map((user) => (
        <li key={user.userID}>
          <Link href={`/profile/${user.userID}`}>
            <a>{user.email}</a>
          </Link>
        </li>
      ))}
    </ul>
  );

  // const friendsList = (
  //   <ul>
  //     {friendsData.map((user) => (
  //       // eslint-disable-next-line react/jsx-key
  //       <li key={user.userID}>
  //         <Link href={`/profile/${user.userID}`}>
  //           <a>{user.email}</a>
  //         </Link>
  //       </li>
  //     ))}
  //   </ul>
  // );

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
      //create post in firestore. 
      const createPost = await addDoc(collection(db, "posts"), {
        user_id: userProfile.userID,
        title: title,
        description: description,
        created_at: Date.now(),
        likesCount: 0,
        commentsCount: 0,
        user_displayName: userProfile.displayName,
        user_profilePhoto: userProfile.profilePhoto,
        followers: [...userProfile.followers],
      });

      //if file exists, add to storage and update post
      if (file) {
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


  const getInitialFeed = async () => {
    try {
      const response = await fetch(`/api/getFeed?id=${userProfile.userID}`);
      const { initialFeedData, lastDoc } = await response.json();
      setFeed(initialFeedData);
      setLastFeedPost(lastDoc);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMoreFeedHandler = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/getFeed`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userID: userProfile.userID,
          lastPost: lastFeedPost,
        }),
      });
      //api returns a response stream, read with .json() and returns a promise
      const { postsData, lastDoc } = await response.json();
      if (!postsData) {
        setIsLoading(false);
        setNoMorePosts(true);
        return;
      }
      setFeed((previousState) => [...previousState, ...postsData]);
      setLastFeedPost(lastDoc);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setError(error)
    }
  };

  return (
    <div>
      <div>This is the homepage</div>
      {userProfile && (
        <div>Email is ${userProfile.email}</div>
      )}
      {userProfile && <button onClick={showPostModalHandler}>New Post</button>}
      {userProfile && (
        <button onClick={showFriendsModalHandler}>Show Following</button>
      )}

      {allUsersData && userItems}

      {showFriendsModal && (
        <FollowingModal
          closeModal={closeFriendsModalHandler}
          following={followingData}
        />
      )}

      {showPostModal && (
        <FormModal
          closeModal={closePostModalHandler}
          submitFormHandler={newPostSubmitHandler}
        />
      )}

      {feed && <Post posts={feed} />}
      <div ref={setElement}></div>
      {loading && <div>Loading...</div>}
      {error && !noMorePosts && <div>{error}</div>}
      {noMorePosts && !loading && <div>No More posts</div>}
    </div>
  );
}

export async function getServerSideProps(context) {
  try {
    const cookies = nookies.get(context);
    const token = await verifyToken(cookies.token);
    const { uid, email } = token;
    //this returns the user profile in firestore
    if (uid) {
      const userProfile = await fetchUserProfile(uid);
      const followingData = await fetchFollowingData(userProfile.following);
      const allUsersData = await fetchAllUsers();
      return {
        props: {
          userProfile: userProfile,
          followingData: followingData ? followingData : [],
          allUsersData: allUsersData ? allUsersData : [],
        },
      };
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
