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
        //   followUserHandler={followUserHandler}
        //   followStatus={checkUserFollowingStatus(user.userID)}
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
          {usersDisplayList}
        </div>
      </div>
    </>
  );
};

export default MessageUserModal;