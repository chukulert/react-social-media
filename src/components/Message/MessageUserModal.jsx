import FriendListItem from "../Friend/FriendListItem";
import styles from "../Friend/FollowingModal.module.css"

const MessageUserModal = (props) => {
  const {
    handleShowModal,
    usersList,
    handleUserClick
  } = props;

  const usersDisplayList = (
    <ul>
      {usersList?.map((user) => (
        <FriendListItem
          key={user.userID}
          id={user.userID}
          displayName={user.displayName}
          profilePhoto={user.profilePhoto}
          handleUserClick={handleUserClick}
          modalType='message'
        />
      ))}
    </ul>
  );

  return (
    <>
      <div
        className={styles.modalBackdrop}
        onClick={handleShowModal}
      ></div>
      <div>
        <div className={styles.modal}>
          <button
            onClick={handleShowModal}
            className={styles.closeModalBtn}
          >
            X
          </button>
          <div className={styles.modalContent}>
            <h3>Users you are following</h3>
          {usersList.length === 0 && <div className={styles.noUsers}><p>No users displayed. Follow other users to message them.</p></div>}
          {usersDisplayList}
          </div>
        </div>
      </div>
    </>
  );
};

export default MessageUserModal;