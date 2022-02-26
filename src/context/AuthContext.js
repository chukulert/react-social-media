import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { auth, db } from "../utils/init-firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
  onIdTokenChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  confirmPasswordReset,
} from "firebase/auth";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import nookies from "nookies";

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

export const useAuth = () => useContext(AuthContext);

export default function AuthContextProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState(null);
  const [currentUserProfile, setCurrentUserProfile] = useState(null);
  const router = useRouter();

  //default useeffect
  // useEffect(() => {
  //   //when component mounts
  //   const unsubscribe = onAuthStateChanged(auth, (user) => {
  //     setCurrentUser(user ? user : null);
  //     user ? setUserProfile(user) : setCurrentUserProfile(null)
  //     // const idToken  = user._tokenresponse.idToken;
  //     const token = user.getIdToken
  //     console.log(token)
  //     console.log(user.getIdToken)
  //     console.log(user._tokenresponse)
  //   });
  //   //cleanup for when component unmounts
  //   return () => {
  //     unsubscribe();
  //   };
  // }, []);

  //with nookies
  useEffect(() => {
    const unsubscribe = async () => {
      onIdTokenChanged(auth, async (user) => {
        if (!user) {
          setCurrentUser(null);
          setCurrentUserProfile(null);
          nookies.set(undefined, "token", "", {});
          return;
        }
        const token = await user.getIdToken();
        setCurrentUser(user);
        setUserProfile(user)
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
      console.log(user)
      if (user) await user.getIdToken(true);
    }, 10 * 60 * 1000);

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

  const register = async (email, password) => {
    try {
      const newUser = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const newUserProfile = await setDoc(
        doc(db, "users", `${newUser.user.uid}`),
        {
          userID: newUser.user.uid,
          email: email,
          displayName: newUser.user.displayName || "",
          profilePhoto: newUser.user.photoURL,
          joinDate: newUser.user.metadata.creationTime,
          likedPosts: [],
          postsCounter: 0,
          friends: [],
          messagesCounter: 0,
          notifications: [],
          userSummary: "",
          private: false
        }
      );
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
      await signInWithPopup(auth, provider);
      router.push("/profile");
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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
