import { createNewNotification } from "../../src/utils/firebase-adminhelpers";

const createNotification = async (req, res) => {
  if (req.method === "POST") {
    const {
      sent_user_id,
      sent_user_displayName,
      user_id,
      link,
      type,
      message,
    } = req.body;

    try {
      if (user_id) {
        const records = await createNewNotification({
          sent_user_id,
          sent_user_displayName,
          user_id,
          link,
          type,
          message,
        });
        if (records.length !== 0) {
          res.json(records).end();
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

export default createNotification;
