import styles from "../HomeSideTab/HomeSideTab.module.css";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faUserPlus, faPen } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import TextContent from "../Post/TextContent";

const ProfileSideTab = (props) => {
  const {
    profilePageUser,
    followUserHandler,
    isCurrentUserPage,
    isFollowing,
    userProfile,
  } = props;
  const [currentUser, setCurrentUser] = useState(null);

  library.add(faUserPlus, faPen);

  useEffect(() => {
    profilePageUser
      ? setCurrentUser(profilePageUser)
      : setCurrentUser(userProfile);
    return () => {};
  }, []);

  return (
    <>
      {currentUser && (
        <div className={styles.profileTabContainer}>
          <div className={styles.bannerPhotoContainer}>
            <Image
              src={currentUser.bannerPhoto}
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
                src={currentUser.profilePhoto}
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
                <div>{currentUser.followers.length} Followers</div>
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
                  <span>{isFollowing ? "Unfollow" : "Follow"} User</span>
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
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileSideTab;
