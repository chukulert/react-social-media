import styles from "./FollowingModal.module.css";
import FriendListItem from "./FriendListItem";
import Loader from "../Loader/Loader";

const FollowingModal = (props) => {
  const {
    followUserHandler,
    setShowFollowingModal,
    usersList,
    userFollowing,
    handleListUpdate,
    currentTab,
    loadingModal,
    modalType
  } = props;

  const checkUserFollowingStatus = (id) => {
    return userFollowing.includes(id);
  };

  const handleTabClick = (event) => {
    handleListUpdate(event.currentTarget.id);
  };

  const usersDisplayList = (
    <ul>
      {usersList?.map((user) => (
        <FriendListItem
          key={user?.userID}
          id={user?.userID}
          displayName={user?.displayName}
          profilePhoto={user?.profilePhoto}
          followUserHandler={followUserHandler}
          followStatus={checkUserFollowingStatus(user?.userID)}
          setShowFollowingModal={setShowFollowingModal}
        />
      ))}
    </ul>
  );

  return (
    <>
      <div
        className={styles.modalBackdrop}
        onClick={setShowFollowingModal}
      ></div>
      <div>
        <div className={styles.modal}>
          <button
            onClick={setShowFollowingModal}
            className={styles.closeModalBtn}
          >
            X
          </button>
          {loadingModal && <div className='loader'><Loader /></div>}
          {modalType !== 'followers' && <div className={styles.header}>
            <button
              onClick={handleTabClick}
              id="following"
              className={
                currentTab === "following"
                  ? ` ${styles.button} ${styles.active}`
                  : `${styles.button}`
              }
            >
              Following
            </button>
            <button
              onClick={handleTabClick}
              id="followers"
              className={
                currentTab === "followers"
                  ? ` ${styles.button} ${styles.active}`
                  : `${styles.button}`
              }
            >
              Followers
            </button>
            <button
              onClick={handleTabClick}
              id="suggestions"
              className={
                currentTab === "suggestions"
                  ? `${styles.button} ${styles.active} `
                  : `${styles.button}`
              }
            >
              Suggestions
            </button>
          </div>}
          {usersDisplayList.length !== 0 && !loadingModal && usersDisplayList}
          {usersDisplayList.length === 0 && !loadingModal && <div>No users to display.</div>}
        </div>
      </div>
    </>
  );
};

export default FollowingModal;
