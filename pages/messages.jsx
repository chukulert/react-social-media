import useSWR, { useSWRConfig } from "swr";
import useSWRInfinite from "swr/infinite";
import { fetcher } from "../src/utils";
import { useAuth } from "../src/context/AuthContext";
import { useState, useEffect } from "react";
import FollowingList from "../src/components/Message/FollowingList";
import MessageBoard from "../src/components/Message/MessageBoard";

const MessagesPage = () => {
//   const { mutate } = useSWRConfig();
  const { currentUserProfile } = useAuth();
  const [messageGroup, setMessageGroup] = useState(null);
//   const [fetchedMessages, setFetchedMessages] = useState([]);


  const getKey = (pageIndex, previousPageData) => {
    // reached the end
    if (previousPageData && !previousPageData.length) return null

    // first page, we don't have `previousPageData`
    if (pageIndex === 0) return `/api/getMessagesByGroupId/${messageGroup.id}`;

    // add the cursor to the API endpoint
    return `/api/getMessagesByGroupId/${messageGroup.id}/${previousPageData[4]?.id}`;
  };

  const { data: messageGroups, error: messageGroupsError } = useSWR(
    currentUserProfile
      ? `/api/getMessageGroups?id=${currentUserProfile.userID}`
      : null,
    fetcher
  );
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
    mutate
  } = useSWRInfinite(messageGroup ? getKey : null, fetcher, { refreshInterval: 1000 });

  const messageList = messages ? [].concat(...messages) : [];
  const messageGroupsData = () => {

  }
  if (followersError) return <div>failed to load</div>;
  if (!following) return <div>loading...</div>;


  //check for group if exists? store in a state. fetch messages
  const handleFollowingClick = async (e) => {
    setMessageGroup(null);
    const userID = e.currentTarget.id;

    //1. check if group exists between user and clicked object
    const userArray = [userID];
    const group = messageGroups.filter((group) => {
      if (group.members.includes(userArray[0])) {
        return group;
      }
    })[0];

    //2. store in group if exist
    if (group) {
      setMessageGroup(group);
      if (group.type === 'private') {

      }
    }

    //3. fetch messages if exist and show active on groupList

    //4. on frontend, change to reflect userdata on message board
  };




    const messageGroupList = (
      <ul>
        {messageGroups.map((group) => (
          <li key={group.id} id={group.id}>
            <p>Group name: {group.groupName}</p>
          </li>
        ))}
      </ul>
    );

  const handleLoadMoreMessages = () => {
    setSize(size + 1)
  }

  const submitMessageHandler = async (messageText) => {
        if (currentUserProfile && messageGroup) {

            const userID = messageGroup.members.filter((id) => {
                return id !== currentUserProfile.userID
            })[0]
          
          try {
            const submitMessage = async () => {
              await fetch(`/api/submitMessage`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  sent_by: currentUserProfile.userID,
                  messageText,
                  messageGroupID: messageGroup.id
                }),
              });
            }
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
            await Promise.all([submitMessage()])
            mutate()
        } catch (error) {
            console.error(error)
            }
  }}

  return (
    <div>
      Messages page
      <h3>followers:</h3>
      <FollowingList handleUserClick={handleFollowingClick} following={following}/>
      <h3>Message Groups:</h3>
      {messageGroupList}
      <p>Messages</p>
      <MessageBoard messages={messageList} handleLoadMore={handleLoadMoreMessages} submitMessageHandler={submitMessageHandler}/>
    </div>
  );
};

export default MessagesPage;
