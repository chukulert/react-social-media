import styles from "./FollowingModal.module.css";
import FriendListItem from "./FriendListItem";

const FollowingModal = (props) => {

  const { following, handleUserClick, setShowFollowingModal } = props;

  const followingList = (
    <ul>
      {following?.map((following) => (
        <FriendListItem
          key={following.userID}
          id={following.userID}
          displayName={following.displayName}
          profilePhoto={following.profilePhoto}
          handleUserClick={handleUserClick}
        />
      ))}
    </ul>
  );

  return (
    <>
      <div className={styles.modalBackdrop} onClick={setShowFollowingModal}></div>
      <div>
        <div className={styles.modal}>
          <button onClick={setShowFollowingModal} className={styles.closeModalBtn}>
            X
          </button>
          {followingList}
        </div>
      </div>
    </>
  );
};

export default FollowingModal;
