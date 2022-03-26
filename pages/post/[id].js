//firebase admin
import { verifyToken } from "../../src/utils/init-firebaseAdmin";
import nookies from "nookies";
import {
  fetchUserProfile,
  fetchPostDataById,
} from "../../src/utils/firebase-adminhelpers";
//components
import NavBar from "../../src/components/Nav/NavBar";
import PostCard from "../../src/components/Post/PostCard";
//styles
import styles from '../../src/components/Post/Post.module.css'

// export async function getStaticProps(staticProps) {
//   const userID = staticProps.params.id;

//   const userProfile = await fetchUserProfile(userID);
//   const posts = await fetchUserPosts(userID);

//   return {
//     props: {
//       postUser: userProfile,
//       posts: posts,
//     },
//   };
// }

// //get static paths which are paths that can be found
// export async function getStaticPaths() {
//   const allUsers = await fetchAllUsers();
//   const paths = allUsers.map((user) => {
//     return {
//       params: {
//         id: user.userID,
//       },
//     };
//   });
//   return {
//     paths,
//     fallback: true,
//   };
// }

const postPage = ({ userProfile, postData }) => {
  return (
    <>
      <NavBar currentUserProfile={userProfile} />
      <div className={styles.container}>
        <PostCard
          key={postData.id}
          id={postData.id}
          userID={postData.user_id}
          displayName={postData.user_displayName}
          profilePhoto={postData.user_profilePhoto}
          image={postData.image}
          title={postData.title}
          description={postData.description}
          created_at={postData.created_at}
          likesCount={postData.likesCount}
          postCommentsCount={postData.commentsCount}
          currentUserProfile={userProfile}
        />
      </div>
    </>
  );
};

export async function getServerSideProps(context) {
  try {
    const postId = context.params.id;
    const cookies = nookies.get(context);
    console.log(cookies)
    // console.log(context)
    const token = await verifyToken(cookies.token);
    const { uid } = token;

    if (uid) {
      const userProfile = await fetchUserProfile(uid);
      const postData = await fetchPostDataById(postId);
      return {
        props: {
          userProfile,
          postData,
        },
      };
    } else {
      const postData = await fetchPostDataById(postId);
      return {
        props: {
          postData,
        },
      };
    }
  } catch (err) {
    console.log(err);
    context.res.writeHead(302, { Location: "/login" });
    context.res.end();
    return { props: {} };
  }
}

export default postPage;
