//swr
import useSWR from "swr";
import useSWRInfinite from "swr/infinite";
import { fetcher } from "../src/utils";
import Head from "next/head";
//react
import { useState, useEffect } from "react";
//components
import MessageUserModal from "../src/components/Message/MessageGroupModal";
import MessageBoard from "../src/components/Message/MessageBoard";
import MessageGroup from "../src/components/Message/MessageGroupList";
import { useAuth } from "../src/context/AuthContext";
//firebase admin and veritifcation
import { verifyToken } from "../src/utils/init-firebaseAdmin";
import nookies from "nookies";
import {
  fetchUserProfile,
  fetchAllUsersData,
} from "../src/utils/firebase-adminhelpers";
//styles and icons
import styles from "../src/components/Message/MessageBoard.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCommentDots } from "@fortawesome/free-solid-svg-icons";
//custom hooks
import useWindowSize from "../src/hooks/useWindowSize";

const MessagesPage = ({ userProfile, allUsersData }) => {
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
    return () => {
      setShowMessageBoard(true);
    };
  }, [width]);

  const {
    data: messageGroups,
    error: messageGroupsError,
    mutate: mutateMessageGroups,
  } = useSWR(
    userProfile ? `/api/getMessageGroups/${userProfile.userID}` : null,
    fetcher
  );

  const isLoadingInitialMessageGroupsData =
    !messageGroups && !messageGroupsError;

  const { data: following, error: followersError } = useSWR(
    userProfile ? `/api/getFollowingById?id=${userProfile.userID}` : null,
    fetcher,
    {
      revalidateIfStale: true,
      revalidateOnFocus: true,
    }
  );

  //   if (followersError) return <div>failed to load</div>;
  //   if (!following) return <div>loading...</div>;

  const scrollToBottom = () => {
    const messageBottom = document.getElementById("messagesEndRef");
    if (messageBottom) {
      messageBottom.scrollIntoView();
    }
  };

  //check for group if exists? store in a state. fetch messages
  const handleFollowingClick = async (e) => {
    setShowUserModal(false);
    setMessageGroup(null);
    setHasUser(true);
    const userID = e.currentTarget.id;

    //1. check if group exists between user and clicked object
    const group = messageGroups?.find((group) => {
      return group.members.some((obj) => obj === userID);
    });
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

  const handleMessageGroupClick = (e) => {
    const messageGroupID = e.currentTarget.id;
    const group = messageGroups.find((group) => messageGroupID === group.id);
    if (group) {
      setMessageGroup(group);
      setTempUser(null);
      setHasUser(true);
    } else {
      mutateMessageGroups();
    }
    scrollToBottom();
    //change to messageboard display
    if (width < 768) toggleMessageBoardDisplay();
  };

  const handleShowModal = () => {
    showUserModal ? setShowUserModal(false) : setShowUserModal(true);
  };

  return (
    <>
      <Head>
        <title>Connect Me</title>
        <meta name="Connect Me" content="Social Media App connecting users" />
        <link rel="icon" href="/favicon.png" />
      </Head>
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
            allUsers={allUsersData}
            isLoading={isLoadingInitialMessageGroupsData}
          />
        )}
        {showMessageBoard && hasUser && (
          <MessageBoard
            messageGroup={messageGroup}
            messageGroups={messageGroups}
            currentUserProfile={userProfile}
            setShowFollowingModal={handleShowModal}
            width={width}
            toggleMessageBoardDisplay={toggleMessageBoardDisplay}
            tempUser={tempUser}
            allUsers={allUsersData}
            scrollToBottom={scrollToBottom}
            setMessageGroup={setMessageGroup}
            setTempUser={setTempUser}
            mutateMessageGroups={mutateMessageGroups}
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
      const allUsersData = await fetchAllUsersData(uid);
      return {
        props: {
          userProfile: userProfile,
          allUsersData: allUsersData ? allUsersData : [],
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
