import { useState, useEffect } from "react";
import styles from "./CommentBox.module.css";
import Comment from "./Comment";
import { useAuth } from "../../context/AuthContext";
import { fetcher, isEmpty } from "../../utils";

import NewCommentForm from "../Form/NewCommentForm";
import { db } from "../../utils/init-firebase";
import {
  collection,
  query,
  orderBy,
  startAfter,
  limit,
  getDocs,
  where,
} from "firebase/firestore";

const CommentBox = (props) => {
  const { currentUserProfile } = useAuth();
  const [comments, setComments] = useState([]);
  const [lastDoc, setLastDoc] = useState("");
  const [loading, setLoading] = useState(true);
  const [noMoreComments, setNoMoreComments] = useState(false);

  useEffect(() => {
    const abortCtrl = new AbortController();
    const opts = { signal: abortCtrl.signal };

    const fetchComments = async () => {
      try {
        const firstQuery = query(
          collection(db, "comments"),
          where("post_ID", "==", props.postID),
          orderBy("created_at", "desc"),
          orderBy("likesCount", "desc"),
          limit(5)
        );
        const documentSnapshots = await getDocs(firstQuery);
        console.log(documentSnapshots);
        updateCommentsState(documentSnapshots);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    fetchComments();
    return () => {
      abortCtrl.abort();
    };
  }, []);

  const updateCommentsState = (documentSnapshots) => {
    if (documentSnapshots.docs.length !== 0) {
      const commentsData = documentSnapshots.docs.map((comment) => {
        const data = {
          ...comment.data(),
          id: comment.id,
        };
        return data;
      });
      const lastDoc = documentSnapshots.docs[documentSnapshots.docs.length - 1];
      setComments((previousState) => [...previousState, ...commentsData]);
      if (documentSnapshots.docs.length < 5) {
        setNoMoreComments(true);
        return;
      }
      setLastDoc(lastDoc);
    } else {
      setNoMoreComments(true);
      return;
    }
  };

  const fetchMoreComments = async () => {
    setLoading(true);
    const nextQuery = query(
      collection(db, "comments"),
      where("post_ID", "==", props.postID),
      orderBy("created_at", "desc"),
      orderBy("likesCount", "desc"),
      startAfter(lastDoc),
      limit(5)
    );
    const documentSnapshots = await getDocs(nextQuery);
    updateCommentsState(documentSnapshots);
    setLoading(false);
  };

  const commentItems = (
    <div>
      {comments.length !== 0 &&
        comments.map((comment) => (
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
            postID={props.postID}
            currentUserID={currentUserProfile.userID}
          />
        ))}
    </div>
  );

  //handle add comment
  const submitCommentHandler = async ({ content }) => {
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
          if(props.userID !== currentUserProfile.userID) {
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
      } catch (error){
        console.error(error);
      }
    }
  };

  return (
    <div>
      <NewCommentForm submitHandler={submitCommentHandler} />
      <div>Comment box {commentItems}</div>
      {!noMoreComments && !loading && (
        <button onClick={fetchMoreComments}>Load more</button>
      )}
      {noMoreComments && <p>All comments are loaded</p>}
      {loading && !noMoreComments && <div>Loading...</div>}
    </div>
  );
};

export default CommentBox;
