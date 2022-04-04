//react
import { useState } from "react";
//nextjs
import Image from "next/image";
//fireabse
import { storage, db } from "../../src/utils/init-firebase";
import { setDoc, doc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { verifyToken } from "../../src/utils/init-firebaseAdmin";
import { fetchUserProfile } from "../../src/utils/firebase-adminhelpers";
import nookies from "nookies";
//components
import Container from "../../src/components/Layout/Container";
//styles and icons
import styles from "../../styles/editpage.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faImage } from "@fortawesome/free-solid-svg-icons";
//toast
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
//fromik
import { Formik, Form, useField } from "formik";
import * as Yup from "yup";

const EditProfile = ({ userProfile }) => {
  const [newProfilePhoto, setNewProfilePhoto] = useState(null);
  const [newBannerPhoto, setNewBannerPhoto] = useState(null);

  library.add(faImage);

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
          const fileURL = await getDownloadURL(uploadTask.ref)

          if (fileURL) {
            await setDoc(
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
      toast.success("Profile saved!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const TextInput = ({ label, ...props }) => {
    const [field, meta] = useField(props);
    return (
      <>
        <label htmlFor={props.id || props.name}>{label}</label>
        {props.type === "text" && (
          <input className={styles.formInput} {...field} {...props} />
        )}
        {props.type === "textarea" && (
          <textarea
            className={`${styles.formInput} ${styles.textArea}`}
            {...field}
            {...props}
          />
        )}
        {meta.touched && meta.error ? (
          <div className={styles.formError}>{meta.error}</div>
        ) : null}
      </>
    );
  };

  const ProfilePhotoInput = ({ label, ...props }) => {
    const [field, meta] = useField(props);
    return (
      <div className={styles.imageLabelContainer}>
        <label htmlFor={props.id || props.name}>
          <div className={styles.uploadFileLabelContainer}>
            {newProfilePhoto && (
              <Image
                src={newProfilePhoto}
                alt="Uploaded Image"
                width="100%"
                height="100%"
                layout="responsive"
                objectFit="cover"
                className={styles.image}
              />
            )}
            {!newProfilePhoto && (
              <Image
                src={userProfile.profilePhoto}
                alt="Uploaded Image"
                width="100%"
                height="100%"
                layout="responsive"
                objectFit="cover"
                className={styles.image}
              />
            )}

            <div className={styles.imageOverlay}>
              <div className={styles.uploadFileLabel}>
                <FontAwesomeIcon icon="fa-solid fa-image" />
                <p>Upload new Image</p>
              </div>
            </div>
          </div>
        </label>
        <input className="hide" {...field} {...props} value={undefined} />
        {meta.touched && meta.error ? (
          <p className={styles.formError}>{meta.error}</p>
        ) : null}
      </div>
    );
  };

  const BannerPhotoInput = ({ label, ...props }) => {
    const [field, meta] = useField(props);
    return (
      <div className={styles.imageLabelContainer}>
        <label htmlFor={props.id || props.name}>
          <div className={styles.uploadFileLabelContainer}>
            {newBannerPhoto && (
              <Image
                src={newBannerPhoto}
                alt="Uploaded Image"
                width="100%"
                height="100%"
                layout="responsive"
                objectFit="cover"
                className={styles.image}
              />
            )}
            {!newBannerPhoto && (
              <Image
                src={userProfile.bannerPhoto}
                alt="Uploaded Image"
                width="100%"
                height="100%"
                layout="responsive"
                objectFit="cover"
                className={styles.image}
              />
            )}

            <div className={styles.imageOverlay}>
              <div className={styles.uploadFileLabel}>
                <FontAwesomeIcon icon="fa-solid fa-image" />
                <p>Upload new Image</p>
              </div>
            </div>
          </div>
        </label>
        <input className="hide" {...field} {...props} value={undefined} />
        {meta.touched && meta.error ? (
          <p className={styles.formError}>{meta.error}</p>
        ) : null}
      </div>
    );
  };

  return (
    <>
      <Container>
        <div className={styles.pageContainer}>
          <h1>Edit Profile</h1>
          <Formik
            enableReinitialize={true}
            initialValues={{
              displayName: `${userProfile.displayName}`,
              userSummary: `${userProfile.userSummary}`,
              bannerPhoto: "",
              profilePhoto: "",
            }}
            validationSchema={Yup.object({
              displayName: Yup.string()
                .required("Please enter a display name")
                .max(25, "Must be 25 characters or less"),
            })}
            onSubmit={(values) => {
              submitHandler({
                displayName: values.displayName,
                userSummary: values.userSummary,
                profilePhoto: values.profilePhoto,
                bannerPhoto: values.bannerPhoto,
              });
            }}
          >
            {(props) => (
              <Form className={styles.formContainer}>
                <h4>Profile Photo</h4>
                <ProfilePhotoInput
                  id="profilePhoto"
                  name="profilePhoto"
                  type="file"
                  accept="image/*"
                  label="Profile Photo"
                  onChange={(event) => {
                    const imageURL = URL.createObjectURL(
                      event.currentTarget.files[0]
                    );
                    setNewProfilePhoto(imageURL);
                    props.setFieldValue(
                      "profilePhoto",
                      event.currentTarget.files[0]
                    );
                  }}
                />
                <h4>Banner Photo</h4>
                <BannerPhotoInput
                  id="bannerPhoto"
                  name="bannerPhoto"
                  type="file"
                  accept="image/*"
                  label="Banner Photo"
                  onChange={(event) => {
                    const imageURL = URL.createObjectURL(
                      event.currentTarget.files[0]
                    );
                    setNewBannerPhoto(imageURL);
                    props.setFieldValue(
                      "bannerPhoto",
                      event.currentTarget.files[0]
                    );
                  }}
                />
                <h4>Display Name</h4>
                <TextInput
                  name="displayName"
                  type="text"
                  placeholder="Display Name"
                />
                <h4>Personal Summary</h4>
                <TextInput
                  name="userSummary"
                  type="textarea"
                  placeholder="Personal Summary"
                />
                <div className={styles.footer}>
                  <button type="submit" className={styles.submitBtn}>
                    Save
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
        <ToastContainer />
      </Container>
    </>
  );
};

export async function getServerSideProps(context) {
  try {
    const cookies = nookies.get(context);
    const token = await verifyToken(cookies.token);
    const { uid } = token;
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
