//swr
import useSWR from "swr";
import { fetcher } from "../../utils";
//react
import { useState, useRef } from "react";
//nextjs
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
//hooks
import { useAuth } from "../../context/AuthContext";
import useWindowSize from "../../hooks/useWindowSize";
//components
import NotificationItem from "./NotificationItem";
//styles and icons
import styles from "./NavBar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import '../../../node_modules/@fortawesome/fontawesome-svg-core/styles.css'
// import '../node_modules/@fortawesome/fontawesome-svg-core/styles.css'
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faHouse,
  faUser,
  faMessage,
  faCloudSun,
  faSquareCaretDown,
  faArrowRightFromBracket,
  faBell,
} from "@fortawesome/free-solid-svg-icons";
//helpers
import { sortNotifications } from "../../utils";

const NavBar = ({switchTheme}) => {
  const [expandedMenu, setExpandedMenu] = useState(false);
  const [expandedNotification, setExpandedNotification] = useState(false);
  const { logout, currentUserProfile } = useAuth();
  const { width } = useWindowSize();
  const dropDownRef = useRef();
  const notifDropDownRef = useRef();
  const router = useRouter();
  library.add(
    faHouse,
    faUser,
    faMessage,
    faCloudSun,
    faSquareCaretDown,
    faArrowRightFromBracket,
    faBell
  );

  const {
    data: notifications,
    error: notificationsError,
    mutate: mutateNotifications,
  } = useSWR(
    currentUserProfile
      ? `/api/getNotifications?id=${currentUserProfile.userID}`
      : null,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
    }
  );

  const sortedNotifications = notifications
    ? sortNotifications(notifications)
    : [];

  const notificationsList = (
    <div>
      {sortedNotifications?.map((notification) => (
        <NotificationItem
          key={notification.id}
          id={notification.id}
          created_at={notification.created_at}
          link={notification.link}
          message={notification.message}
          read={notification.read}
          sent_user_displayName={notification.sent_user_displayName}
          sent_user_id={notification.sent_user_id}
          type={notification.type}
          mutateNotifications={mutateNotifications}
          user_id={notification.user_id}
        />
      ))}
    </div>
  );

  const expandMenu = () => {
    setExpandedMenu(true);
    dropDownRef.current.classList.toggle("active");
  };

  const closeMenu = () => {
    setExpandedMenu(false);
    dropDownRef.current.classList.toggle("active");
  };

  const expandNotification = () => {
    setExpandedNotification(true);
    notifDropDownRef.current.classList.toggle("active");
  };

  const closeNotification = () => {
    setExpandedNotification(false);
    notifDropDownRef.current.classList.toggle("active");
  };

  const loadProfilePage = () => {
    router.push(`/profile/${currentUserProfile.userID}`);
  };

  const handleReadAllNotifications = async () => {
    await fetch(`/api/readNotification`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        notifications,
      }),
    });
    mutateNotifications();
  };

  return (
    <div
      className={
        width > 768
          ? `${styles.navbar}`
          : `${styles.navbar} ${styles.navMobile}`
      }
    >
      {currentUserProfile && width > 768 && (
        <div>
          <Link href={`/profile/${currentUserProfile.userID}`}>
            <a className={styles.profileLink}>
              <Image
                src={currentUserProfile.profilePhoto}
                width={50}
                height={50}
                className="avatar"
                alt="profile photo"
              />
              <div className={styles.flexCenter}>
                {currentUserProfile.displayName}
              </div>
            </a>
          </Link>
        </div>
      )}

      <div
        className={
          width > 768
            ? `${styles.navlinks}`
            : `${styles.navlinks} ${styles.navMobileLinks}`
        }
      >
        {/* home */}
        {currentUserProfile && (
          <Link href="/">
            <a
              className={
                router.pathname == "/"
                  ? `${styles.navlink} active`
                  : `${styles.navlink}`
              }
            >
              <FontAwesomeIcon icon="fa-solid fa-house" />
            </a>
          </Link>
        )}

        {currentUserProfile && (
          <Link href="/messages">
            <a
              className={
                router.pathname == "/messages"
                  ? `${styles.navlink} active`
                  : `${styles.navlink}`
              }
            >
              <FontAwesomeIcon icon="fa-solid fa-message" />
            </a>
          </Link>
        )}

        {/* notification */}
        {currentUserProfile && (
          <div
            className={styles.dropdown}
            tabIndex={0}
            onFocus={expandNotification}
            onBlur={closeNotification}
          >
            <div ref={notifDropDownRef}>
              <FontAwesomeIcon
                icon="fa-solid fa-bell"
                className={`${styles.dropbtn} ${styles.navlink}`}
              />
            </div>

            {expandedNotification && (
              <div id="dropDown" className={styles.notificationDropDown}>
                {notifications.length !== 0 && (
                  <div>
                    <div className={styles.flexEnd}>
                      <div
                        onClick={handleReadAllNotifications}
                        className={styles.button}
                      >
                        Clear All
                      </div>
                    </div>
                  </div>
                )}
                {notifications.length === 0 && (
                  <div className={styles.noNotifMessage}>
                    You have no notifications.
                  </div>
                )}
                {notificationsList}
              </div>
            )}
          </div>
        )}
        {/* profile dropdown */}
        {currentUserProfile && (
          <div
            className={styles.dropdown}
            tabIndex={0}
            onFocus={expandMenu}
            onBlur={closeMenu}
          >
            <div ref={dropDownRef}>
              <FontAwesomeIcon
                icon="fa-solid fa-user"
                className={`${styles.dropbtn} ${styles.navlink}`}
              />
            </div>

            {expandedMenu && (
              <div id="dropDown" className={styles.dropdownContent}>
                <a onClick={loadProfilePage}>
                  <FontAwesomeIcon icon="fa-solid fa-user" className={styles.icons}/> <p>Profile Page</p>
                </a>

                <a onClick={switchTheme}>
                  <FontAwesomeIcon icon="fa-solid fa-cloud-sun" className={styles.icons} /> <p>Switch Theme</p>
                </a>
                <a onClick={logout}>
                  <FontAwesomeIcon icon="fa-solid fa-arrow-right-from-bracket" className={styles.icons}/>
                  <p>Logout</p>
                </a>
              </div>
            )}
          </div>
        )}

        {!currentUserProfile && (
          <Link href="/login">
            <a
              className={
                router.pathname == "/login"
                  ? `${styles.navlink} active`
                  : `${styles.navlink}`
              }
            >
              Login
            </a>
          </Link>
        )}
        {!currentUserProfile && (
          <Link href="/sign-up">
            <a
              className={
                router.pathname == "/sign-up"
                  ? `${styles.navlink} active`
                  : `${styles.navlink}`
              }
            >
              Register
            </a>
          </Link>
        )}
      </div>
    </div>
  );
};

export default NavBar;
