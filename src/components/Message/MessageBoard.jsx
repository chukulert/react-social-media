import { useState, useEffect, useRef } from "react";
import MessageInput from "./MessageInput";
import MessageItem from "./MessageItem";
import styles from "./MessageBoard.module.css";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCaretLeft, faCommentDots } from "@fortawesome/free-solid-svg-icons";
import Loader from "../Loader/Loader";
import useSWR from "swr";
import useSWRInfinite from "swr/infinite";
import { fetcher } from "../../utils";

const MessageBoard = (props) => {
  const [chatUser, setChatUser] = useState(null);
//   const [tempMessage, setTempMessage] = useState([]);

  const {
    messageGroup,
    messageGroups,
    currentUserProfile,
    setShowFollowingModal,
    width,
    toggleMessageBoardDisplay,
    tempUser,
    allUsers,
    scrollToBottom,
    setMessageGroup,
    setTempUser,
    mutateMessageGroups
  } = props;

//   console.log({messageGroup, currentUserProfile,tempUser })

  library.add(faCaretLeft, faCommentDots);

  const getKey = (pageIndex, previousPageData) => {
    // first page, we don't have `previousPageData`
    if (pageIndex === 0) return `/api/getMessagesByGroupId/${messageGroup.id}`;

    // add the cursor to the API endpoint
    return `/api/getMessagesByGroupId/${messageGroup.id}/${previousPageData[14]?.id}`;
  };

  const {
    data: messages,
    error: messagesError,
    size,
    setSize,
    mutate: mutateMessages,
  } = useSWRInfinite(messageGroup ? getKey : null, fetcher, {
    refreshInterval: 1000,
    revalidateIfStale: true,
    revalidateOnFocus: true,
  });
  console.log(messages)
  const messageList = messages ? [].concat(...messages) : [];
  const isLoadingInitialData = !messages && !messagesError;
  const isLoadingMoreMessages =
    isLoadingInitialData ||
    (size > 0 && messages && typeof messages[size - 1] === "undefined");
  const isEmpty = messages?.[0]?.length === 0;
  const isReachingEnd =
    isEmpty || (messages && messages[messages.length - 1]?.length < 15);

  const handleLoadMoreMessages = () => {
    setSize(size + 1);
  };

  const submitMessageHandler = async (messageText) => {
    //problems refactoring for both situations
    //1. If there is no message group, create a new message group and send a new message and notification
    //2. If there is a message group, send a new message and notification

    try {
      if (messageGroup) {
        const newMessage = {
            messageText,
            sent_by: currentUserProfile.userID,
          };
        // //   const updatedMessages = [ ...messages, newMessage ]
        // //   const options = { optimisticData: updatedMessages, rollbackOnError: true }
        const chatUserID = messageGroup.members.find(
          (member) => member !== currentUserProfile.userID
        );
        const submitMessage = async () => {
          await fetch(`/api/submitMessage`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              sent_by: currentUserProfile.userID,
              messageText,
              messageGroupID: messageGroup.id,
            }),
          });
        };
        const createNotification = async () => {
          await fetch(`/api/createNotification`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              sent_user_id: currentUserProfile.userID,
              sent_user_displayName: currentUserProfile.displayName,
              user_id: chatUserID,
              link: `/messages`,
              type: "message",
              message: `${currentUserProfile.displayName} sent you a message.`,
            }),
          });
        };
        await Promise.all([submitMessage(), createNotification()]);
        mutateMessages([newMessage, ...messages]);
        scrollToBottom();
      } else {
        const newMessage = {
          messageText,
          sent_by: currentUserProfile.userID,
        };
        mutateMessages([newMessage]);
        // setTempMessage((prevState) => [newMessage, ...prevState]);
        const response = await fetch(`/api/createMessageGroup`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chatUserID: tempUser.userID,
            currentUserID: currentUserProfile.userID,
          }),
        });
        const groupData = await response.json();
        setMessageGroup(groupData);
        setTempUser(null);
        mutateMessageGroups();

        //does not send a message if this block of code is not here
        const submitMessage = async () => {
          await fetch(`/api/submitMessage`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              sent_by: currentUserProfile.userID,
              messageText,
              messageGroupID: groupData.id,
            }),
          });
        };
        const createNotification = async () => {
          await fetch(`/api/createNotification`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              sent_user_id: currentUserProfile.userID,
              sent_user_displayName: currentUserProfile.displayName,
              user_id: tempUser.userID,
              link: `/messages`,
              type: "message",
              message: `${currentUserProfile.displayName} sent you a message.`,
            }),
          });
        };
        await Promise.all([submitMessage(), createNotification()]);
        // mutateMessages([newMessage]);
        // setTempMessage([]);
        scrollToBottom();
      }
      scrollToBottom();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    scrollToBottom();
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
  }, [messageGroup, tempUser]);

  const messageItems = (
    <div className={styles.messagesContent}>
      {[...messageList]?.reverse().map((message) => (
        <MessageItem
          key={message.id}
          id={message.id}
          messageText={message.messageText}
          currentUserProfile={currentUserProfile}
          sent_by={message.sent_by}
          sent_at={message.sent_at}
        />
      ))}
      {/* {tempMessage?.map((message, i) => (
        <MessageItem
          key={i}
          messageText={message.messageText}
          currentUserProfile={currentUserProfile}
          sent_by={message.sent_by}
        />
      ))} */}
    </div>
  );

  const noMessageItems = !messageItems.props.children[0]?.length;

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
        {/* dummydiv */}
        <div className={910 > width > 768 ? "hide" : null}></div>
        {/* Chat User icon */}
        {chatUser && (
          <div className={styles.profileDisplay}>
            <div className={styles.flexCenter}>
              <Image
                src={chatUser.profilePhoto || "/profile-photo.png"}
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
          <p onClick={handleLoadMoreMessages} className={styles.loadMoreBtn}>
            Load more
          </p>
        )}
        {isLoadingMoreMessages && !noMessageItems && (
          <div className={styles.loader}>
            <Loader />
          </div>
        )}
        {messageItems}
        {noMessageItems && !messageGroup && (
          <p className={styles.messageBoardIntroMessage}>
            Start a new conversation by entering a new message.
          </p>
        )}
        <div id="messagesEndRef"></div>
      </div>
      <MessageInput
        submitMessageHandler={submitMessageHandler}
        messageGroups={messageGroups}
      />
    </div>
  );
};

export default MessageBoard;
