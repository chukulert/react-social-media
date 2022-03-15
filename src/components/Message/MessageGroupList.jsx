import MessageGroupItem from "./MessageGroupItem";

const MessageGroup = (props) => {
  const { messageGroups, currentUserProfile, handleMessageGroupClick } = props;

  const messageGroupList = (
    <ul>
      {messageGroups?.map((group) => (
        <MessageGroupItem
          messageGroup={group}
          key={group.id}
          id={group.id}
          currentUserProfile={currentUserProfile}
          handleMessageGroupClick={handleMessageGroupClick}
        />
      ))}
    </ul>
  );

  return <div>{messageGroupList}</div>;
};

export default MessageGroup;
