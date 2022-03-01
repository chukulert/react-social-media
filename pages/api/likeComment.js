
import { updateLikeComment } from "../../src/utils/firebase-adminhelpers";

const likeComment = async (req, res) => {
    if (req.method === "PUT") {
    const { uid, commentId, type } = req.body;
    // console.log(req.body)
    // console.log(uid, commentId, type)
    try {
      if (uid) {
        const records = await updateLikeComment(uid, commentId, type);
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
  
  export default likeComment;