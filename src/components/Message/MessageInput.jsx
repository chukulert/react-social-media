import { useRef } from "react";
import styles from "./MessageInput.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";

const MessageInput = ({ submitMessageHandler }) => {
  const inputBox = useRef();

  library.add(faArrowRightFromBracket);

  const handleSubmit = (e) => {
    e.preventDefault();
    submitMessageHandler(`${inputBox.current.value}`);
    inputBox.current.value = "";
  };

  return (
    <>
      <form onSubmit={handleSubmit} className={styles.messageInputContainer}>
        <input
          type="text"
          maxLength="500"
          minLength="1"
          placeholder="Enter your message..."
          ref={inputBox}
          className={styles.messageInput}
        />
        <div type="submit" onClick={handleSubmit} className={styles.submitIcon}>
          <FontAwesomeIcon icon="fa-solid fa-arrow-right-from-bracket" />
        </div>
      </form>
    </>
  );
};

export default MessageInput;
