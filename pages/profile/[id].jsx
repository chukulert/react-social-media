import { useState, useEffect } from "react";
import Post from "../../src/components/Post/Post";
import { verifyToken } from "../../src/utils/init-firebaseAdmin";
import nookies from "nookies";
import {
  fetchUserPosts,
  fetchUserProfile,
} from "../../src/utils/firebase-adminhelpers";
import ProfileSideTab from "../../src/components/ProfileSideTab/ProfileSideTab";

const ProfilePage = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isCurrentUserPage, setIsCurrentUserPage] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  const { profilePageUser, posts, userProfile } = props;

  //checking if current user is on his own profile page. If not, is profilepage user a followed user
  useEffect(() => {
    !profilePageUser ? setIsCurrentUserPage(true) : setIsCurrentUserPage(false);

    if (
      profilePageUser &&
      userProfile.following.includes(profilePageUser.userID)
    ) {
      setIsFollowing(true);
    } else {
      setIsFollowing(false);
    }

    return () => {};
  }, [profilePageUser]);

  const followUserHandler = async () => {
    if (userProfile) {
      try {
        const followUser = async () => {
          await fetch(`/api/followUser`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              currentUserID: userProfile.userID,
              postUserID: profilePageUser.userID,
              type: isFollowing ? "unfollow" : "follow",
            }),
          });
        };
        const createNotification = async () => {
          if (!isFollowing) {
            await fetch(`/api/createNotification`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                sent_user_id: userProfile.userID,
                sent_user_displayName: userProfile.displayName,
                user_id: profilePageUser.userID,
                link: `/profile/${userProfile.userID}`,
                type: "follow",
                message: `${userProfile.displayName} has followed you.`,
              }),
            });
          }
        };
        await Promise.all([followUser(), createNotification()]);
        isFollowing ? setIsFollowing(false) : setIsFollowing(true);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <>
      <ProfileSideTab
        profilePageUser={profilePageUser}
        followUserHandler={followUserHandler}
        isCurrentUserPage={isCurrentUserPage}
        isFollowing={isFollowing}
        userProfile={userProfile}
      />

      {isLoading && <h1>Loading...</h1>}
      {!isLoading && <Post posts={posts} currentUserProfile={userProfile} />}
      {/* For re-route from new post */}
    </>
  );
};

export async function getServerSideProps(context) {
  try {
    const profilePageId = context.params.id;
    const cookies = nookies.get(context);
    const token = await verifyToken(cookies.token);
    const { uid } = token;

    if (uid) {
      const userProfile = await fetchUserProfile(uid);
      if (uid === profilePageId) {
        const posts = await fetchUserPosts(uid);
        return {
          props: {
            userProfile,
            posts,
          },
        };
      } else {
        const profilePageUser = await fetchUserProfile(profilePageId);
        const posts = await fetchUserPosts(profilePageId);
        return {
          props: {
            userProfile,
            profilePageUser,
            posts,
          },
        };
      }
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

export default ProfilePage;
