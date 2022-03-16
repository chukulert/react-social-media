import MessageInput from "./MessageInput";
import MessageItem from "./MessageItem";
import styles from "./MessageBoard.module.css";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
    faCaretLeft,
    faCommentDots
  } from "@fortawesome/free-solid-svg-icons";

const MessageBoard = (props) => {
  const {
    messages,
    handleLoadMore,
    submitMessageHandler,
    isReachingEnd,
    messageGroup,
    currentUserProfile,
    setShowFollowingModal,
  } = props;

  library.add(faCaretLeft, faCommentDots)

  const chatUser = messageGroup?.members.filter(
    (member) => member.id !== currentUserProfile.userID
  )[0];

  const messageItems = (
    <ul className={styles.messagesContent}>
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
    </ul>
  );
  const noMessageItems = !messageItems.props.children.length;

  return (
    <>
      <div className={styles.messageBoardHeader}>
        <div className={styles.flexCenter}><FontAwesomeIcon icon="fa-solid fa-caret-left" className={styles.backBtn} /></div>
        {chatUser && <div className={styles.profileDisplay}>
            <div className={styles.flexCenter}><Image src={chatUser.profilePhoto} alt='profile photo' width={50} height={50} className='avatar' /></div>
            <div className={styles.flexCenter}><p>{chatUser.displayName}</p></div> 
        </div> }
        <div className={styles.flexCenter}><FontAwesomeIcon icon="fa-solid fa-comment-dots" onClick={setShowFollowingModal} className={styles.newMessage} /></div>

      </div>
      <div className={styles.messageBoardContainer}>
        {messageGroup && isReachingEnd && noMessageItems && (
          <p className={styles.loadMoreBtn}>All messages are loaded.</p>
        )}
        {messageGroup && !isReachingEnd && !noMessageItems && (
          <p onClick={handleLoadMore} className={styles.loadMoreBtn}>
            Load more
          </p>
        )}

        {messageItems}
        {noMessageItems && !messageGroup && (
          <p className={styles.messageBoardIntroMessage}>
            Start a new conversation by entering a new message.
          </p>
        )}

        <MessageInput submitMessageHandler={submitMessageHandler} />
      </div>
    </>
  );
};

export default MessageBoard;
