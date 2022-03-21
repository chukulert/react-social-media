import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";

const FollowUserButton = (props) => {
  const [isFollower, setIsFollower] = useState(false);

  const { currentUser, id, followStatus } = props;

  library.add(faUserPlus);

  useEffect(() => {
    if (followStatus) setIsFollower(true);
  }, []);

  const followUserHandler = async () => {
    try {
      const followUser = async () => {
        await fetch(`/api/followUser`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentUserID: currentUser.userID,
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
              sent_user_id: currentUser.userID,
              sent_user_displayName: currentUser.displayName,
              user_id: id,
              link: `/profile/${currentUser.userID}`,
              type: "follow",
              message: `${currentUser.displayName} has followed you`,
            }),
          });
        }
      };

      await Promise.all([followUser(), createNotification()]);
      if (isFollower) {
        setIsFollower(false);
      } else {
        setIsFollower(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <button onClick={followUserHandler}>
        <FontAwesomeIcon icon="fa-solid fa-user-plus" />
        <span>{isFollower ? "Unfollow" : "Follow"} User</span>
      </button>
    </>
  );
};

export default FollowUserButton;
