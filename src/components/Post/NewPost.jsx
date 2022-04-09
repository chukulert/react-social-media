import { useState } from "react";
import { db, storage } from "../../utils/init-firebase";
import { collection, addDoc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import FormModal from "../Form/FormModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import styles from "./NewPost.module.css";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NewPost = (props) => {
  const [showPostModal, setShowPostModal] = useState(false);
  const router = useRouter();

  const { userProfile } = props;

  library.add(faPlus);
  const handleShowPostModal = () => {
    showPostModal ? setShowPostModal(false) : setShowPostModal(true);
  };

  const newPostSubmitHandler = async ({ title, description, file }) => {
    try {
      //create post in firestore.
      const createPost = await addDoc(collection(db, "posts"), {
        user_id: userProfile.userID,
        title: title,
        description: description,
        created_at: Date.now(),
        likesCount: 0,
        commentsCount: 0,
        user_displayName: userProfile.displayName,
        user_profilePhoto: userProfile.profilePhoto,
        followers: [...userProfile.followers],
        deleted: false,
      });

      //if file exists, add to storage and update post
      if (file) {
        const storageRef = ref(
          storage,
          `/${userProfile.userID}/${createPost.id}`
        );
        const uploadTask = await uploadBytesResumable(storageRef, file);
        const fileURL = await getDownloadURL(uploadTask.ref);
        if (fileURL) {
          await setDoc(createPost, { image: fileURL }, { merge: true });
        }
      }
      toast.success("Post successfully submitted!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      router.push(`/profile/${userProfile.userID}`);

      handleShowPostModal();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <div onClick={handleShowPostModal} className={styles.button}>
        <FontAwesomeIcon
          icon="fa-solid fa-plus"
          className={styles.newPostBtn}
        />
        <span>New Post</span>
      </div>

      {showPostModal && (
        <FormModal
          closeModal={handleShowPostModal}
          submitFormHandler={newPostSubmitHandler}
        />
      )}
      <ToastContainer />
    </>
  );
};

export default NewPost;
