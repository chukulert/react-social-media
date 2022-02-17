import { useState, useEffect } from "react";
import { useAuth } from "../../src/context/AuthContext";
import Image from "next/image";
import { storage, db } from "../../src/utils/init-firebase";
import { setDoc, doc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useRouter } from "next/router";

import React from "react";
import {
  Formik,
  Field,
  Form,
  ErrorMessage,
  prepareDataForValidation,
} from "formik";
import * as Yup from "yup";

const EditProfile = () => {
  //   const [displayName, setDisplayName] = useState(null);
  //   const [profilePhoto, setProfilePhoto] = useState(null);
  //   const [userSummary, setUserSummary] = useState("");
  //   const [bannerPhoto, setBannerPhoto] = useState(null);
  const router = useRouter()

  const { currentUserProfile } = useAuth();
  console.log(currentUserProfile);

  const submitHandler = async ({
    displayName,
    userSummary,
    profilePhoto,
    bannerPhoto,
  }) => {
    try {
        console.log(profilePhoto, bannerPhoto)
      if (profilePhoto) {
        const storageRef = ref(
          storage,
          `/${currentUserProfile.userID}/profile-${profilePhoto.name}`
        );
        const uploadTask = await uploadBytesResumable(storageRef, profilePhoto);
        const fileURL = await getDownloadURL(uploadTask.ref);
        if (fileURL) {
          await setDoc(
            // `${currentUserProfile.userID}`,
            doc(db, "users", `${currentUserProfile.userID}`),
            { profilePhoto: fileURL },
            { merge: true }
          );
        }
      }
      
      if (bannerPhoto) {
        const storageRef = ref(
          storage,
          `/${currentUserProfile.userID}/banner-${bannerPhoto.name}`
        );
        const uploadTask = await uploadBytesResumable(storageRef, bannerPhoto);
        const fileURL = await getDownloadURL(uploadTask.ref);
        if (fileURL) {
          await setDoc(
            doc(db, "users", `${currentUserProfile.userID}`),
            { bannerPhoto: fileURL },
            { merge: true }
          );
        }
      }

      const newUserProfile = await setDoc(
        doc(db, "users", `${currentUserProfile.userID}`),
        {
          displayName: displayName,
          userSummary: userSummary,
        },
        { merge: true }
      );
    //   router.push(`/profile/${currentUserProfile.userID}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {currentUserProfile && (
        <Formik
          enableReinitialize={true}
          initialValues={{
            displayName: `${currentUserProfile.displayName}`,
            userSummary: `${currentUserProfile.userSummary}`,
            bannerPhoto: "",
            profilePhoto: "",
          }}
          //   validationSchema={Yup.object({
          //     email: Yup.string().email("Invalid email address").required("Required"),
          //     password: Yup.string()
          //       .min(5, "Must be 5 characters or more")
          //       .required("Required"),
          //   })}
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {
              alert(JSON.stringify(values, null, 2));
              setSubmitting(false);
            }, 400);
            let profilePhoto;
            const profilePhotoInput = document.getElementById("profilePhoto");
            if (profilePhotoInput.files[0]) {
              profilePhoto = profilePhotoInput.files[0];
            }
            let bannerPhoto;
            const bannerPhotoInput = document.getElementById("bannerPhoto");
            if (bannerPhotoInput.files[0]) {
              bannerPhoto = bannerPhotoInput.files[0];
            }
            submitHandler({
              displayName: values.displayName,
              userSummary: values.userSummary,
              profilePhoto: profilePhoto,
              bannerPhoto: bannerPhoto,
            });
          }}
        >
          <Form>
            <label htmlFor="bannerPhoto">
              <Image
                src={
                  currentUserProfile.bannerPhoto || "/../../assets/no-user.png"
                }
                width={100}
                height={100}
                alt="Banner photo"
              />
            </label>
            <Field
              id="bannerPhoto"
              name="bannerPhoto"
              type="file"
              accept="image/*"
            />
            <ErrorMessage name="bannerPhoto" />

            <label htmlFor="profilePhoto">
              <Image
                src={
                  currentUserProfile.profilePhoto || "/../../assets/no-user.png"
                }
                width={100}
                height={100}
                alt="Profile photo"
              />
            </label>
            <Field
              id="profilePhoto"
              name="profilePhoto"
              type="file"
              accept="image/*"
            />
            <ErrorMessage name="profilePhoto" />

            <label htmlFor="displayName">Display Name</label>
            <Field name="displayName" type="text" />
            <ErrorMessage name="displayName" />

            <label htmlFor="userSummary">Summary</label>
            <Field name="userSummary" type="text" />
            <ErrorMessage name="userSummary" />

            <button type="submit">Submit</button>
          </Form>
        </Formik>
      )}
    </div>
  );
};

export default EditProfile;
