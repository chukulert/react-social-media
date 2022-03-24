import { useState, useRef, useEffect } from "react";
import useSWR, { mutate, useSWRConfig } from "swr";
import { fetcher } from "../../utils";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../../context/AuthContext";
import useWindowSize from "../../hooks/useWindowSize";
import styles from "./NavBar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
import useLocalStorage from "use-local-storage";
import NotificationItem from "./NotificationItem";



const NavBar = ({currentUserProfile}) => {
  const { logout } = useAuth();
  const [expandedMenu, setExpandedMenu] = useState(false);
  const [expandedNotification, setExpandedNotification] = useState(false);
  const { width } = useWindowSize();
  const dropDownRef = useRef();
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

  const [theme, setTheme] = useLocalStorage(
    "theme", ''
  );

  useEffect(() => {
    const defaultDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (defaultDark) setTheme('dark')
  }, [])

  const switchTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    if (newTheme === "light") {
      document.body.classList.add("light-theme");
    } else {
      document.body.classList.remove("light-theme");
    }
    setTheme(newTheme);
  };

  const { data: notifications, error: notificationsError } = useSWR(
    currentUserProfile ? `/api/getNotifications?id=${currentUserProfile.userID}` : null,
    fetcher,
    {
      // refreshInterval: 1000,
      revalidateIfStale: false,
      revalidateOnFocus: false,
    }
  );
  if(notifications) console.log(notifications)

  const notificationsList = (
    <div>
      {notifications?.map((notification) => (
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
  };

  const closeNotification = () => {
    setExpandedNotification(false);
    // dropDownRef.current.classList.toggle("active");
  };

  const loadProfilePage = () => {
    router.push(`/profile/${currentUserProfile.userID}`);
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

     
      <div className={
        width > 768
          ? `${styles.navlinks}`
          : `${styles.navlinks} ${styles.navMobileLinks}`
      }>
         {/* home */}
        {currentUserProfile && (<Link href="/">
          <a
            className={
              router.pathname == "/"
                ? `${styles.navlink} active`
                : `${styles.navlink}`
            }
          >
            <FontAwesomeIcon icon="fa-solid fa-house" />
          </a>
        </Link>)}
      
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
            <div ref={dropDownRef}>
              <FontAwesomeIcon
                icon="fa-solid fa-bell"
                className={`${styles.dropbtn} ${styles.navlink}`}
              />
            </div>

            {expandedNotification && (
              <div id="dropDown" className={styles.dropdownContent}>
                {notificationsList}
              </div>
            )}
          </div>
        )}

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
                  <FontAwesomeIcon icon="fa-solid fa-user" /> Profile Page
                </a>

                <a onClick={switchTheme}>
                  <FontAwesomeIcon icon="fa-solid fa-cloud-sun" /> Switch Theme
                </a>
                <a onClick={logout}>
                  <FontAwesomeIcon icon="fa-solid fa-arrow-right-from-bracket" />
                  Logout
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
