//swr
import { fetcher } from "../../utils";
import useSWR from "swr";
//nextjs
import Image from "next/image";
import Link from "next/link";
//react
import { useState, useEffect } from "react";
//components
import CommentBox from "./CommentBox";
import TextContent from "./TextContent";
//styles and icons
import styles from "./PostCard.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faThumbsUp,
  faComment,
  faShare,
} from "@fortawesome/free-solid-svg-icons";
//helpers
import { timeAgo } from "../../utils/index";

const PostCard = (props) => {
  const { currentUserProfile, likesCount, postCommentsCount, id } = props;
  const postID = id;
  const [displayComments, setDisplayComments] = useState(false);
  const [likedPost, setLikedPost] = useState(false);
  const [likes, setLikes] = useState(likesCount);
  const [commentsCount, setCommentsCount] = useState(postCommentsCount);

  library.add(faThumbsUp, faComment, faShare);

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
  const likeBtnStyles = likedPost
    ? `${styles.commentHeaderIcons} ${styles.likedPost}`
    : `${styles.commentHeaderIcons}`;

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
              className={styles.profilePhoto}
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
        <div className={styles.postTitle}>{props.title}</div>
        <TextContent className={styles.postContent}>
          {props.description}
        </TextContent>
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
        <div className={styles.commentHeaderTop}>
          <div>Likes: {likes}</div>
          <div className={styles.label} onClick={showCommentsHandler}>
            Comments: {commentsCount}
          </div>
        </div>

        <div className={styles.commentHeaderBtm}>
          <div className={styles.iconContainer} onClick={handleLikeButton}>
            <FontAwesomeIcon
              icon="fa-solid fa-thumbs-up"
              className={likeBtnStyles}
              id="likeBtn"
            />
            <label className={styles.label} htmlFor="likeBtn">
              Like
            </label>
          </div>
          <div className={styles.iconContainer} onClick={showCommentsHandler}>
            <FontAwesomeIcon
              icon="fa-solid fa-comment"
              className={styles.commentHeaderIcons}
              id="commentBtn"
            />
            <label className={styles.label} htmlFor="commentBtn">
              Comment
            </label>
          </div>
          <div className={styles.iconContainer}>
            <FontAwesomeIcon
              icon="fa-solid fa-share"
              className={styles.commentHeaderIcons}
              id="shareBtn"
            />
            <label className={styles.label} htmlFor="shareBtn">
              Share
            </label>
          </div>
        </div>
        {displayComments && (
          <CommentBox postID={props.id} userID={props.userID} />
        )}
      </div>
    </div>
  );
};

export default PostCard;
