import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import styles from "./NavBar.module.css";

const NavBar = ({switchTheme}) => {
  const { currentUser, logout } = useAuth();

  return (
    <div className={styles.navbar}>
      <div className={styles.navlinks}>
        <button onClick={switchTheme}>Switch Theme</button>
        <Link href="/">
          <a className={styles.navlink}>Home</a>
        </Link>
        {!currentUser && (
          <Link href="/login">
            <a className={styles.navlink}>Login</a>
          </Link>
        )}
        {!currentUser && (
          <Link href="/sign-up">
            <a className={styles.navlink}>Register</a>
          </Link>
        )}
        {currentUser && (
          <Link href={`/profile/${currentUser.uid}`}>
            <a className={styles.navlink}>Profile</a>
          </Link>
        )}
        {currentUser && <a className={styles.navlink} onClick={logout}>Logout</a>}
      </div>
    </div>
  );
};

export default NavBar;
