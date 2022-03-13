import { useState, useEffect } from "react";
import styles from "./CommentBox.module.css";
import Comment from "./Comment";
import { useAuth } from "../../context/AuthContext";
import { fetcher, isEmpty } from "../../utils";
import useSWRInfinite from "swr/infinite";
import NewCommentForm from "../Form/NewCommentForm";
import Image from "next/image";


const CommentBox = (props) => {
  const { currentUserProfile } = useAuth();
  const { postID, userID } = props;

  const getKey = (pageIndex, previousPageData) => {

    //initlal load
    if (pageIndex === 0) return `/api/getCommentsByPostId/${postID}`;

    // add the cursor to the API endpoint
    return `/api/getCommentsByPostId/${postID}/${previousPageData[4]?.id}`;
  };

  const {
    data: comments,
    error: commentsError,
    size,
    setSize,
    mutate: mutateComments,
  } = useSWRInfinite(postID ? getKey : null, fetcher, {
    // refreshInterval: 1000,
    revalidateIfStale: false,
    revalidateOnFocus: false,
  });

  const commentsList = comments ? [].concat(...comments) : [];
  const isLoadingInitialData = !comments && !commentsError;
  const isLoadingMore =
    isLoadingInitialData ||
    (size > 0 && comments && typeof comments[size - 1] === "undefined");
  const isEmpty = comments?.[0]?.length === 0;
  const isReachingEnd =
    isEmpty || (comments && comments[comments.length - 1]?.length < 5);


  const handleLoadMoreComments = () => {
    setSize(size + 1);
  };


  const commentItems = (
    <div>
      {commentsList?.map((comment) => (
        <Comment
          key={comment.id}
          id={comment.id}
          userID={comment.user_id}
          displayName={comment.user_displayName}
          profilePhoto={comment.user_profilePhoto}
          content={comment.content}
          created_at={comment.created_at}
          likesCount={comment.likesCount}
          userLikes={comment.userLikes}
          postID={postID}
          currentUserID={currentUserProfile?.userID}
        />
      ))}
    </div>
  );
  const noCommentItems = !commentItems.props.children.length 

  //handle add comment
  const submitCommentHandler = async ({ content }) => {
    console.log(content)
    if (currentUserProfile) {
      try {
        const submitComment = async () => {
          await fetch(`/api/submitComment`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user_id: currentUserProfile.userID,
              user_displayName: currentUserProfile.displayName,
              user_profilePhoto: currentUserProfile.profilePhoto,
              content,
              postID: props.postID,
            }),
          });
        };

        const createNotification = async () => {
          if (props.userID !== currentUserProfile.userID) {
            await fetch(`/api/createNotification`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                sent_user_id: currentUserProfile.userID,
                sent_user_displayName: currentUserProfile.displayName,
                user_id: props.userID,
                link: `/post/${props.postID}`,
                type: "comment",
                message: `${currentUserProfile.displayName} has commented on your post.`,
              }),
            });
          }
        };
        await Promise.all([submitComment(), createNotification()]);
        mutateComments();
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className={styles.commentBoxContainer}>
      <div className={styles.commentBoxHeader}>
        <div>
          <Image
            src={currentUserProfile.profilePhoto}
            alt={`${currentUserProfile.displayName} photo`}
            width={40}
            height={40}
            className={styles.avatar}
          />
        </div>
        <div className={styles.submitCommentForm}>
          <NewCommentForm submitHandler={submitCommentHandler} />
        </div>
      </div>
      <div>{commentItems}</div>
      {noCommentItems ? <p className={styles.loadMoreBtn}>No comments available.</p> : null}
      {!isReachingEnd && !noCommentItems && (
        <div onClick={handleLoadMoreComments} className={styles.loadMoreBtn}>
          Load more
        </div>
      )}
      {isReachingEnd && (
        <p className={styles.loadMoreBtn}>All comments are loaded.</p>
      )}
    </div>
  );
};

export default CommentBox;
