import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { auth, db, storage } from "../utils/init-firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  onIdTokenChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  confirmPasswordReset,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import nookies from "nookies";
// import profileImage from '../../public/profile-photo.png'
// import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

//this is for other files to 'auto-detect' the functions available in context
const AuthContext = createContext({
  currentUser: null,
  signInWithGoogle: () => Promise,
  login: () => Promise,
  register: () => Promise,
  logout: () => Promise,
  forgotPassword: () => Promise,
  resetPassword: () => Promise,
});
// console.log(profileImage)
export const useAuth = () => useContext(AuthContext);

export default function AuthContextProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState(null);
  const [currentUserProfile, setCurrentUserProfile] = useState(null);
  const router = useRouter();

  //with nookies
  useEffect(() => {
    const unsubscribe = async () => {
      onIdTokenChanged(auth, async (user) => {
        if (!user) {
          // console.log({ user });
          // console.log({ auth });
          // console.log({ token });
          setCurrentUser(null);
          setCurrentUserProfile(null);
          nookies.set(undefined, "token", "", {});
          return;
        }
        const token = await user.getIdToken();
        setCurrentUser(user);
        setUserProfile(user);
        nookies.set(undefined, "token", token, {});
      });
    };
    unsubscribe();
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const handle = setInterval(async () => {
      const user = auth.currentUser;
      if (user) {
        const token = await user.getIdToken(true);
        nookies.set(undefined, "token", token, {});
      }
    }, 9 * 60 * 1000);

    // clean up setInterval
    return () => clearInterval(handle);
  }, []);

  async function setUserProfile(user) {
    try {
      const docRef = doc(db, "users", `${user.uid}`);
      const userProfile = await getDoc(docRef);
      if (userProfile.exists()) {
        setCurrentUserProfile(userProfile.data());
      }
    } catch (e) {
      setError(e);
    }
  }

  const login = async (email, password) => {
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      setError(null);
      router.push("/");
    } catch (error) {
      console.error("Something went wrong", error);
      setError(error.message);
    }
  };

  const setNewUserDoc = async (newUser) => {
    await setDoc(doc(db, "users", newUser.user.uid), {
      userID: newUser.user.uid,
      email: newUser.user.email,
      displayName: newUser.user.displayName || newUser.user.email.split("@")[0],
      profilePhoto: newUser.user.photoURL ? newUser.user.photoURL : "",
      bannerPhoto: newUser.user.photoURL ? newUser.user.photoURL : "",
      joinDate: newUser.user.metadata.creationTime,
      likedPosts: [],
      postsCounter: 0,
      following: ["Hzr3adm22COu85Qhd8wC6LRwrCF3"],
      followers: [],
      messagesCounter: 0,
      notifications: [],
      userSummary: "",
      private: false,
    });

    // if (!newUser.user.photoURL) {
    //   console.log('no profile photo!!!!!')
    //   const setProfilePhoto = async () => {
    //       const storageRef = ref(storage, `/${newUser.user.uid}/profile`);
    //       const uploadTask = await uploadBytesResumable(
    //         storageRef,
    //         profileImage
    //       );
    //       const fileURL = await getDownloadURL(uploadTask.ref);
    //       if (fileURL) {
    //         await setDoc(
    //           doc(db, "users", `${newUser.user.uid}`),
    //           { profilePhoto: fileURL },
    //           { merge: true }
    //         );
    //       }
    //   };
    //   const setBannerPhoto = async () => {
    //     const storageRef = ref(storage, `/${newUser.user.uid}/banner`);
    //     const uploadTask = await uploadBytesResumable(storageRef, profileImage);
    //     const fileURL = await getDownloadURL(uploadTask.ref);
    //     if (fileURL) {
    //       await setDoc(
    //         doc(db, "users", `${newUser.user.uid}`),
    //         { bannerPhoto: fileURL },
    //         { merge: true }
    //       );
    //     }
    //   };
    //   await Promise.all([setProfilePhoto(), setBannerPhoto()]);
    // }
  };


  const createNewUserMessage = async (newUser) => {
    const response = await fetch(`/api/createMessageGroup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chatUserID: newUser.user.uid,
        currentUserID: "Hzr3adm22COu85Qhd8wC6LRwrCF3",
      }),
    });
    const groupData = await response.json();

    const submitMessage = async () => {
      await fetch(`/api/submitMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sent_by: "Hzr3adm22COu85Qhd8wC6LRwrCF3",
          messageText: "Hi, welcome to ConnectMe!",
          messageGroupID: groupData.id,
        }),
      });
    };
    const createNotification = async () => {
      await fetch(`/api/createNotification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sent_user_id: "Hzr3adm22COu85Qhd8wC6LRwrCF3",
          sent_user_displayName: "Daniel Tan",
          user_id: newUser.user.uid,
          link: `/messages`,
          type: "message",
          message: "Daniel Tan sent you a message.",
        }),
      });
    };
    await Promise.all([submitMessage(), createNotification()]);
  };

  const register = async (email, password) => {
    try {
      const newUser = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await Promise.all([
        setNewUserDoc(newUser),
        createNewUserMessage(newUser),
      ]);
      setError(null);
      router.push("/");
    } catch (error) {
      console.error("Something went wrong", error);
      setError(error.message);
    }
  };

  const forgotPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email, {
        url: `http://localhost:3000/login`,
      });
      setError(null);
      router.push("/login");
    } catch (error) {
      console.error("Something went wrong", error);
      setError(error.message);
    }
  };

  const resetPassword = async (oobCode, newPassword) => {
    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      setError(null);
      router.push("/login");
    } catch (error) {
      console.error("Something went wrong", error);
      setError(error.message);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setError(null);
      router.push("/");
    } catch (error) {
      console.error("Something went wrong", error);
      setError(error.message);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const response = await signInWithPopup(auth, provider);
      const docRef = doc(db, "users", `${response.user.uid}`);
      const userProfile = await getDoc(docRef);
      if (!userProfile.exists()) {
        await Promise.all([
          setNewUserDoc(response),
          createNewUserMessage(response),
        ]);
      }
      router.push("/");
    } catch (error) {
      console.error("Something went wrong", error);
      setError(error.message);
    }
  };

  const value = {
    currentUser,
    currentUserProfile,
    error,
    signInWithGoogle,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    error,
    setError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
