import { useState, useEffect } from "react";
import styles from "./HomeSideTab.module.css";
import SideTabProfile from "./SideTabProfile";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faUserGroup, faGlobe } from "@fortawesome/free-solid-svg-icons";
import NewPost from "../Post/NewPost";
import FollowingModal from "../Friend/FollowingModal";

const HomeSideTab = (props) => {
  const { userProfile, allUsersData } = props;
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [followingCount, setFollowingCount] = useState(
    userProfile.following.length
  );

  const [usersList, setUsersList] = useState([]);
  const [userFollowing, setUserFollowing] = useState([]);
  const [userFollowers, setUserFollowers] = useState([]);
  const [currentTab, setCurrentTab] = useState("following");

  library.add(faUserGroup, faGlobe);

  const handleShowFollowingModal = () => {
    showFollowingModal
      ? setShowFollowingModal(false)
      : setShowFollowingModal(true);
  };

  const handleListUpdate = (type) => {
    let usersData;
    if (type === "following") {
      usersData = allUsersData.filter((user) =>
        userFollowing.includes(user.userID)
      );
    }
    if (type === "followers") {
      usersData = allUsersData.filter((user) =>
        userFollowers.includes(user.userID)
      );
    }

    if (type === "suggestions") {
      usersData = allUsersData.filter(
        (user) => !userFollowing.includes(user.userID)
      );
    }
    setCurrentTab(type);
    setUsersList(usersData);
  };

  useEffect(() => {
    const updateUsersList = async () => {
      const response = await fetch(
        `/api/fetchUserProfile?id=${userProfile.userID}`
      );
      const fetchedUser = await response.json();
      if (fetchedUser) {
        setUserFollowing([...fetchedUser.following]);
        setUserFollowers([...fetchedUser.followers]);
      }
    };
    updateUsersList();
    handleListUpdate("following");
    return () => {
      setUsersList([]);
    };
  }, [showFollowingModal, userProfile.userID]);

  const followUserHandler = async ({ id, isFollower }) => {
    try {
      const followUser = async () => {
        await fetch(`/api/followUser`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentUserID: userProfile.userID,
            postUserID: id,
            type: isFollower ? "unfollow" : "follow",
          }),
        });
      };
      const createNotification = async () => {
        if (!isFollower) {
          await fetch(`/api/createNotification`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              sent_user_id: userProfile.userID,
              sent_user_displayName: userProfile.displayName,
              user_id: id,
              link: `/profile/${userProfile.userID}`,
              type: "follow",
              message: `${userProfile.displayName} has followed you`,
            }),
          });
        }
      };

      await Promise.all([followUser(), createNotification()]);
      if (isFollower) {
        setUserFollowing((prevArray) =>
          prevArray.filter((following) => following !== id)
        );
        setFollowingCount((prevCount) => prevCount - 1);
      } else {
        setUserFollowing((prevArray) => [...prevArray, id]);
        setFollowingCount((prevCount) => prevCount + 1);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className={styles.sideTabContainer}>
        <SideTabProfile
          userProfile={userProfile}
          followingCount={followingCount}
        />
        <div className={styles.buttonContainer}>
          <button className={styles.button} onClick={handleShowFollowingModal}>
            <FontAwesomeIcon
              icon="fa-solid fa-user-group"
              className={styles.userGroupBtn}
            />
            <span>Show Users</span>
          </button>
          <NewPost />
        </div>
      </div>
      {showFollowingModal && (
        <FollowingModal
          setShowFollowingModal={handleShowFollowingModal}
          followUserHandler={followUserHandler}
          currentTab={currentTab}
          userFollowing={userFollowing}
          usersList={usersList}
          handleListUpdate={handleListUpdate}
        />
      )}
    </>
  );
};

export default HomeSideTab;
