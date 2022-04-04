import { useState, useEffect, useCallback, useRef } from "react";
import MessageInput from "./MessageInput";
import MessageItem from "./MessageItem";
import styles from "./MessageBoard.module.css";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCaretLeft, faCommentDots } from "@fortawesome/free-solid-svg-icons";
import Loader from "../Loader/Loader";

const MessageBoard = (props) => {
  const [chatUser, setChatUser] = useState(null);

  const {
    messages,
    handleLoadMore,
    submitMessageHandler,
    isReachingEnd,
    messageGroup,
    messageGroups,
    currentUserProfile,
    setShowFollowingModal,
    width,
    toggleMessageBoardDisplay,
    tempUser,
    allUsers,
    isLoading,
    scrollToBottom
  } = props;

  library.add(faCaretLeft, faCommentDots);

  useEffect(() => {
    if (messageGroup) {
      const groupChatUserID = messageGroup.members.find(
        (user) => user !== currentUserProfile.userID
      );
      const groupChatUser = allUsers.find(
        (user) => user.userID === groupChatUserID
      );
      setChatUser(groupChatUser);
    } else {
      setChatUser(tempUser);
    }
    scrollToBottom();
  }, [messageGroup, tempUser]);


  const messageItems = (
    <div className={styles.messagesContent}>
      {[...messages]?.reverse().map((message) => (
        <MessageItem
          key={message.id}
          id={message.id}
          messageText={message.messageText}
          currentUserProfile={currentUserProfile}
          sent_by={message.sent_by}
          sent_at={message.sent_at}
        />
      ))}
    </div>
  );
  const noMessageItems = !messageItems.props.children.length;

  return (
    <div className={styles.messageBoardContainer}>
      <div className={styles.messageBoardHeader}>
        {/* Back Button */}
        <div className={styles.flexCenter}>
          <FontAwesomeIcon
            icon="fa-solid fa-caret-left"
            className={width > 768 ? "hide" : `${styles.backBtn}`}
            onClick={toggleMessageBoardDisplay}
          />
        </div>
        {/* Chat User icon */}
        {chatUser && (
          <div className={styles.profileDisplay}>
            <div className={styles.flexCenter}>
              <Image
                src={chatUser.profilePhoto}
                alt="profile photo"
                width={50}
                height={50}
                className="avatar"
              />
            </div>
            {/* Chat User display name */}
            <div className={styles.flexCenter}>
              <p>{chatUser.displayName}</p>
            </div>
          </div>
        )}
        {/* Modal for following */}
        <div className={styles.flexCenter}>
          <FontAwesomeIcon
            icon="fa-solid fa-comment-dots"
            onClick={setShowFollowingModal}
            className={styles.newMessage}
          />
        </div>
      </div>
      <div
        className={
          messageGroups
            ? `${styles.messagesContainer}`
            : `${styles.messagesContainer} ${styles.singleContainer}`
        }
      >
        {isReachingEnd && (
          <p className={styles.loadMoreBtn}>All messages are loaded.</p>
        )}
        {!isReachingEnd && !noMessageItems && messageGroup && (
          <p
            onClick={handleLoadMore}
            className={styles.loadMoreBtn}
          >
            Load more
          </p>
        )}
        {isLoading && !noMessageItems && <Loader />}
        {messageItems}
        {noMessageItems && !messageGroup && (
          <p className={styles.messageBoardIntroMessage}>
            Start a new conversation by entering a new message.
          </p>
        )}
        <div id='messagesEndRef'></div>
      </div>
      <MessageInput
        submitMessageHandler={submitMessageHandler}
        messageGroups={messageGroups}
      />
    </div>
  );
};

export default MessageBoard;
