import {
  readNotification,
  readAllNotifications,
} from "../../src/utils/firebase-adminhelpers";

const submitMessage = async (req, res) => {
  if (req.method === "POST") {
    const { id, notifications } = req.body;

    try {
      if (notifications) {
        const records = await readAllNotifications(notifications);
        if (records.length !== 0) {
          res.json(records);
        } else {
          res.json({ message: `userid could not be found` });
        }
      } else {
        const records = await readNotification(id);
        if (records.length !== 0) {
          res.json(records);
        } else {
          res.json({ message: `notification id could not be found` });
        }
      }
    } catch (err) {
      res.status(500);
      res.json({ message: "Something went wrong", err });
    }
  }
};

export default submitMessage;
