import styles from "./FriendModal.module.css";
import FriendListItem from "./FriendListItem";

const FriendModal = (props) => {
  const friendsList = (
    <ul>
      {props.friends.map((friend) => (
        <FriendListItem
          key={friend.userID}
          id={friend.userID}
          displayName={friend.displayName}
          profilePhoto={friend.profilePhoto}
        />
      ))}
    </ul>
  );

  return (
    <>
      <div className={styles.modalBackdrop} onClick={props.closeModal}></div>
      <div>
        <div className={styles.modal}>
          <h2>All Friends</h2>
          <button onClick={props.closeModal} className={styles.closeModalBtn}>
            X
          </button>
          {friendsList}
        </div>
      </div>
    </>
  );
};

export default FriendModal;
