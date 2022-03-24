import { useRouter } from "next/router";
import { timeAgo } from "../../utils";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
faCheck
} from "@fortawesome/free-solid-svg-icons";
import styles from './NotificationItem.module.css'



const NotificationItem = (props) => {
    const {id, created_at, link,  message, read, user_id } = props
    const [readNotif, setReadNotif] = useState(read)

    library.add(faCheck)

    const router = useRouter;
    const date = timeAgo(created_at.Date.now())
    
    const updateNotifReadStatus = async (id) => {
        await fetch(`/api/readNotification`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id,
            }),
          });
    }

    const handleReadNotif = async () => {
        setReadNotif(true)
        await updateNotifReadStatus(id)
    }

    const handleNotificationClick = async () => {
        await updateNotifReadStatus(id)
        router.push(link)
    }

    return (
        <div>
            <div onClick={handleNotificationClick}>{message}</div>
            <div onClick={handleReadNotif}><FontAwesomeIcon icon="fa-solid fa-check" /></div>
            <div>{date}</div>
        </div>
    )
}

export default NotificationItem;