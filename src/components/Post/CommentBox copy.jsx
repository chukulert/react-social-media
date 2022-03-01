import { useState, useEffect } from "react";
import styles from "./Comment.module.css";
import Comment from "./Comment";
import { useAuth } from "../../context/AuthContext";
import { fetcher, isEmpty } from "../../utils";
import useSWR from "swr";
import NewCommentForm from "../Form/NewCommentForm";
import useSWRInfinite from "swr/infinite";

const CommentBox = (props) => {
  // const [comments, setComments] = useState([]);
  const { currentUserProfile } = useAuth();

  //fetch all comments with inifinte scroll
  
  // const { data, error } = useSWR(`/api/getCommentsByPost?id=${props.postID}`, fetcher, {
  //   revalidateOnFocus: false,
  // });

  // useEffect(() => {
  //   if (data && data.length > 0) {
  //     console.log(data);
  //     setComments(data);
  //   }
  //   return () => {setComments([])}
  // }, [data]);
  const [repo, setRepo] = useState("reactjs/react-a11y");
  const [val, setVal] = useState(repo);
  const PAGE_SIZE = 2;

  const { data, error, mutate, size, setSize, isValidating } = useSWRInfinite(
    (index) =>
      `/api/getCommentsByPost?id=${props.postID}&page=${
        index + 1
      }`,
    fetcher
  );

  const comments = data ? [].concat(...data) : [];
  const isLoadingInitialData = !data && !error;
  const isLoadingMore =
    isLoadingInitialData ||
    (size > 0 && data && typeof data[size - 1] === "undefined");
  const isReachingEnd =
    isEmpty || (data && data[data.length - 1]?.length < PAGE_SIZE);
  const isRefreshing = isValidating && data && data.length === size;
 


  const commentItems = (
    <div>
      {comments.length !== 0 && comments.map((comment) => (
        <Comment
          key={comment.id}
          id={comment.id}
          userID={comment.user_id}
          displayName={comment.user_displayName}
          profilePhoto={comment.user_profilePhoto}
          content={comment.content}
          created_at={comment.created_at}
          likesCount={comment.likesCount}
          postID={props.postID}
        />
      ))}
    </div>
  );

  //handle add comment
  const submitCommentHandler = async ({ content }) => {
    if (currentUserProfile) {
      try {
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
      } catch {
        console.error(error);
      }
    }
  };

  const likeCommentHandler = () => {

  }

  return (
    <div>
      <NewCommentForm submitHandler={submitCommentHandler} />
      <div>Comment box {commentItems}</div>
      <div> 
        showing {size} page(s) of {isLoadingMore ? "..." : comments.length}{" "} comment(s){" "}
        <button
          disabled={isLoadingMore || isReachingEnd}
          onClick={() => setSize(size + 1)}
        >
          {isLoadingMore
            ? "loading..."
            : isReachingEnd
            ? "no more comments"
            : "load more"}
        </button>
        <button disabled={isRefreshing} onClick={() => mutate()}>
          {isRefreshing ? "refreshing..." : "refresh"}
        </button>
        <button disabled={!size} onClick={() => setSize(0)}>
          clear
        </button>
        </div>
    </div>
  );
};

export default CommentBox;
