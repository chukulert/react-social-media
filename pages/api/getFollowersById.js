import {
    fetchFollowersData,
    fetchUserProfile,
  } from "../../src/utils/firebase-adminhelpers";
  
  const getFollowersById = async (req, res) => {
    const { id } = req.query;
  
    try {
      if (id) {
        const user = await fetchUserProfile(id);
        const records = await fetchFollowersData(user.followers);
        if (records.length !== 0) {
          res.status(200).json(records);
        } else {
          res.json([]);
        }
      } else {
        res.status(400);
        res.json({ message: "Id is missing" });
      }
    } catch (err) {
      res.status(500);
      res.json({ message: "Something went wrong", err });
    }
  };
  
  export default getFollowersById;