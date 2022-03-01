import { useState, useEffect } from "react";
import { timeAgo } from "../../utils";
import styles from "./Comment.module.css";


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
    id
  } = props;

  const [likedComment, setLikedComment] = useState(false);
  const [likes, setLikes] = useState(likesCount);

  const time = timeAgo(created_at);

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
          type: likedComment ? "unlike" : "like"
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

  return (
    <div className={styles.commentContainer}>
      <div>displayName: {displayName}</div>
      <div>content: {content}</div>
      <div>created_at: {time}</div>
      <div>likesCount: {likes}</div>
      <div>postID: {postID}</div>
      <button onClick={likeCommentHandler}>{likedComment ? 'Unlike Comment' : 'Like Comment'}</button>
    </div>
  );
};

export default Comment;
