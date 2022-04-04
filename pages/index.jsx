//nextjs
import Head from "next/head";
import dynamic from "next/dynamic";
//cpmponents
import HomeSideTab from "../src/components/HomeSideTab/HomeSideTab";
//firebase
import { verifyToken } from "../src/utils/init-firebaseAdmin";
import nookies from "nookies";
import {
  fetchAllUsersData,
  fetchUserProfile,
} from "../src/utils/firebase-adminhelpers";
//styles and icons
import styles from "../styles/pages.module.css";
const DynamicLoadHomeFeed = dynamic(
  () => import('../src/components/Post/HomeFeed'),
  { loading: () => <p>Loading...</p> }
)

export default function Home(props) {
  const { userProfile, allUsersData } = props;

  return (
    <>
      <Head>
        <title>Connect Me</title>
        <meta name="Connect Me" content="Social Media App connecting users" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <main className={styles.container}>
        {userProfile && (
          <HomeSideTab userProfile={userProfile} allUsersData={allUsersData} />
        )}
        <DynamicLoadHomeFeed userProfile={userProfile}/>    
      </main>
    </>
  );
}

export async function getServerSideProps(context) {
  try {
    const cookies = nookies.get(context);
    const token = await verifyToken(cookies.token);
    const { uid } = token;
    if (uid) {
      const userProfile = await fetchUserProfile(uid);
      // const followingData = await fetchFollowingData(userProfile.following);
      // const followersData = await fetchFollowingData(userProfile.followers);
      const allUsersData = await fetchAllUsersData(uid);
      return {
        props: {
          userProfile: userProfile,
          allUsersData: allUsersData ? allUsersData : [],
        },
      };
    }
    return {
      props: {},
    };
  } catch (err) {
    console.log(err);
    context.res.writeHead(302, { Location: "/login" });
    context.res.end();
    return { props: {} };
  }
}
