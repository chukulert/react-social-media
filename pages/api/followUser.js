
import { updateFollowUser } from "../../src/utils/firebase-adminhelpers";

const followUser = async (req, res) => {
    if (req.method === "PUT") {
    const { currentUserID, postUserID, type } = req.body;
    console.log(currentUserID, postUserID, type)
    try {
      if (currentUserID) {
        const records = await updateFollowUser(currentUserID, postUserID, type);
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
  }};
  
  export default followUser;