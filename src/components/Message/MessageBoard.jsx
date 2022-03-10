import MessageInput from "./MessageInput";

const MessageBoard = (props) => {
  const { messages, handleLoadMore, submitMessageHandler } = props;

  const messageItems = (
    <ul>
      {[...messages]?.reverse().map((message) => (
        <li key={message.id} id={message.id}>
          <p>{message.messageText}</p>
          {/* <p>{message.sent_by}</p> */}
        </li>
      ))}
    </ul>
  );

  return (
    <>
      <div>{messageItems}</div>
      {messages.length !== 0 && <button onClick={handleLoadMore}>Load more</button>}
      <MessageInput submitMessageHandler={submitMessageHandler} />
    </>
  );
};

export default MessageBoard;
