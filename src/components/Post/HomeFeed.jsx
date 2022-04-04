import useSWRInfinite from "swr/infinite";
import { fetcher } from "../../utils";
import { useRef, useState, useEffect } from "react";
import Post from "./Post";
import styles from '../../../styles/pages.module.css';
import Loader from "../Loader/Loader";

const HomeFeed = ({userProfile}) => {
  const [element, setElement] = useState(null);
  const observer = useRef();

  const getKey = (pageIndex, previousPageData) => {
    // first page, we don't have `previousPageData`
    if (pageIndex === 0) return `/api/getFeed/${userProfile.userID}`;

    // add the cursor to the API endpoint
    return `/api/getFeed/${userProfile.userID}/${previousPageData[4]?.id}`;
  };

  const {
    data: feed,
    error: feedError,
    size,
    setSize,
  } = useSWRInfinite(userProfile ? getKey : null, fetcher, {
    revalidateIfStale: true,
  });

  const feedList = feed ? [].concat(...feed) : [];
  const isLoadingInitialData = !feed && !feedError;
  const isLoadingMore =
    isLoadingInitialData ||
    (size > 0 && feed && typeof feed[size - 1] === "undefined");
  const isEmpty = feed?.[0]?.length === 0;
  const isReachingEnd = isEmpty || (feed && feed[feed.length - 1]?.length < 5);

  const fetchMoreFeedHandler = () => {
    setSize(size + 1);
  };

  //get initial feeds and setup intersection observer
  useEffect(() => {
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
  }, [feed]);

  const handleObserver = (entries) => {
    if (entries[0].isIntersecting) {
      if (isReachingEnd) return;
      fetchMoreFeedHandler();
    }
  };

  return (
    <>
      {feedList && (
        <Post
          posts={feedList}
          currentUserProfile={userProfile}
          setElement={setElement}
        />
      )}
      <div ref={setElement}></div>
      {isLoadingMore && <div className={styles.loader}><Loader /></div>}
      {feedError && <div>{error}</div>}
      {isReachingEnd && (
        <div className={styles.centerText}>
          No more posts available. Follow other users to view more posts on your
          feed.
        </div>
      )}
    </>
  );
};

export default HomeFeed;
