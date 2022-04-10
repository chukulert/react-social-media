import { useRouter } from "next/router";
import { timeAgo } from "../../utils";
import { useState } from "react";
//styles and icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import styles from "./NotificationItem.module.css";

const NotificationItem = (props) => {
  const {
    id,
    created_at,
    link,
    message,
    read,
    user_id,
    sent_user_id,
    mutateNotifications,
    setNotificationItems,
    notificationItems
  } = props;

  library.add(faCheck);
  const router = useRouter();
  const date = timeAgo(created_at);

  const updateNotifReadStatus = async (id) => {
    const newSortedNotifications = notificationItems.filter((notification)=> notification.id !== id)
    setNotificationItems(newSortedNotifications)
    await fetch(`/api/readNotification`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sent_user_id,
        link,
        user_id,
      }),
    });
    mutateNotifications();
  };

  const handleReadNotif = async () => {
    await updateNotifReadStatus(id);
  };

  const handleNotificationClick = () => {
    document.getElementById('notificationDropDown').blur()
    router.push(link);
  };

  return (
    <div className={styles.notifItemContainer}>
      <div>
        <div onClick={handleNotificationClick} className={styles.message}>
          {message}
        </div>
        <div className={styles.date}>{date}</div>
      </div>
      <div onClick={handleReadNotif} className={styles.readNotifBtn}>
        <FontAwesomeIcon icon="fa-solid fa-check" className={styles.icon} />
      </div>
    </div>
  );
};

export default NotificationItem;
