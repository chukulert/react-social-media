import {
  fetchMoreFeed,
  fetchInitialFeedData,
} from "../../src/utils/firebase-adminhelpers";

const getFeed = async (req, res) => {
  if (req.method === "PUT") {
    const { userID, lastPost } = req.body;
    try {
      if (userID) {
        const records = await fetchMoreFeed(userID, lastPost);

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
        const records = await fetchInitialFeedData(id);
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
