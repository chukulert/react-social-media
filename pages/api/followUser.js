import {
  updateFollowUser,
  fetchUserPosts,
  updatePostFollowing
} from "../../src/utils/firebase-adminhelpers";

const followUser = async (req, res) => {
  if (req.method === "PUT") {
    const { currentUserID, postUserID, type } = req.body;
    try {
      if (currentUserID) {
        //update user id to postuser's following, and update postuser's followers
        await updateFollowUser(currentUserID, postUserID, type);

        //fetch all of postuser's posts
        const posts = await fetchUserPosts(postUserID);
        console.log(posts)

        //update postusers posts' followers to add/remove userID
        const records = await Promise.all(
          posts.map(async (post) => {
            updatePostFollowing(currentUserID, post.id, type);
          })
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

export default followUser;
