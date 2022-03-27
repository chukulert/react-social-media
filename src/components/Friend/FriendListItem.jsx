import { useState, useEffect } from "react";
import styles from "./FriendListItem.module.css";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";

const FriendListItem = (props) => {
  const {
    displayName,
    profilePhoto,
    id,
    followStatus,
    followUserHandler,
    handleUserClick,
    modalType,
  } = props;
  const [isFollower, setIsFollower] = useState(null);
  library.add(faUserPlus);

  useEffect(() => {
    if (followStatus) setIsFollower(true);
  }, []);

  const handleFollowClick = () => {
    isFollower ? setIsFollower(false) : setIsFollower(true);
    followUserHandler({ id, isFollower });
  };

  return (
    <div
      className={
        modalType === "message"
          ? `${styles.pointer} ${styles.friendListItemContainer}`
          : `${styles.friendListItemContainer}`
      }
      id={id}
      onClick={modalType === "message" ? handleUserClick : null}
    >
      <div className={styles.profileContainer}>
        <Image
          src={profilePhoto}
          width={50}
          height={50}
          alt="profile photo"
          className="avatar"
        />

        <div className={styles.displayNameContainer}>
          <Link href={`/profile/${id}`}>
            <a className={styles.displayName}>{displayName}</a>
          </Link>
        </div>
      </div>
      {modalType !== "message" && (
        <button className={styles.followBtn} onClick={handleFollowClick}>
          <FontAwesomeIcon
            className={styles.followIcon}
            icon="fa-solid fa-user-plus"
          />
          <span>{isFollower ? "Unfollow" : "Follow"} User</span>
        </button>
      )}
    </div>
  );
};

export default FriendListItem;
