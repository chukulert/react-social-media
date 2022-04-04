import { fetchGroupsByUser } from "../../../src/utils/firebase-adminhelpers";

const getMessageGroups = async (req, res) => {
  const { params } = req.query;
  const [userID] = params;
  try {
    if (userID) {
      const records = await fetchGroupsByUser(userID);
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
    console.error(error);
    res.status(500);
    res.json(null);
  }
};

export default getMessageGroups;
