import { fetchGroupByUserArray } from "../../src/utils/firebase-adminhelpers";


const getGroupByUsers = async (req, res) => {
    if (req.method === "PUT") {
      const { userArray } = req.body;

      try {
        if (userArray) {
          //update user id to postuser's following, and update postuser's followers
          const records = await fetchGroupByUserArray(userArray)
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

  export default getGroupByUsers