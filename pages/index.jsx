//nextjs
import Head from "next/head";
//react
import { useCallback, useRef, useState, useEffect } from "react";
//cpmponents
import Post from "../src/components/Post/Post";
import HomeSideTab from "../src/components/HomeSideTab/HomeSideTab";
//firebase
import { verifyToken } from "../src/utils/init-firebaseAdmin";
import nookies from "nookies";
import {
  fetchAllUsersData,
  fetchUserProfile,
} from "../src/utils/firebase-adminhelpers";
//styles and icons
import styles from "../styles/pages.module.css";

export default function Home(props) {
  const [feed, setFeed] = useState([]);
  const [lastFeedPost, setLastFeedPost] = useState("");
  const [element, setElement] = useState(null);
  const [loading, setIsLoading] = useState(true);
  const [error, setError] = useState(true);
  const [noMorePosts, setNoMorePosts] = useState(false);
  const { userProfile, allUsersData } = props;

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
      setError(error);
    }
  };

  return (
    <>
      <Head>
        <title>Connect Me</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <main className={styles.container}>
        {userProfile && (
          <HomeSideTab userProfile={userProfile} allUsersData={allUsersData} />
        )}

        {feed && <Post posts={feed} currentUserProfile={userProfile} />}
        <div ref={setElement}></div>
        {loading && <div>Loading...</div>}
        {error && !noMorePosts && <div>{error}</div>}
        {noMorePosts && !loading && (
          <div className={styles.centerText}>
            No more posts available. Follow other users to view more posts on
            your feed.
          </div>
        )}
      </main>
    </>
  );
}

export async function getServerSideProps(context) {
  try {
    const cookies = nookies.get(context);
    const token = await verifyToken(cookies.token);
    const { uid } = token;
    if (uid) {
      const userProfile = await fetchUserProfile(uid);
      // const followingData = await fetchFollowingData(userProfile.following);
      // const followersData = await fetchFollowingData(userProfile.followers);
      const allUsersData = await fetchAllUsersData(uid);
      return {
        props: {
          userProfile: userProfile,
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
