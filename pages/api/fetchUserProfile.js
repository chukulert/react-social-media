import { fetchUserProfile } from "../../src/utils/firebase-adminhelpers";

const getUserProfile = async (req, res) => {
  const { id } = req.query;

  try {
    if (id) {
      const records = await fetchUserProfile(id);
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
};

export default getUserProfile;
