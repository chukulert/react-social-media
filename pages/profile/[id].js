import { useAuth } from "../../src/context/AuthContext";
import { useRouter } from "next/router";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../src/utils/init-firebase";
import { useState, useEffect } from "react";
import NewPostForm from "../../src/components/NewPostForm";

const ProfilePage = () => {
  const [postUser, setPostUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const router = useRouter();
  const {currentUser} = useAuth();

  //fetch posts of the current user page
  const getUserPosts = async (id) => {
    try {
      const userPosts = [];
      const q = query(collection(db, "posts"), where("user_id", "==", id));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        userPosts.push(doc.data());
      });
      setPosts(userPosts);
    } catch (e) {
      console.error(e);
    }
  };

  //fetch user data of the current user page
  const getUserData = async (id) => {
    try {
      //   if (id) {
      const docRef = doc(db, "users", `${id}`);
      const userProfile = await getDoc(docRef);
      if (userProfile.exists()) {
        setPostUser(userProfile.data());
        // }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const submitHandler = async ({title, description}) => {
      try {
        const docRef = await addDoc(collection(db, "posts"), {
            user_id: currentUser.uid,
            title: title,
            description: description,
            created_at: Date.now(),
          });
      } catch (e) {
        console.error(e)
      }
    
  }

  //load page user and posts when router query returns an id
  useEffect(() => {
    const { id } = router.query;
    if (id) {
      getUserData(id);
      getUserPosts(id);
    }
    return () => {
      setPostUser(null);
      setPosts([]);
    };
  }, [router.query]);

  return (
    <>
      {postUser && <div>{JSON.stringify(postUser)}</div>}
      {posts && <div>{JSON.stringify(posts)}</div>}
    
    <NewPostForm submitHandler={submitHandler}/>

    
    </>
  );
};

export default ProfilePage;
