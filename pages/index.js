import Head from "next/head";
import { useAuth } from "../src/context/AuthContext";
import NewPostForm from "../src/components/NewPostForm";
import { db, storage } from "../src/utils/init-firebase";
// import { addPost } from "../lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  setDoc,
  query,
  where,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useState } from "react";

export default function Home() {
  // const {currentUser} = useContext(AuthContext)
  const { currentUser } = useAuth();
  const [progress, setProgress] = useState(0);

//   const addDoc = async ({title, description}) => {
//     await addDoc(collection(db, "posts"), {
//      user_id: currentUser.uid,
//      title: title,
//      description: description,
//      created_at: Date.now(),
//      image: fileURL || null
//    });
//  };

  // const uploadFile = async ({file, title, description}) => {

  //   if (file !== '') {
  //   const storageRef = ref(storage, `/${currentUser.uid}/${file.name}`);
  //   const uploadTask =  await uploadBytesResumable(storageRef, file);
  //   const fileURL =  await getDownloadURL(uploadTask.ref)
  //   await addDoc({title, description, fileURL})
  //   } else {
  //     await addDoc({title, description})
  //   }
    // uploadTask.on(
    //   "state_changed",
    //   (snapshot) => {
    //     const uploadProgress = Math.round(
    //       (snapshot.bytesTransferred / snapshot.totalBytes) * 100
    //     );
    //     setProgress(uploadProgress);
    //   },
    //   (error) => console.log(error),
    //   () => {
    //     getDownloadURL(uploadTask.snapshot.ref).then((url) => url);
    //   }
    // );
  // };

  

  const newPostSubmitHandler = async ({ title, description, file }) => {
    try {
      
      //create post in firestore
      const createPost = await addDoc(collection(db, "posts"), {
        user_id: currentUser.uid,
        title: title,
        description: description,
        created_at: Date.now(),
      });

      //if file exists, add to storage and update post 
      if (file !== '') {
          const storageRef = ref(storage, `/${currentUser.uid}/${createPost.id}`);
          const uploadTask =  await uploadBytesResumable(storageRef, file);
          const fileURL =  await getDownloadURL(uploadTask.ref)
          if (fileURL) {
            await setDoc(createPost, {image: fileURL}, {merge: true})
          }

      }

    } catch (e) {
      console.error(e);
    }
  };
  return (
    <div>
      <div>This is the homepage</div>
      {currentUser && <div>{`The current user is ${currentUser}`}</div>}

      {currentUser && <NewPostForm submitHandler={newPostSubmitHandler} />}
      {currentUser && <h3>Uploaded{progress}%</h3>}
    </div>
  );
}
