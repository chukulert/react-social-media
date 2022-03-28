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
import styles from "../../src/components/Post/Post.module.css";

export async function getStaticProps(staticProps) {
  const postId = staticProps.params.id;
  const postData = await fetchPostDataById(postId);
  return {
    props: {
      postData: postData ? postData : {},
    },
  };
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

const PostPage = ({ postData }) => {
  const { currentUserProfile } = useAuth();
    console.log(postData)
  return (
    <>
      <Head>
        <title>
          {postData?.user_displayName ? postData?.user_displayName : null}&apos;s
          Post
        </title>
        <meta name="description" content="Post" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.container}>
        <PostCard
          key={postData?.id ? postData?.id : null}
          id={postData?.id ? postData?.id : null}
          userID={postData?.user_id ? postData?.user_id : null}
          displayName={
            postData?.user_displayName ? postData?.user_displayName : null
          }
          profilePhoto={
            postData?.user_profilePhoto ? postData?.user_profilePhoto : null
          }
          image={postData?.image ? postData?.image : null}
          title={postData?.title ? postData?.title : null}
          description={postData?.description ? postData?.description : null}
          created_at={postData?.created_at ? postData?.created_at : null}
          likesCount={postData?.likesCount ? postData?.likesCount : null}
          postCommentsCount={
            postData?.commentsCount ? postData?.commentsCount : null
          }
          currentUserProfile={currentUserProfile ? currentUserProfile : null}
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
