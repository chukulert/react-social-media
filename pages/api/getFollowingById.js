import {
  fetchFollowingData,
  fetchUserProfile,
} from "../../src/utils/firebase-adminhelpers";

const getFollowingById = async (req, res) => {
  const { id } = req.query;

  try {
    if (id) {
      const user = await fetchUserProfile(id);
      const records = await fetchFollowingData(user.following);
      if (records.length !== 0) {
        res.json(records);
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

export default getFollowingById;
