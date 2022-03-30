import { fetchMoreFeed, fetchInitialFeedData,  fetchPostDataById} from "../../../src/utils/firebase-adminhelpers";
  
  const getFeed = async (req, res) => {
    const { params } = req.query;
    const userID = params[0];
    const cursor = params[1];

    try {
      if (userID) {
        if (cursor) {
          const docSnapshot = await fetchPostDataById(cursor);
          const records = await fetchMoreFeed(userID, docSnapshot);
          if (records.length !== 0) {
            res.status(200).json(records);
          } else {
            res.json([]);
          }
        } else {
        const records = await fetchInitialFeedData(userID);
        if (records.length !== 0) {
          res.json(records);
        } else {
          res.json([null]);
        }
      }}
    } catch (err) {
      res.status(500);
      res.json({ message: "Something went wrong", err });
    }
  };
  
  export default getFeed;
  