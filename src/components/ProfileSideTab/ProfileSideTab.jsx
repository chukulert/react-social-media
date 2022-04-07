import styles from "../HomeSideTab/HomeSideTab.module.css";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faUserPlus, faPen } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import TextContent from "../Post/TextContent";
import NewPost from "../Post/NewPost";
import FollowingModal from "../Friend/FollowingModal";

const ProfileSideTab = (props) => {
  const {
    profilePageUser,
    followUserHandler,
    isCurrentUserPage,
    isFollowing,
    userProfile,
  } = props;
  const [currentUser, setCurrentUser] = useState(null);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [followersCount, setFollowersCount] = useState(
    currentUser?.followers.length
  );
  const [userFollowers, setUserFollowers] = useState([]);
  const [loadingModal, setLoadingModal] = useState(false)

  library.add(faUserPlus, faPen);

  useEffect(() => {
    if (profilePageUser) {
      setCurrentUser(profilePageUser);
      setFollowersCount(profilePageUser.followers.length);
    } else {
      setCurrentUser(userProfile);
      setFollowersCount(userProfile.followers.length);
    }
    return () => {};
  }, [profilePageUser]);

  const handleFollowersModalClick = async () => {
    if (!showFollowersModal) {
        setShowFollowersModal(true);
        setLoadingModal(true)
      const response = await fetch(
        `/api/getFollowersById?id=${currentUser.userID}`
      );
      const followersData = await response.json();
      setUserFollowers(followersData);
      setLoadingModal(false)
    } else {
      setShowFollowersModal(false);
    }
  };

  return (
    <>
      {currentUser && (
        <div className={styles.profileTabContainer}>
          <div className={styles.bannerPhotoContainer}>
            <Image
              src={currentUser.bannerPhoto || "/profile-photo.png"}
              alt={currentUser.displayName}
              //   width="100%"
              //   height="100%"
              layout="fill"
              objectFit="cover"
            />
          </div>
          <div className={styles.profileContainer}>
            <div className={styles.profilePhotoContainer}>
              <Image
                src={currentUser.profilePhoto || "/profile-photo.png"}
                alt={currentUser.displayName}
                width="100%"
                height="100%"
                layout="responsive"
                objectFit="cover"
                className={styles.profilePhoto}
              />
            </div>
            <div className={styles.profileInfoContainer}>
              <div className={styles.displayNameContainer}>
                <h2>{currentUser.displayName}</h2>
                <div onClick={handleFollowersModalClick} className={styles.followBtn}>{followersCount} Followers</div>
              </div>
              <div className={styles.userSummary}>
                <TextContent>{currentUser.userSummary}</TextContent>
              </div>
            </div>

            <div className={styles.buttonContainer}>
              {!isCurrentUserPage && (
                <button
                  className={styles.followBtn}
                  onClick={followUserHandler}
                >
                  <FontAwesomeIcon
                    className={styles.followIcon}
                    icon="fa-solid fa-user-plus"
                  />
                  <span>{isFollowing ? "Unfollow" : "Follow"}</span>
                </button>
              )}

              {isCurrentUserPage && (
                <Link href="/profile/edit">
                  <a className={styles.followBtn}>
                    <FontAwesomeIcon
                      icon="fa-solid fa-pen"
                      className={styles.followIcon}
                    />
                    <span>Edit Profile</span>
                  </a>
                </Link>
              )}
              {isCurrentUserPage && <NewPost userProfile={userProfile} />}
            </div>
          </div>
          {showFollowersModal && (
            <FollowingModal
              setShowFollowingModal={handleFollowersModalClick}
              followUserHandler={followUserHandler}
              usersList={userFollowers}
              loadingModal={loadingModal}
              userFollowing={userProfile.following}
              modalType='followers'
            />
          )}
        </div>
      )}
    </>
  );
};

export default ProfileSideTab;
