import {
  fetchMessagesByGroupID,
  getMessageSnapshotByID,
  fetchMoreMessagesByGroupID,
} from "../../../src/utils/firebase-adminhelpers";

const getMessagesByGroupId = async (req, res) => {
  const { params } = req.query;
  const messageGroupId = params[0];
  const cursor = params[1];

  try {
    if (messageGroupId) {
      if (cursor) {
        const docSnapshot = await getMessageSnapshotByID(
          messageGroupId,
          cursor
        );
        const records = await fetchMoreMessagesByGroupID(
          messageGroupId,
          docSnapshot
        );
        if (records.length !== 0) {
          res.json(records);
        } else {
          res.json([]);
        }
      }
      const records = await fetchMessagesByGroupID(messageGroupId);
      if (records.length !== 0) {
        res.json(records);
      } else {
        res.json([]);
      }
    } else {
      res.status(400);
      console.log('status 400')
      res.json([]);
    }
  } catch (err) {
    console.log('status 500')
    res.status(500);
    res.json([]);
  }
};

export default getMessagesByGroupId;
