import { useState, useRef } from "react";
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


const NavBar = ({ switchTheme }) => {
  const { currentUser, logout, currentUserProfile } = useAuth();
  const [expandedMenu, setExpandedMenu] = useState(false);
  const [expandedNotification, setExpandedNotification] = useState(false);
  const { height, width } = useWindowSize();
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
    // dropDownRef.current.classList.toggle("active");
  };

  const closeNotification = () => {
    setExpandedNotification(false);
    // dropDownRef.current.classList.toggle("active");
  };

  const loadProfilePage = () => {
    router.push(`/profile/${currentUser.uid}`);
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
          <Link href={`/profile/${currentUser.uid}`}>
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

      {/* home */}
      <div className={
        width > 768
          ? `${styles.navlinks}`
          : `${styles.navlinks} ${styles.navMobileLinks}`
      }>
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

        {/* notification */}
        {currentUser && (
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

        {currentUser && (
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
        {currentUser && (
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

        {!currentUser && (
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
        {!currentUser && (
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
