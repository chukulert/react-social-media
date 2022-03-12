import MessageGroupItem from "./MessageGroupItem";

const MessageGroup = (props) => {
  const { messageGroups, currentUserProfile } = props;

    const messageGroupList = (
    <ul>
      {messageGroups?.map((group) => (
        <MessageGroupItem
          messageGroup={group}
          key={group.id}
          id={group.id}
          currentUserProfile={currentUserProfile}
        />
      ))}
    </ul>
  );

  return <div>{messageGroupList}</div>;
};

export default MessageGroup;
