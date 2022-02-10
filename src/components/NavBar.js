import Link from "next/link";
import { useAuth } from "../context/AuthContext";

const NavBar = () => {
  const { currentUser, logout } = useAuth();

  return (
    <div>
      <p>This is the navbar</p>
      <Link href="/">
        <a>Home</a>
      </Link>
      {!currentUser && (
        <Link href="/login">
          <a>Login</a>
        </Link>
      )}
      {!currentUser && (
        <Link href="/sign-up">
          <a>Register</a>
        </Link>
      )}
      {currentUser && (
        <Link href="/profile">
          <a>Profile</a>
        </Link>
      )}
      {currentUser && <a onClick={logout}>Logout</a>}
    </div>
  );
};

export default NavBar;
