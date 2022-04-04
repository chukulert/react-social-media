import { createNewMessageGroup } from "../../src/utils/firebase-adminhelpers";

const createMessageGroup = async (req, res) => {
  if (req.method === "POST") {
    const { chatUserID, currentUserID } = req.body;

    console.log(chatUserID, currentUserID)
    try {
      if (currentUserID && chatUserID) {
        const membersArray = [currentUserID, chatUserID];
        const records = await createNewMessageGroup({
          membersArray,
          currentUserID,
        });
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
