
import { updateDeletePost } from "../../src/utils/firebase-adminhelpers";

const deletePost = async (req, res) => {
    if (req.method === "PUT") {
    const { id } = req.body;
    try {
      if (id) {
        const records = await updateDeletePost(id)
        if (records.length !== 0) {
          res.status(200).end()
        } else {
          res.status(400).json({ message: `id could not be found` });
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
  
  export default deletePost;