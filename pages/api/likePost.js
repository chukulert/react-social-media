
import { updateLikePost } from "../../src/utils/firebase-adminhelpers";

const likePost = async (req, res) => {
    if (req.method === "PUT") {
    const { uid, postId, type } = req.body;
    console.log(uid, postId, type)
    try {
      if (uid) {
        const records = await updateLikePost(uid, postId, type);
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
  
  export default likePost;