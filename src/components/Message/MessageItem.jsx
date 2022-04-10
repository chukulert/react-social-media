import styles from "./MessageItem.module.css";
import Loader from "../Loader/Loader";

const MessageItem = (props) => {
  const { id, messageText, currentUserProfile, sent_at, sent_by } = props;

  const messageStyle =
    currentUserProfile.userID === sent_by
      ? ` ${styles.messageBubble} ${styles.currentUserText} `
      : `${styles.messageBubble} ${styles.othersText}`;
  //need a timestamp

  return (
    <div id={id} className={messageStyle}>
      <div className={styles.flex}>{messageText}<span>{!sent_at && <Loader messageLoader={true} />}</span></div>
    </div>
  );
};

export default MessageItem;
