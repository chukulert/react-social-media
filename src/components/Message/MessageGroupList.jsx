import MessageGroupItem from "./MessageGroupItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCaretLeft, faCommentDots } from "@fortawesome/free-solid-svg-icons";
import styles from "./MessageBoard.module.css";
import Loader from "../Loader/Loader";

const MessageGroup = (props) => {
  const {
    messageGroups,
    currentUserProfile,
    handleMessageGroupClick,
    handleShowModal,
    width,
    allUsers,
    isLoading
  } = props;


  library.add(faCaretLeft, faCommentDots);

  const messageGroupList = (
    <ul>
      {messageGroups?.map((group) => (
        <MessageGroupItem
          messageGroup={group}
          key={group.id}
          id={group.id}
          currentUserProfile={currentUserProfile}
          handleMessageGroupClick={handleMessageGroupClick}
          allUsers={allUsers}
        />
      ))}
    </ul>
  );

  return (
    <div>
    <div className={styles.messageGroupContainer}>
      {width < 768 && (
        <div className={styles.messageBoardHeader}>
            <h3 className={styles.flexCenter}>Messages</h3>
            <div className={styles.flexCenter}>
          <FontAwesomeIcon
            icon="fa-solid fa-comment-dots"
            onClick={handleShowModal}
            className={styles.newMessage}
          />
          </div>
        </div>
      )}
        {isLoading && <div className={styles.loader}><Loader /></div>}
      {messageGroupList}
      </div>
    </div>
  );
};

export default MessageGroup;
