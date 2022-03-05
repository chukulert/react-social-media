import {
  updateFollowersFeed,
  fetchPostDataById,
} from "../../src/utils/firebase-adminhelpers";

const updateFeed = async (req, res) => {
  if (req.method === "PUT") {
    const { postID, userProfile } = req.body;
    try {
      if (userProfile) {
        //get post data
        const postData = await fetchPostDataById(postID);
        //loop through useprprofile followers, access the feed, edit the feed with promise.all
        const records = await updateFollowersFeed(
          userProfile,
          postData,
          postID
        );
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

export default updateFeed;
