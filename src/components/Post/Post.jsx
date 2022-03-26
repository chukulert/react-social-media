import PostCard from "./PostCard";
import styles from "./Post.module.css";

const Post = ({ posts, currentUserProfile }) => {
  const postItems = (
    <div>
      {posts.map((post) => (
        <PostCard
          key={post.id}
          id={post.id}
          userID={post.user_id}
          displayName={post.user_displayName}
          profilePhoto={post.user_profilePhoto}
          image={post.image}
          title={post.title}
          description={post.description}
          created_at={post.created_at}
          likesCount={post.likesCount}
          postCommentsCount={post.commentsCount}
          currentUserProfile={currentUserProfile}
        />
      ))}
    </div>
  );

  return <div className={styles.container}>{postItems}</div>;
};

export default Post;
