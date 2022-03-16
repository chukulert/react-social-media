import useSWR, { mutate, useSWRConfig } from "swr";
import useSWRInfinite from "swr/infinite";
import { fetcher } from "../src/utils";
import { useAuth } from "../src/context/AuthContext";
import { useState, useEffect } from "react";
import FollowingList from "../src/components/Message/FollowingList";
import FollowingModal from "../src/components/Friend/FollowingModal";
import MessageBoard from "../src/components/Message/MessageBoard";
import MessageGroup from "../src/components/Message/MessageGroupList";

const MessagesPage = () => {
  const { currentUserProfile } = useAuth();
  const [messageGroup, setMessageGroup] = useState(null);
  const [tempUser, setTempUser] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false)
//   const [showMessageBoard, ]

  const getKey = (pageIndex, previousPageData) => {

    // first page, we don't have `previousPageData`
    if (pageIndex === 0) return `/api/getMessagesByGroupId/${messageGroup.id}`;

    // add the cursor to the API endpoint
    return `/api/getMessagesByGroupId/${messageGroup.id}/${previousPageData[4]?.id}`;
  };

  const {
    data: messageGroups,
    error: messageGroupsError,
    mutate: mutateMessageGroups,
  } = useSWR(
    currentUserProfile
      ? `/api/getMessageGroups/${currentUserProfile.userID}/${
          currentUserProfile.displayName
        }/${encodeURIComponent(currentUserProfile.profilePhoto)}`
      : null,
    fetcher
  );

  const { data: following, error: followersError } = useSWR(
    currentUserProfile
      ? `/api/getFollowingById?id=${currentUserProfile.userID}`
      : null,
    fetcher, {
        // refreshInterval: 1000,
        revalidateIfStale: false,
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
    // refreshInterval: 1000,
  });

  const messageList = messages ? [].concat(...messages) : [];
  const isLoadingInitialData = !messages && !messagesError;
  const isLoadingMore =
    isLoadingInitialData ||
    (size > 0 && messages && typeof messages[size - 1] === "undefined");
  const isEmpty = messages?.[0]?.length === 0;
  const isReachingEnd =
    isEmpty || (messages && messages[messages.length - 1]?.length < 5);

//   if (followersError) return <div>failed to load</div>;
//   if (!following) return <div>loading...</div>;

  //check for group if exists? store in a state. fetch messages
  const handleFollowingClick = async (e) => {
    setShowFollowingModal(false)
    setMessageGroup(null);
    const userID = e.currentTarget.id;

    //1. check if group exists between user and clicked object
    const group = messageGroups.filter((group) => {
      return group.members.some((obj) => obj.id === userID);
    })[0];

    //2. store in group if exist
    if (group) {
      setMessageGroup(group);
      setTempUser(null);
    } else {
      setMessageGroup(null);
      setTempUser(userID);
    }

    //3. fetch messages if exist and show active on groupList

    //4. on frontend, change to reflect userdata on message board
  };

  const handleLoadMoreMessages = () => {
    setSize(size + 1);
  };

  const handleMessageGroupClick = async (e) => {
      const messageGroupID = e.currentTarget.id
      const group = messageGroups.filter((group) => 
        messageGroupID === group.id
      )[0];
      if (group) {
        setMessageGroup(group);
        setTempUser(null);
      } else {
        mutateMessageGroups()
      }

      //change to messageboard display

  }

  const submitMessageHandler = async (messageText) => {
    try {
      if (currentUserProfile && !messageGroup) {
        // const userID = messageGroup.members.filter((id) => {
        //     return id !== currentUserProfile.userID
        // })[0]
        const response = await fetch(`/api/createMessageGroup`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chatUserID: tempUser,
            currentUserID: currentUserProfile.userID,
            currentUserProfilePhoto: currentUserProfile.profilePhoto,
            currentUserDisplayName: currentUserProfile.displayName,
          }),
        });
        const groupData = await response.json();
        setMessageGroup(groupData);
        mutateMessageGroups();
        //does not send a message if this block of code is not here
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
   
      }

      if (messageGroup) {
        // const submitMessage = async () => {
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
    }
    mutateMessages();
      //   await Promise.all([submitMessage()]);

      // };
      // const createNotification = async () => {
      //     if(props.userID !== currentUserProfile.userID) {
      //       await fetch(`/api/createNotification`, {
      //         method: "POST",
      //         headers: {
      //           "Content-Type": "application/json",
      //         },
      //         body: JSON.stringify({
      //           sent_user_id: currentUserProfile.userID,
      //           sent_user_displayName: currentUserProfile.displayName,
      //           user_id: props.userID,
      //           link: `/post/${props.postID}`,
      //           type: "comment",
      //           message: `${currentUserProfile.displayName} has commented on your post.`,
      //         }),
      //       });
      //     }
      //   };
      //   await Promise.all([submitMessage(), createNotification()]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleShowModal = () => {
      showFollowingModal ? setShowFollowingModal(false) : setShowFollowingModal(true)
  }

  return (
    <div>
      {showFollowingModal && <FollowingModal
        handleUserClick={handleFollowingClick}
        following={following}
        setShowFollowingModal={handleShowModal}
      />}
      <MessageGroup
      handleMessageGroupClick={handleMessageGroupClick}
        messageGroups={messageGroups}
        currentUserProfile={currentUserProfile}
        setShowFollowingModal={handleShowModal}
      />
      <MessageBoard
        messages={messageList}
        handleLoadMore={handleLoadMoreMessages}
        submitMessageHandler={submitMessageHandler}
        isReachingEnd={isReachingEnd}
        messageGroup={messageGroup}
        currentUserProfile={currentUserProfile}
        setShowFollowingModal={handleShowModal}
      />
    </div>
  );
};

export default MessagesPage;
