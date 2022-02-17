import PostCard from "./PostCard";
import Container from "../Layout/Container";
import styles from './Post.module.css'


const Post = ({user, posts}) => {
    const postItems = (
        <div >
            {posts.map((post) => (
                <PostCard
                    key={post.id}
                    id={post.id}
                    userID={user.userID}
                    displayName={user.displayName}
                    profilePhoto={user.profilePhoto}
                    image={post.image}
                    title={post.title}
                    description={post.description}
                    created_at={post.created_at}
                />
            ))
            }
        </div>
    )

    return (
        <div className={styles.container}>
            {postItems}
        </div>
    )
}

export default Post;