import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { auth, db } from "../utils/init-firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
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

  useEffect(() => {
    //when component mounts
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user ? user : null);
      console.log(user)
      user ? setUserProfile(user) : setCurrentUserProfile(null)
    });
    //cleanup for when component unmounts
    return () => {
      unsubscribe();
    };
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
      router.push("/profile");
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
          displayName: newUser.user.displayName || '',
          profilePhoto: newUser.user.photoURL,
          joinDate: newUser.user.metadata.creationTime,
          likedPosts: [],
          postsCounter: 0,
          friends: [],
          messagesCounter: 0,
          notifications: [],
          bannerPhoto: '',
          userSummary: '',
        }
      );
      setError(null);
      router.push("/profile");
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
