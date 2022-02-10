import { useAuth } from "../../src/context/AuthContext";
import { protectedRoutes } from "../../src/utils/protected-routes";
import { db } from "../../src/utils/init-firebase";

import { collection, addDoc, getDocs } from "firebase/firestore";

const Profile = () => {
  const { currentUser, currentUserProfile } = useAuth();

//   const db = getFirestore();
  const addDataToFireStore = async () => {
    try {
      console.log(db);
      const docRef = await addDoc(collection(db, "posts"), {
        title: "Ada",
        description: "Lovelace",
        userID: currentUserProfile.userID,
        user_displayName: currentUserProfile.displayName
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const fetchDataFromFireStore = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "posts"));
      querySnapshot.forEach((doc) => {
        //   console.log(doc.data())
        if (doc.data().user_id === currentUser.uid) {
          console.log(`${doc.id} => ${doc.data()}`);
        }
      });
    } catch (e) {
      console.error("Error querying document: ", e);
    }
  };

  return (
    <>
      <h1>Profile</h1>
      <pre>{JSON.stringify(currentUserProfile, null, 2)}</pre>
      <button onClick={addDataToFireStore}>Add data to firestore</button>
      <button onClick={fetchDataFromFireStore}>Fetch data from firestore</button>
    </>
  );
};

export default Profile;
