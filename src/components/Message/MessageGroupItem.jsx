import Image from "next/image";
import { timeAgo } from "../../utils";
import styles from "./MessageGroupItem.module.css";
import Link from "next/link";
import { useEffect, useState } from "react";


const MessageGroupItem = (props) => {
  const {
    messageGroup,
    currentUserProfile,
    handleMessageGroupClick,
    id,
    allUsers,
  } = props;
  const [chatUser, setChatUser] = useState(null);

  useEffect(() => {
    const chatUserID = messageGroup.members.find(
      (user) => user !== currentUserProfile.userID
    );
    const chatUser = allUsers.find((user) => user.userID === chatUserID);
    setChatUser(chatUser);
  }, []);

  const date = timeAgo(messageGroup.last_message?.created_at);

  return (
    <div
      onClick={handleMessageGroupClick}
      id={id}
      className={styles.messageGroupItemContainer}
    >
      {chatUser && chatUser.profilePhoto !== "null" && (
        <Image
          src={chatUser.profilePhoto}
          alt={"User profile photo"}
          width={50}
          height={50}
          className="avatar"
        />
      )}
      {chatUser && <div className={styles.messageGroupContent}>
        <div className={styles.messageGroupNameGroup}>
          <Link href={`/profile/${chatUser.userID}`}>
            <a className={styles.profileLink}>{chatUser.displayName}</a>
          </Link>
          <div className={styles.lastMessage}>{date}</div>
        </div>
        {/* <p>{messageGroup.groupName}</p> */}
        <div className={styles.lastMessage}>
          {messageGroup.last_message?.textContent}
        </div>
      </div>}
    </div>
  );
};

export default MessageGroupItem;
