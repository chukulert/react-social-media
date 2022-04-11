import {
    fetchUserPosts,
    updatePostUserDisplay,
  } from "../../src/utils/firebase-adminhelpers";
  
  const updateUserPosts = async (req, res) => {
    if (req.method === "PUT") {
      const { currentUserID, displayName, profilePhoto } = req.body;
  
      try {
        if (currentUserID) {
          //fetch all of postuser's posts
          const posts = await fetchUserPosts(currentUserID);
  
          //update postusers posts' followers to add/remove userID
          const records = await Promise.all(
            posts.map(async (post) => {
              updatePostUserDisplay({postID: post.id, displayName, profilePhoto});
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
  
  export default updateUserPosts;
  