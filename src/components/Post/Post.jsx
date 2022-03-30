import PostCard from "./PostCard";
import styles from "./Post.module.css";

const Post = ({ posts, currentUserProfile, setElement }) => {
  const postItems = (
    <div>
      {posts.map((post, i) => (
        <PostCard
          key={post?.id}
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
        //   ref={posts.length - 1 === i ? setElement : null}
        //   ref={setElement}
        />
      ))}
    </div>
  );

  return <div className={styles.container}>{postItems}</div>;
};

export default Post;
