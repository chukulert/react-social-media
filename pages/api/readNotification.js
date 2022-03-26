import {
  readNotification,
  readAllNotifications,
} from "../../src/utils/firebase-adminhelpers";

const submitMessage = async (req, res) => {
  if (req.method === "POST") {
    const { id, sent_user_id, link, user_id, notifications } = req.body;

    try {
      if (notifications) {
        const records = await readAllNotifications(notifications);
        if (records.length !== 0) {
          res.json(records);
        } else {
          res.json({ message: `notifications could not be found` });
        }
      } else {
        const records = await readNotification({sent_user_id, user_id, link});
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
