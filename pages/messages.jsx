//swr
import useSWR from "swr";
import useSWRInfinite from "swr/infinite";
import { fetcher } from "../src/utils";
//react
import { useState, useEffect } from "react";
//components
import MessageUserModal from "../src/components/Message/MessageGroupModal";
import MessageBoard from "../src/components/Message/MessageBoard";
import MessageGroup from "../src/components/Message/MessageGroupList";
import NavBar from "../src/components/Nav/NavBar";
//firebase admin and veritifcation
import { verifyToken } from "../src/utils/init-firebaseAdmin";
import nookies from "nookies";
import { fetchUserProfile } from "../src/utils/firebase-adminhelpers";
//styles and icons
import styles from "../src/components/Message/MessageBoard.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCommentDots } from "@fortawesome/free-solid-svg-icons";
//custom hooks
import useWindowSize from "../src/hooks/useWindowSize";

const MessagesPage = ({ userProfile, switchTheme }) => {
  const [messageGroup, setMessageGroup] = useState(null);
  const [tempUser, setTempUser] = useState(false);
  const [hasUser, setHasUser] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showMessageBoard, setShowMessageBoard] = useState(true);
  const [showMessageGroup, setShowMessageGroup] = useState(true);
  const { width } = useWindowSize();

  library.add(faCommentDots);

  const toggleMessageBoardDisplay = () => {
    if (showMessageBoard) {
      setShowMessageBoard(false);
      setShowMessageGroup(true);
    } else {
      setShowMessageBoard(true);
      setShowMessageGroup(false);
    }
  };

  useEffect(() => {
    if (width) {
      width < 768 ? setShowMessageBoard(false) : setShowMessageBoard(true);
    }
  }, [width]);

  const getKey = (pageIndex, previousPageData) => {
    // first page, we don't have `previousPageData`
    if (pageIndex === 0) return `/api/getMessagesByGroupId/${messageGroup.id}`;

    // add the cursor to the API endpoint
    return `/api/getMessagesByGroupId/${messageGroup.id}/${previousPageData[14]?.id}`;
  };

  const {
    data: messageGroups,
    error: messageGroupsError,
    mutate: mutateMessageGroups,
  } = useSWR(
    userProfile
      ? `/api/getMessageGroups/${userProfile.userID}/${
          userProfile.displayName
        }/${encodeURIComponent(userProfile.profilePhoto)}`
      : null,
    fetcher
  );

  const { data: following, error: followersError } = useSWR(
    userProfile ? `/api/getFollowingById?id=${userProfile.userID}` : null,
    fetcher,
    {
      revalidateIfStale: true,
      revalidateOnFocus: false,
    }
  );

  const {
    data: messages,
    error: messagesError,
    size,
    setSize,
    mutate: mutateMessages,
  } = useSWRInfinite(messageGroup ? getKey : null, fetcher, {
    refreshInterval: 1000,
    revalidateIfStale: true,
  });

  const messageList = messages ? [].concat(...messages) : [];
  const isLoadingInitialData = !messages && !messagesError;
  const isLoadingMore =
    isLoadingInitialData ||
    (size > 0 && messages && typeof messages[size - 1] === "undefined");
  const isEmpty = messages?.[0]?.length === 0;
  const isReachingEnd =
    isEmpty || (messages && messages[messages.length - 1]?.length < 15);

  //   if (followersError) return <div>failed to load</div>;
  //   if (!following) return <div>loading...</div>;    

  //check for group if exists? store in a state. fetch messages
  const handleFollowingClick = async (e) => {
    setShowUserModal(false);
    setMessageGroup(null);
    setHasUser(true);
    const userID = e.currentTarget.id;

    //1. check if group exists between user and clicked object
    const group = messageGroups?.filter((group) => {
      return group.members.some((obj) => obj.id === userID);
    })[0];

    //2. store in group if exist
    if (group) {
      setMessageGroup(group);
      setTempUser(null);
    } else {
      const response = await fetch(`/api/fetchUserProfile?id=${userID}`);
      const fetchedUser = await response.json();
      setMessageGroup(null);
      setTempUser(fetchedUser);
    }
    if (width < 768) toggleMessageBoardDisplay();
  };

  const handleLoadMoreMessages = () => {
    setSize(size + 1);
  };

  const handleMessageGroupClick = async (e) => {
    const messageGroupID = e.currentTarget.id;
    const group = messageGroups.filter(
      (group) => messageGroupID === group.id
    )[0];
    if (group) {
      setMessageGroup(group);
      setTempUser(null);
      setHasUser(true);
    } else {
      mutateMessageGroups();
    }

    //change to messageboard display
    if (width < 768) toggleMessageBoardDisplay();
  };

  const submitMessageHandler = async (messageText) => {
    //problems refactoring for both situations
    //1. If there is no message group, create a new message group and send a new message and notification
    //2. If there is a message group, send a new message and notification
    try {
      if (userProfile && !messageGroup) {
        const response = await fetch(`/api/createMessageGroup`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chatUserID: tempUser.userID,
            chatUserProfilePhoto: tempUser.profilePhoto,
            chatUserDisplayName: tempUser.displayName,
            currentUserID: userProfile.userID,
            currentUserProfilePhoto: userProfile.profilePhoto,
            currentUserDisplayName: userProfile.displayName,
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
              sent_by: userProfile.userID,
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
              sent_user_id: userProfile.userID,
              sent_user_displayName: userProfile.displayName,
              user_id: tempUser.userID,
              link: `/messages`,
              type: "message",
              message: `${userProfile.displayName} sent you a message.`,
            }),
          });
        };
        await Promise.all([submitMessage(), createNotification()]);
        mutateMessages();
      }

      if (userProfile && messageGroup) {
        const chatUser = messageGroup.members.filter(
          (member) => member.id !== userProfile.userID
        )[0];
        const submitMessage = async () => {
          await fetch(`/api/submitMessage`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              sent_by: userProfile.userID,
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
              sent_user_id: userProfile.userID,
              sent_user_displayName: userProfile.displayName,
              user_id: chatUser.userID,
              link: `/messages`,
              type: "message",
              message: `${userProfile.displayName} sent you a message.`,
            }),
          });
        };
        await Promise.all([submitMessage(), createNotification()]);
      }
      mutateMessages();
    } catch (error) {
      console.error(error);
    }
  };

  const handleShowModal = () => {
    showUserModal ? setShowUserModal(false) : setShowUserModal(true);
  };

  return (
    <>
      <NavBar currentUserProfile={userProfile} switchTheme={switchTheme} />
      <div className={width < 768 ? null : `${styles.messagePageContainer}`}>
        {showUserModal && (
          <MessageUserModal
            handleUserClick={handleFollowingClick}
            usersList={following}
            handleShowModal={handleShowModal}
          />
        )}
        {showMessageGroup && (
          <MessageGroup
            handleMessageGroupClick={handleMessageGroupClick}
            messageGroups={messageGroups}
            currentUserProfile={userProfile}
            handleShowModal={handleShowModal}
            width={width}
          />
        )}
        {showMessageBoard && hasUser && (
          <MessageBoard
            messages={messageList}
            handleLoadMore={handleLoadMoreMessages}
            submitMessageHandler={submitMessageHandler}
            isReachingEnd={isReachingEnd}
            messageGroup={messageGroup}
            currentUserProfile={userProfile}
            setShowFollowingModal={handleShowModal}
            width={width}
            toggleMessageBoardDisplay={toggleMessageBoardDisplay}
            tempUser={tempUser}
          />
        )}
        {showMessageBoard && !hasUser && (
          <div className={styles.emptyMessageBoard}>
            <p>Click on an existing conversation group to display messages.</p>
            <p className={styles.button} onClick={handleShowModal}>
              <FontAwesomeIcon
                icon="fa-solid fa-comment-dots"
                onClick={handleShowModal}
              />
              <span className={styles.flexCenter}>Show users</span>
            </p>
          </div>
        )}
        {!messageGroups && !showMessageBoard && (
          <div className={styles.emptyMessageBoardMobile}>
            <p>Start a new conversation.</p>
            <p className={styles.button} onClick={handleShowModal}>
              <FontAwesomeIcon
                icon="fa-solid fa-comment-dots"
                onClick={handleShowModal}
              />
              <span className={styles.flexCenter}>Show users</span>
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export async function getServerSideProps(context) {
  try {
    const cookies = nookies.get(context);
    const token = await verifyToken(cookies.token);
    const { uid } = token;
    if (uid) {
      const userProfile = await fetchUserProfile(uid);
      return {
        props: {
          userProfile: userProfile,
        },
      };
    } else {
      context.res.writeHead(302, { Location: "/login" });
      return { props: {} };
    }
  } catch (err) {
    console.log(err);
    context.res.writeHead(302, { Location: "/login" });
    context.res.end();
    return { props: {} };
  }
}

export default MessagesPage;
