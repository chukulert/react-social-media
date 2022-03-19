import { useState } from "react";
import { db, storage } from "../../utils/init-firebase";
import { collection, addDoc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import FormModal from "../Form/FormModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
faPlus
} from "@fortawesome/free-solid-svg-icons";
import styles from './NavNewPost.module.css'
import { useRouter } from "next/router";

const NavNewPost = (props) => {
    const [showPostModal, setShowPostModal] = useState(false);
    const router = useRouter()

    const {currentUserProfile} = props

    library.add(faPlus)
    const handleShowPostModal = () => {
        showPostModal ? setShowPostModal(false) : setShowPostModal(true)
      };


      const newPostSubmitHandler = async ({ title, description, file }) => {
        try {
          //create post in firestore. 
          const createPost = await addDoc(collection(db, "posts"), {
            user_id: currentUserProfile.userID,
            title: title,
            description: description,
            created_at: Date.now(),
            likesCount: 0,
            commentsCount: 0,
            user_displayName: currentUserProfile.displayName,
            user_profilePhoto: currentUserProfile.profilePhoto,
            followers: [...currentUserProfile.followers],
          });
    
          //if file exists, add to storage and update post
          if (file) {
            const storageRef = ref(
              storage,
              `/${currentUserProfile.userID}/${createPost.id}`
            );
            const uploadTask = await uploadBytesResumable(storageRef, file);
            const fileURL = await getDownloadURL(uploadTask.ref);
            if (fileURL) {
              await setDoc(createPost, { image: fileURL }, { merge: true });
            }
          }
          //doesnt work
          if (router.pathname == "/profile") {
              console.log('yes')
              router.push(`/profile/${currentUserProfile.uid}`)}
              handleShowPostModal()
            
        } catch (e) {
          console.error(e);
        }
      };
    

      return (
          <>
          <div onClick={handleShowPostModal} className={styles.navlink}>
           <FontAwesomeIcon icon="fa-solid fa-plus" />
           </div>
        
        {showPostModal && (
            <FormModal
              closeModal={handleShowPostModal}
              submitFormHandler={newPostSubmitHandler}
            />
          )}
          </>
      )
}

export default NavNewPost;