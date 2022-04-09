import PostCard from "./PostCard";
import styles from "./Post.module.css";
import { useState, useEffect } from "react";

const Post = ({ posts, currentUserProfile, setElement, isLoadingMore }) => {
  const [postItems, setPostItems] = useState([]);

  useEffect(() => {
    posts ? setPostItems(posts) : null;
  }, [posts]);

  const deletePost = async (id) => {
      console.log('deleting post')
    const response = await fetch(`/api/deletePost`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
      }),
    });
    if (response.ok) {
      const filteredPostItems = postItems.filter((post) => post.id !== id);
      setPostItems(filteredPostItems);
    }
  };

  const currentPostItems = (
    <div>
      {postItems.map((post, i) => (
        <PostCard
          key={post?.id || null}
          id={post?.id}
          userID={post?.user_id}
          displayName={post?.user_displayName}
          profilePhoto={post?.user_profilePhoto}
          image={post?.image}
          title={post?.title}
          description={post?.description}
          created_at={post?.created_at}
          likesCount={post?.likesCount}
          postCommentsCount={post?.commentsCount}
          currentUserProfile={currentUserProfile}
          deletePost={deletePost}
          //   ref={posts.length - 1 === i ? setElement : null}
          //   ref={setElement}
        />
      ))}
    </div>
  );

  return (
    <>
      {posts[0] !== null && (
        <div className={styles.container}>{currentPostItems}</div>
      )}
      {postItems.length === 0 && !isLoadingMore && <div className={styles.container}><h3>No posts available.</h3></div>}
    </>
  );
};

export default Post;
