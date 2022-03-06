import {
  fetchMoreFeed,
  fetchInitialFeedData,
} from "../../src/utils/firebase-adminhelpers";

const getFeed = async (req, res) => {
  if (req.method === "PUT") {
    const { userID, lastPost } = req.body;
      console.log('userID:',userID, 'lastPost:',lastPost)
    try {
      if (userID) {
        // const lastPostObj = JSON.parse(lastPost)
        //update user id to postuser's following, and update postuser's followers
        const records = await fetchMoreFeed(userID, lastPost);
        //   console.log('records:', records)
        // console.log(records)
        if (records.length !== 0) {
          res.status(200).json(records);
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
  if (req.method === "GET") {
    const { id } = req.query;
    try {
      if (id) {
        console.log(id)
        const records = await fetchInitialFeedData(id);
        console.log(records)
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

export default getFeed;
