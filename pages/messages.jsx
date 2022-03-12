import useSWR, { useSWRConfig } from "swr";
import useSWRInfinite from "swr/infinite";
import { fetcher } from "../src/utils";
import { useAuth } from "../src/context/AuthContext";
import { useState, useEffect } from "react";
import FollowingList from "../src/components/Message/FollowingList";
import MessageBoard from "../src/components/Message/MessageBoard";
import MessageGroup from "../src/components/Message/MessageGroupList";

const MessagesPage = () => {
  const { currentUserProfile } = useAuth();
  const [messageGroup, setMessageGroup] = useState(null);
  const [tempUser, setTempUser] = useState(false);

  const getKey = (pageIndex, previousPageData) => {
    // reached the end
    if (previousPageData && !previousPageData.length) return null;

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
  //   const { data: messageGroups, error: messageGroupsError } = useSWR(
  //     currentUserProfile
  //       ? `/api/getMessageGroups/${currentUserProfile.userID}/${currentUserProfile.displayName}/${currentUserProfile.profilePhoto}`
  //       : null,
  //     fetcher
  //   );
  const { data: following, error: followersError } = useSWR(
    currentUserProfile
      ? `/api/getFollowingById?id=${currentUserProfile.userID}`
      : null,
    fetcher
  );

  const {
    data: messages,
    error: messagesError,
    size,
    setSize,
    mutate: mutateMessages,
  } = useSWRInfinite(messageGroup ? getKey : null, fetcher, {
    refreshInterval: 1000,
  });

  const messageList = messages ? [].concat(...messages) : [];

  if (followersError) return <div>failed to load</div>;
  if (!following) return <div>loading...</div>;

  //check for group if exists? store in a state. fetch messages
  const handleFollowingClick = async (e) => {
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
        // await fetch(`/api/submitMessage`, {
        //   method: "POST",
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        //   body: JSON.stringify({
        //     sent_by: currentUserProfile.userID,
        //     messageText,
        //     messageGroupID: groupData.id,
        //   }),
        // });
   
      }

      if (messageGroup) {
        console.log("yes");
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

  return (
    <div>
      Messages page
      <h3>followers:</h3>
      <FollowingList
        handleUserClick={handleFollowingClick}
        following={following}
        currentUserProfile={currentUserProfile}
      />
      <h3>Message Groups:</h3>
      <MessageGroup
        messageGroups={messageGroups}
        currentUserProfile={currentUserProfile}
      />
      <p>Messages</p>
      <MessageBoard
        messages={messageList}
        handleLoadMore={handleLoadMoreMessages}
        submitMessageHandler={submitMessageHandler}
      />
    </div>
  );
};

export default MessagesPage;
