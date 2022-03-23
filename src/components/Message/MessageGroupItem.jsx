import Image from "next/image";
import { timeAgo } from "../../utils";
import styles from "./MessageGroupItem.module.css";
import Link from "next/link";

const MessageGroupItem = (props) => {
  const { messageGroup, currentUserProfile, handleMessageGroupClick, id } =
    props;

  const date = timeAgo(messageGroup.last_message?.created_at);

  const chatUser = messageGroup.members.filter(
    (member) => member.id !== currentUserProfile.userID
  )[0];

  return (
    <div
      onClick={handleMessageGroupClick}
      id={id}
      className={styles.messageGroupItemContainer}
    >
      {chatUser.profilePhoto !== "null" && (
        <Image
          src={chatUser.profilePhoto}
          alt={"User profile photo"}
          width={50}
          height={50}
          className="avatar"
        />
      )}
      <div className={styles.messageGroupContent}>
        <div className={styles.messageGroupNameGroup}>
        <Link href={`/profile/${chatUser.id}`} ><a className={styles.profileLink}>{chatUser.displayName}</a></Link>
          <div className={styles.lastMessage}>{date}</div>
        </div>
        {/* <p>{messageGroup.groupName}</p> */}
        <div className={styles.lastMessage}>
          {messageGroup.last_message?.textContent}
        </div>
      </div>
    </div>
  );
};

export default MessageGroupItem;
