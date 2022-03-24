import { fetchNotificationsById } from "../../src/utils/firebase-adminhelpers";

const getNotifications = async (req, res) => {
    const { id } = req.query;
    console.log({id})
    console.log('YES YES YES ')
    try {
      if (id) {
        const records = await fetchNotificationsById(id);
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
  
  export default getNotifications;