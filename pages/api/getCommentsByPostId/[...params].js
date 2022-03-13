import { fetchPostComments, fetchMorePostComments, getCommentSnapshotByID } from "../../../src/utils/firebase-Adminhelpers";

const getCommentsByPost = async (req, res) => {
  const { params } = req.query;
  const postID = params[0];
  const cursor = params[1];

  console.log('PostID: ', postID, 'cursor:', cursor)

  try {
    if (postID) {
      if (cursor) {
        const docSnapshot = await getCommentSnapshotByID(cursor);
        // console.log(docSnapshot)
        const records = await fetchMorePostComments(postID, docSnapshot);
        console.log(records);
        if (records.length !== 0) {
          res.json(records);
        } else {
          console.log("something wrong here");
        }
      }
      const records = await fetchPostComments(postID);
      if (records.length !== 0) {
        res.json(records);
      } else {
        res.json(null);
      }
    } else {
      res.status(400);
      res.json(null);
    }
  } catch (err) {
    res.status(500);
    res.json(null)
    
  }
};
export default getCommentsByPost;
