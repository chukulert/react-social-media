import Image from "next/image";

const MessageGroupItem = (props) => {
  const { messageGroup, currentUserProfile } = props;
  const chatUser = messageGroup.members.filter(
    (member) => member.id !== currentUserProfile.userID
  )[0];

  return (
    <div>
      <div>
        <h4>{messageGroup.groupName}</h4>
        <p>{chatUser.displayName}</p>
        {chatUser.profilePhoto !== "null" && (
          <Image
            src={chatUser.profilePhoto}
            alt={"User profile photo"}
            width={50}
            height={50}
          />
        )}
      </div>
    </div>
  );
};

export default MessageGroupItem;
