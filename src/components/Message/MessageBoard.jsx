import MessageInput from "./MessageInput";
import MessageItem from "./MessageItem";
import styles from './MessageBoard.module.css'

const MessageBoard = (props) => {
  const {
    messages,
    handleLoadMore,
    submitMessageHandler,
    isReachingEnd,
    messageGroup,
    currentUserProfile,
  } = props;

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
        <div>Back Button</div>
    <div>Messages</div>
    <div>New Message</div>
    </div>
     <div className={styles.messageBoardContainer}>
    {messageGroup && isReachingEnd && noMessageItems &&
        <p className={styles.loadMoreBtn}>All messages are loaded.</p>}
    {messageGroup && !isReachingEnd && !noMessageItems &&
        <p onClick={handleLoadMore} className={styles.loadMoreBtn}>Load more</p>}
    
      {messageItems}
      {noMessageItems && !messageGroup && (
        <p className={styles.messageBoardIntroMessage}>Start a new conversation by entering a new message.</p>
      )}
   
      <MessageInput submitMessageHandler={submitMessageHandler} />
    
    </div>
    </>
  );
};

export default MessageBoard;
