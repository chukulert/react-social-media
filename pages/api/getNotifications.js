import { fetchNotificationsById } from "../../src/utils/firebase-adminhelpers";

const getNotifications = async (req, res) => {
    const { id } = req.query;

    try {
      if (id) {
        const records = await fetchNotificationsById(id);
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
  
  export default getNotifications;