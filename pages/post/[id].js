//nexdtjs
import Head from "next/head";
//firebase admin
import {
  fetchAllPosts,
  fetchPostDataById,
} from "../../src/utils/firebase-adminhelpers";
//components
import PostCard from "../../src/components/Post/PostCard";
//auth
import { useAuth } from "../../src/context/AuthContext";
//styles
import styles from '../../src/components/Post/Post.module.css'

export async function getStaticProps(staticProps) {
  const postId = staticProps.params.id;
  const postData = await fetchPostDataById(postId);
  return {
    props: {
      postData,
    },
}
}

//get static paths which are paths that can be found
export async function getStaticPaths() {
  const allPosts = await fetchAllPosts();
  const paths = allPosts.map((post) => {
    return {
      params: {
        id: post.id,
      },
    };
  });
  return {
    paths,
    fallback: true,
  };
}

const PostPage = ( {postData }) => {
    const {currentUserProfile} = useAuth()

  return (
    <>
    <Head>
    <title>{postData.user_displayName}&apos;s Post</title>
    <meta name="description" content="Post" />
    {/* <link rel="icon" href="/favicon.ico" /> */}
    </Head>
      <main className={styles.container}>
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
          currentUserProfile={currentUserProfile}
        />
      </main>
    </>
  );
};

// export async function getServerSideProps(context) {
//   try {
//     const postId = context.params.id;
//     const cookies = nookies.get(context);
//     console.log(cookies)
//     // console.log(context)
//     const token = await verifyToken(cookies.token);
//     const { uid } = token;

//     if (uid) {
//       const userProfile = await fetchUserProfile(uid);
//       const postData = await fetchPostDataById(postId);
//       return {
//         props: {
//           userProfile,
//           postData,
//         },
//       };
//     } else {
//       const postData = await fetchPostDataById(postId);
//       return {
//         props: {
//           postData,
//         },
//       };
//     }
//   } catch (err) {
//     console.log(err);
//     context.res.writeHead(302, { Location: "/login" });
//     context.res.end();
//     return { props: {} };
//   }
// }

export default PostPage;
