import { useAuth } from "../../src/context/AuthContext";
import { useRouter } from "next/router";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  where,
  setDoc,
} from "firebase/firestore";
import { db } from "../../src/utils/init-firebase";
import { useState, useEffect } from "react";
import Post from "../../src/components/Post/Post";
import Link from "next/link";
import {
  fetchAllUsers,
  fetchUserPosts,
  fetchUserProfile,
} from "../../src/utils/firebase-adminhelpers";
import { confirmPasswordReset } from "firebase/auth";

export async function getStaticProps(staticProps) {
  const userID = staticProps.params.id;

  const userProfile = await fetchUserProfile(userID);
  const posts = await fetchUserPosts(userID);

  return {
    props: {
      postUser: userProfile,
      posts: posts,
    },
  };
}

//get static paths which are paths that can be found
export async function getStaticPaths() {
  const allUsers = await fetchAllUsers();
  const paths = allUsers.map((user) => {
    return {
      params: {
        id: user.userID,
      },
    };
  });
  return {
    paths,
    fallback: true,
  };
}

const ProfilePage = (props) => {
  // const [postUser, setPostUser] = useState(null);
  // const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState("");
  const [isCurrentUserPage, setIsCurrentUserPage] = useState(false);
  const [isFollower, setIsFollower] = useState(false);

  const { postUser, posts } = props;
  // console.log(postUser1, posts1)

  // const router = useRouter();
  const { currentUserProfile } = useAuth();

  // const { id } = router.query;

  //checking if current user is on his own profile page or is a friend of the user
  useEffect(() => {
    const updateUser = async () => {
      const response = await fetch(
        `/api/fetchUserProfile?id=${currentUserProfile.userID}`
      );
      const fetchedUser = await response.json()
      if (postUser.userID === fetchedUser.userID) {
        setIsCurrentUserPage(true);
      }
      if (fetchedUser.following.includes(postUser.userID)) {
        setIsFollower(true);
      }
      setCurrentUser(fetchedUser);
    };
    if (currentUserProfile) {
      updateUser();
    }
    return () => {};
  }, []);

  const followUserHandler = async () => {
    if (currentUserProfile) {
      try {
        await fetch(`/api/followUser`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentUserID: currentUser.userID,
            postUserID: postUser.userID,
            type: isFollower ? "unfollow" : "follow",
          }),
        });
        if (isFollower) {
          setIsFollower(false);
        } else {
          setIsFollower(true);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <>
      {isCurrentUserPage && (
        <Link href="/profile/edit">
          <a>Edit Profile</a>
        </Link>
      )}
      {/* {postUser && <div>{JSON.stringify(postUser)}</div>}    */}
      {/* {posts && <div>{JSON.stringify(posts)}</div>} */}
      {isLoading && <h1>Loading...</h1>}
      {!isLoading && !isCurrentUserPage && (
        <button onClick={followUserHandler}>
          {isFollower ? "Unfollow" : "Follow"} User
        </button>
      )}
      {!isLoading && <Post posts={posts} currentUserPage={isCurrentUserPage} />}
    </>
  );
};

export default ProfilePage;
