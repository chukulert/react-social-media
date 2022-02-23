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
import { fetchAllUsers, fetchUserPosts, setUserProfile } from "../../src/utils/firebase-helpers";

export async function getStaticProps(staticProps) {
  const userID = staticProps.params.id;

  const userProfile = await setUserProfile(userID)
  const posts = await fetchUserPosts(userID)

  return {
    props: {
      postUser: userProfile,  posts: posts,
    },
  };
}

//get static paths which are paths that can be found
export async function getStaticPaths() {
  const allUsers = await fetchAllUsers()
  const paths = allUsers.map((user) => {
    return {
      params: {
        id: user.userID
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
  const [isCurrentUserPage, setIsCurrentUserPage] = useState(false);
  const [isFriend, setIsFriend] = useState(false);

  const {postUser, posts} = props
  // console.log(postUser1, posts1)

  // const router = useRouter();
  const { currentUserProfile } = useAuth();

  // const { id } = router.query;

  //fetching posts
  // useEffect(() => {
  //   const fetchPosts = async () => {
  //     setIsLoading(true);
  //     //   const { id } = router.query;
  //     if (id) {
  //       try {
  //         //get user profile of page visited
  //         const docRef = doc(db, "users", `${id}`);
  //         const userProfile = await getDoc(docRef);
  //         if (userProfile.exists()) {
  //           setPostUser(userProfile.data());
  //         }

  //         //get posts of user page
  //         const userPosts = [];
  //         const q = query(collection(db, "posts"), where("user_id", "==", id));
  //         const querySnapshot = await getDocs(q);
  //         querySnapshot.forEach((doc) => {
  //           //   const data = doc.data()
  //           const data = {
  //             ...doc.data(),
  //             id: doc.id,
  //           };
  //           // doc.data() is never undefined for query doc snapshots
  //           userPosts.push(data);
  //         });
  //         setPosts(userPosts);

  //         setIsLoading(false);
  //       } catch (error) {
  //         console.error(error);
  //       }
  //     }
  //     return () => {
  //       setPostUser(null);
  //       setPosts([]);
  //       setIsCurrentUserPage(false);
  //     };
  //   };
  //   fetchPosts();
  // }, [id]);

  //checking if current user is on his own profile page or is a friend of the user
  useEffect(() => {
    if (currentUserProfile) {
      if (postUser.userID === currentUserProfile.userID) {
        setIsCurrentUserPage(true);
      }
      if (currentUserProfile.friends.includes(postUser.userID)) {
        setIsFriend(true);
      }
    }

    return () => {
      setIsCurrentUserPage(false);
      setIsFriend(false);
    };
  }, [currentUserProfile, postUser.userID]);

  const addFriendHandler = async () => {
    try {
      if (currentUserProfile) {
        await setDoc(
          // `${currentUserProfile.userID}`,
          doc(db, "users", `${currentUserProfile.userID}`),
          { friends: [...currentUserProfile.friends, id] },
          { merge: true }
        );
      }
    } catch (error) {
      console.error(error);
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
      {!isLoading && !isFriend && !isCurrentUserPage && (
        <button onClick={addFriendHandler}>Add Friend</button>
      )}
      {!isLoading && (
        <Post
          user={postUser}
          posts={posts}
          currentUserPage={isCurrentUserPage}
        />
      )}
    </>
  );
};

export default ProfilePage;



