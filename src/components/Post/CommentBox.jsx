import { useState } from "react";
import styles from "./Comment.module.css";
import Comment from "./Comment";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../utils/init-firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  setDoc,
  query,
  where,
} from "firebase/firestore";
import { fetcher, isEmpty } from "../../utils";
import useSWR from "swr";

const CommentBox = (props) => {
  const [displayComments, setDisplayComments] = useState(false);
  const [likedPost, setLikedPost] = useState(false)
  const { currentUserProfile } = useAuth();
  const [likes, setLikes] = useState(props.likesCount);
  const [comments, setComments] = useState(props.comments)

  const postID = props.id;

  const showComments = () => {
    displayComments ? setDisplayComments(false) : setDisplayComments(true);
  };


  const { data, error } = useSWR(`/api/getPostById?id=${postID}`, fetcher);

  useEffect(() => {
    if (data && data.length > 0) {
      setCoffeeStore(data[0]);

      setVotingCount(data[0].voting);
    }
  }, [data]); 







  const submitLikePost = async () => {
    console.log(props.likesCount)
      try {
        await setDoc(
          doc(db, "users", `${currentUserProfile.userID}`),
          {
            likedPosts: [...currentUserProfile.likedPosts, postID],
          },
          { merge: true }
        );
        await setDoc(
          doc(db, "posts", `${postID}`),
          {
            likesCount: props.likesCount + 1,
          },            
          { merge: true }
        );
        setLikedPost(true)
      } catch (error) {
        console.error(error);
      }
  };

  const commentList = (
    <div >
        {comments.map((comment) => (
            <Comment
                key={post.id}
                id={post.id}
                userID={post.user_id}
      
            />
        ))
        }
    </div>
)




  return (
    <div className={styles.commentContainer}>
      <div className={styles.commentHeader}>
        <button onClick={likedPost? submitLikePost : submitUnlikePost }>Like Post</button>
        <button onClick={showComments}>Show Comments</button>
        <span>Likes: {props.likesCount}</span>
      </div>
      {displayComments && <div className={styles.commentBox}>Comments</div>}
    </div>
  );
};

export default CommentBox;
