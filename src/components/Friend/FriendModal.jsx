import styles from "./FriendModal.module.css";
import FriendListItem from "./FriendListItem";

const FriendModal = (props) => {
  console.log(props)
  const followingList = (
    <ul>
      {props.following.map((following) => (
        <FriendListItem
          key={following.userID}
          id={following.userID}
          displayName={following.displayName}
          profilePhoto={following.profilePhoto}
        />
      ))}
    </ul>
  );

  return (
    <>
      <div className={styles.modalBackdrop} onClick={props.closeModal}></div>
      <div>
        <div className={styles.modal}>
          <h2>All Following</h2>
          <button onClick={props.closeModal} className={styles.closeModalBtn}>
            X
          </button>
          {followingList}
        </div>
      </div>
    </>
  );
};

export default FriendModal;
