
import { fetchGroupsByUser } from "../../../src/utils/firebase-adminhelpers";

const getMessageGroups = async (req, res) => {
  const { params } = req.query;
  const [userID, displayName, profilePhoto] = params
  // console.log(userID, displayName, profilePhoto)
    try {
      if (userID) {
        const records = await fetchGroupsByUser({userID, displayName, profilePhoto});
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
      res.status(500);
      res.json(null);
    }
  };
  
  export default getMessageGroups;