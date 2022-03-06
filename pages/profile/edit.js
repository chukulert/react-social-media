import { useState, useEffect } from "react";
import Image from "next/image";
import { storage, db } from "../../src/utils/init-firebase";
import { setDoc, doc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useRouter } from "next/router";
import nookies from "nookies";
import { verifyToken } from "../../src/utils/init-firebaseAdmin";
import { fetchUserProfile } from "../../src/utils/firebase-adminhelpers";

import React from "react";
import {
  Formik,
  Field,
  Form,
  ErrorMessage,
  prepareDataForValidation,
} from "formik";
import * as Yup from "yup";

const EditProfile = ({ userProfile }) => {
  const router = useRouter();

  const submitHandler = async ({
    displayName,
    userSummary,
    profilePhoto,
    bannerPhoto,
  }) => {
    try {
      const setProfilePhoto = async () => {
        if (profilePhoto) {
          const storageRef = ref(storage, `/${userProfile.userID}/profile`);
          const uploadTask = await uploadBytesResumable(
            storageRef,
            profilePhoto
          );
          const fileURL = await getDownloadURL(uploadTask.ref);
          if (fileURL) {
            await setDoc(
              // `${currentUserProfile.userID}`,
              doc(db, "users", `${userProfile.userID}`),
              { profilePhoto: fileURL },
              { merge: true }
            );
          }
        }
      };
      const setBannerPhoto = async () => {
        if (bannerPhoto) {
          const storageRef = ref(storage, `/${userProfile.userID}/banner`);
          const uploadTask = await uploadBytesResumable(
            storageRef,
            bannerPhoto
          );
          const fileURL = await getDownloadURL(uploadTask.ref);
          if (fileURL) {
            await setDoc(
              doc(db, "users", `${userProfile.userID}`),
              { bannerPhoto: fileURL },
              { merge: true }
            );
          }
        }
      };

      const setProfileDetails = async () => {
        await setDoc(
          doc(db, "users", `${userProfile.userID}`),
          {
            displayName: displayName,
            userSummary: userSummary,
          },
          { merge: true }
        );
      };
      await Promise.all([
        setProfilePhoto(),
        setBannerPhoto(),
        setProfileDetails(),
      ]);
      router.push(`/profile/edit`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Formik
        enableReinitialize={true}
        initialValues={{
          displayName: `${userProfile.displayName}`,
          userSummary: `${userProfile.userSummary}`,
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
              src={userProfile.bannerPhoto || "/../../assets/no-user.png"}
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
              src={userProfile.profilePhoto || "/../../assets/no-user.png"}
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
      )
    </div>
  );
};

export async function getServerSideProps(context) {
  try {
    const cookies = nookies.get(context);
    const token = await verifyToken(cookies.token);
    const { uid, email } = token;
    console.log(uid, email);
    //this returns the user profile in firestore
    if (uid) {
      const userProfile = await fetchUserProfile(uid);
      return {
        props: {
          userProfile,
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

export default EditProfile;
