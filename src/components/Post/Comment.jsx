import { useState, useEffect } from "react";
import { timeAgo } from "../../utils";
import styles from "./Comment.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import TextContent from "./TextContent";
import Image from "next/image";

const Comment = (props) => {
  const {
    userID,
    displayName,
    profilePhoto,
    content,
    created_at,
    likesCount,
    postID,
    currentUserID,
    userLikes,
    id,
  } = props;

  const [likedComment, setLikedComment] = useState(false);
  const [likes, setLikes] = useState(likesCount);

  const date = timeAgo(created_at);
  library.add(faThumbsUp);

  useEffect(() => {
    if (userLikes.includes(currentUserID)) {
      setLikedComment(true);
    }
  }, []);

  const likeCommentHandler = async () => {
    try {
      await fetch(`/api/likeComment`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          commentId: id,
          uid: currentUserID,
          type: likedComment ? "unlike" : "like",
        }),
      });
      if (likedComment) {
        setLikes((prevCount) => prevCount - 1);
        setLikedComment(false);
      } else {
        setLikes((prevCount) => prevCount + 1);
        setLikedComment(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const likeBtnStyles = likedComment
    ? `${styles.likeBtn} ${styles.likedComment}`
    : `${styles.likeBtn}`;

  return (
    <div className={styles.commentContainer}>
      <div className={styles.imageContainer}>
        <Image
          src={profilePhoto}
          alt="user profile photo"
          width={64}
          height={64}
          className={styles.avartar}
        />
      </div>

      <div className={styles.commentRightContainer}>
        <div className={styles.commentContentsContainer}>
          <div className={styles.titleBarContent}>
            <Link href={`/profile/${userID}`}>
              <a className={styles.displayNameLink}>{displayName}</a>
            </Link>
            <p className={styles.timeAgo}>{date}</p>
          </div>
          <TextContent>{content}</TextContent>
        </div>

        <div className={styles.commentBtmContainer}>
          <div className={styles.iconContainer} onClick={likeCommentHandler}>
            <FontAwesomeIcon
              icon="fa-solid fa-thumbs-up"
              className={likeBtnStyles}
              id="commentLikeBtn"
            />
            <label htmlFor="commentLikeBtn" className={styles.label}>
              Like
            </label>
          </div>
          <div>Likes: {likes}</div>
        </div>
      </div>
    </div>
  );
};

export default Comment;
