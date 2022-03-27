import { useState, useEffect, useCallback, useRef } from "react";
import MessageInput from "./MessageInput";
import MessageItem from "./MessageItem";
import styles from "./MessageBoard.module.css";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCaretLeft, faCommentDots } from "@fortawesome/free-solid-svg-icons";

const MessageBoard = (props) => {
  const [element, setElement] = useState(null);
  const observer = useRef();
  const messagesEndRef = useRef();

  const {
    messages,
    handleLoadMore,
    submitMessageHandler,
    isReachingEnd,
    messageGroup,
    currentUserProfile,
    setShowFollowingModal,
    width,
    toggleMessageBoardDisplay,
    tempUser,
  } = props;

  library.add(faCaretLeft, faCommentDots);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView();
  };

  useEffect(() => {
    scrollToBottom();
  }, [messageGroup]);

  useEffect(() => {
    let currentElement;
    let currentObserver;
    observer.current = new IntersectionObserver(handleObserver, {
      threshold: 1,
    });
    currentElement = element;
    currentObserver = observer.current;

    if (currentElement) {
      currentObserver.observe(currentElement);
      console.log("observe");
    }
    return () => {
      if (currentElement) {
        currentObserver.disconnect();
      }
    };
  }, [messages]);

  const handleObserver = useCallback((entries) => {
    if (entries[0].isIntersecting) {
      console.log("yes");
      // handleLoadMore()
    }
  }, []);

  const chatUser = tempUser
    ? tempUser
    : messageGroup?.members.filter(
        (member) => member.id !== currentUserProfile.userID
      )[0];

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
      <div className={messageGroup || tempUser ? `${styles.messagesContainer}` : `${styles.messagesContainer} ${styles.singleContainer}` }>
        {isReachingEnd && (
          <p className={styles.loadMoreBtn}>All messages are loaded.</p>
        )}
        {!isReachingEnd && !noMessageItems && messageGroup && (
          <p
            onClick={handleLoadMore}
            className={styles.loadMoreBtn}
            ref={setElement}
          >
            Load more
          </p>
        )}
        {messageItems}
        {noMessageItems && !messageGroup && (
          <p className={styles.messageBoardIntroMessage}>
            Start a new conversation by entering a new message.
          </p>
        )}
        <div ref={messagesEndRef} />
      </div>
      <MessageInput submitMessageHandler={submitMessageHandler} tempUser={tempUser} messageGroup={messageGroup} />
    </div>
  );
};

export default MessageBoard;
