
import { postNewMessage } from "../../src/utils/firebase-adminhelpers";

const submitMessage = async (req, res) => {
    if (req.method === "POST") {
    const { sent_by, messageText, messageGroupID } = req.body;

    try {
      if (sent_by) {
        const records = await postNewMessage({ sent_by, messageText, messageGroupID });
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
  }};
  
  export default submitMessage;