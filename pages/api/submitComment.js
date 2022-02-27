
import { postNewComment } from "../../src/utils/firebase-adminhelpers";

const submitComment = async (req, res) => {
    if (req.method === "POST") {
    const { user_id, user_displayName, user_profilePhoto, content, postID } = req.body;
    console.log(user_id, user_displayName, user_profilePhoto, content )
    try {
      if (user_id) {
        const records = await postNewComment({user_id, user_displayName, user_profilePhoto, content, postID} );
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
  
  export default submitComment;