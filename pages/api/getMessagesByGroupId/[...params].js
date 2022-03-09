import {
  fetchMessagesByGroupID,
  getMessageSnapshotByID,
  fetchMoreMessagesByGroupID
} from "../../../src/utils/firebase-adminhelpers";

const getMessagesByGroupId = async (req, res) => {
  const { params } = req.query;
  const messageGroupId = params[0];
  const cursor = params[1];
  // console.log(cursor)
  try {
    if (messageGroupId) {
      if (cursor) {
        const docSnapshot = await getMessageSnapshotByID(
          messageGroupId,
          cursor
        );
        // console.log(docSnapshot)
        const records = await fetchMoreMessagesByGroupID(
          messageGroupId,
          docSnapshot
        );
        console.log(records)
        if (records.length !== 0) {
          res.json(records);
        } else {
          console.log('something wrong here')
        }
      }
      const records = await fetchMessagesByGroupID(messageGroupId);
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

export default getMessagesByGroupId;
