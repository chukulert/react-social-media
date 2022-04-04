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
      {width < 768 && (
        <div className={styles.alignLeft}>
          <FontAwesomeIcon
            icon="fa-solid fa-comment-dots"
            onClick={handleShowModal}
            className={styles.newMessage}
          />
        </div>
      )}
        {isLoading && Loader}
      {messageGroupList}
    </div>
  );
};

export default MessageGroup;
