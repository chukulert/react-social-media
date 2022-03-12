import { createNewMessageGroup, fetchUserProfile} from "../../src/utils/firebase-adminhelpers";
import { db } from "../../src/utils/init-firebaseAdmin";

const createMessageGroup = async (req, res) => {
  if (req.method === "POST") {
    const {
      chatUserID,
      currentUserID,
      currentUserProfilePhoto,
      currentUserDisplayName,
    } = req.body;

    // console.log(chatUserID, currentUserID, currentUserDisplayName, currentUserProfilePhoto);
    try {
      if (currentUserID && chatUserID ) {
          const chatUser = await fetchUserProfile(chatUserID)
          const membersArray = [{
            displayName: currentUserDisplayName,
            id: currentUserID,
            profilePhoto: currentUserProfilePhoto
          }, {
            displayName: chatUser.displayName,
            id: chatUserID,
            profilePhoto: chatUser.profilePhoto
          }]
        const records = await createNewMessageGroup({
            membersArray, currentUserID
        });
        // console.log(messageData)
        // const data = await db.collection('messages').doc(records.id).set()
        // console.log(data)
        if (records.length !== 0) {
          res.json(records);
        } else {
          res.json({ message: `id could not be found` });
        }
      } else {
        res.status(400);
        res.json({ message: "Id is missing" });
      }
    } catch (err) {
      res.status(500);
      res.json({ message: "Something went wrong", err });
    }
  }
};

export default createMessageGroup;
