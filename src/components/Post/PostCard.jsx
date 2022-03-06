import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./PostCard.module.css";
import Link from "next/link";
import { timeAgo } from "../../utils/index";
import TextContent from "./TextContent";
import CommentBox from "./CommentBox";
import { useAuth } from "../../context/AuthContext";

import { fetcher, isEmpty } from "../../utils";
import useSWR from "swr";

const PostCard = (props) => {
  const [displayComments, setDisplayComments] = useState(false);
  const [likedPost, setLikedPost] = useState(false);
  const { currentUserProfile } = useAuth();
  const [likes, setLikes] = useState(props.likesCount);
  const [post, setPost] = useState(props);
  const [commentsCount, setCommentsCount] = useState(props.commentsCount);

  const postID = props.id;
  useEffect(() => {
    if (currentUserProfile) {
      if (currentUserProfile.likedPosts.includes(postID)) {
        setLikedPost(true);
      }
    }
  }, [currentUserProfile, postID]);

  const showCommentsHandler = () => {
    displayComments ? setDisplayComments(false) : setDisplayComments(true);
  };

  const { data, error } = useSWR(`/api/getPostById?id=${postID}`, fetcher, {
    revalidateOnFocus: false,
  });
  useEffect(() => {
    if (data && data.length > 0) {
      console.log(data);
      setPost(data[0]);
      setLikes(data[0].likesCount);
      setCommentsCount(data[0].commentsCount);
    }
  }, [data]);

  if (!data) return "Loading...";
  if (error) return "Error fetching data";

  const handleLikeButton = async () => {
    if (currentUserProfile) {
      try {
        await fetch(`/api/likePost`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uid: `${currentUserProfile.userID}`,
            postId: postID,
            type: likedPost ? "unlike" : "like",
          }),
        });
        if (likedPost) {
          setLikes((prevCount) => prevCount - 1);
          setLikedPost(false);
        } else {
          setLikes((prevCount) => prevCount + 1);
          setLikedPost(true);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const date = timeAgo(props.created_at);

  return (
    <div className={styles.cardContainer}>
      <div className={styles.titleBar}>
        <div>
          {props.profilePhoto && (
            <Image
              src={props.profilePhoto}
              alt={`${props.displayName}'s avatar`}
              width={50}
              height={50}
            />
          )}
          <div className={styles.titleBarContent}>
            <Link href={`/profile/${props.userID}`}>
              <a className={styles.displayNameLink}>{props.displayName}</a>
            </Link>
            <p className={styles.timeAgo}>{date}</p>
          </div>
        </div>
      </div>

      <div className={styles.description}>
        <strong>{props.title}</strong>
        <TextContent>{props.description}</TextContent>
      </div>

      <div>
        {props.image && (
          <Image
            src={props.image}
            alt="post image"
            width="100%"
            height="100%"
            layout="responsive"
            objectFit="cover"
            className={styles.image}
          />
        )}
      </div>
      <div className={styles.commentContainer}>
        <div className={styles.commentHeader}>
          <button onClick={handleLikeButton}>
            {likedPost ? "Unlike Post" : "Like Post"}
          </button>
          <button onClick={showCommentsHandler}>Show Comments</button>
          <span>Likes: {likes}</span>
          <span>Comments: {commentsCount}</span>
        </div>
        {displayComments && (
          <CommentBox postID={props.id} userID={props.userID} />
        )}
      </div>
    </div>
  );
};

export default PostCard;
