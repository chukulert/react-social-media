import useSWR, { useSWRConfig } from "swr";
import useSWRInfinite from "swr/infinite";
import { fetcher } from "../src/utils";
import { useAuth } from "../src/context/AuthContext";
import { useState, useEffect } from "react";

const MessagesPage = () => {
  const { mutate } = useSWRConfig();
  const { currentUserProfile } = useAuth();
  const [messageGroup, setMessageGroup] = useState(null);
  const [fetchedMessages, setFetchedMessages] = useState([]);


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
  } = useSWRInfinite(messageGroup ? getKey : null, fetcher);

  const messageList = messages ? [].concat(...messages) : [];
  if (followersError) return <div>failed to load</div>;
  if (!following) return <div>loading...</div>;
//   if (!messages) return "loading";

  //check for group if exists? store in a state. fetch messages
  const handleUserClick = async (e) => {
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
    }

    //3. fetch messages if exist and show active on groupList

    //4. on frontend, change to reflect userdata on message board
  };

  const followingItems = (
    <ul>
      {following.map((user) => (
        // eslint-disable-next-line react/jsx-key
        <div>
          <li key={user.userID} onClick={handleUserClick} id={user.userID}>
            <p>{user.displayName}</p>
            <p>{user.email}</p>
          </li>
        </div>
      ))}
    </ul>
  );

 


  //   const messageGroupList = (
  //     <ul>
  //       {messageGroups.map((group) => (
  //         // eslint-disable-next-line react/jsx-key
  //         <div>
  //         <li key={group.id} onClick={handleUserClick} id={group.id}>
  //           <p>{user.displayName}</p>
  //             <p>{user.email}</p>
  //         </li>
  //         </div>
  //       ))}
  //     </ul>
  //   );

  const messageItems = (
    <ul>
      {messageList?.reverse().map((message) => (
        // eslint-disable-next-line react/jsx-key
        <div>
          <li key={message.id} onClick={handleUserClick} id={message.id}>
            <p>{message.messageText}</p>
            <p>{message.sent_by}</p>
          </li>
        </div>
      ))}
    </ul>
  );

  // const submitMessageHandler = async () => {
  //         const newName = data.name.toUpperCase()

  //         // update the local data immediately, but disable the revalidation
  //         mutate('/api/user', { ...data, name: newName }, false)

  //         // send a request to the API to update the source
  //         await requestUpdateUsername(newName)

  //         // trigger a revalidation (refetch) to make sure our local data is correct
  //         mutate('/api/user')
  // }

  return (
    <div>
      Messages page
      {followingItems}
      <p>Messages</p>
      {messageItems}
      {messages && <button onClick={() => setSize(size + 1)}>Load More</button>}
    </div>
  );
};

export default MessagesPage;
