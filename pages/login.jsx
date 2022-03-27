import Link from "next/link";
import SignupForm from "../src/components/Form/SignUpForm";
import styles from "../styles/pages.module.css";
import Container from "../src/components/Layout/Container";
import NavBar from "../src/components/Nav/NavBar";
import { useAuth } from "../src/context/AuthContext";
import { useRouter } from "next/router";

const LoginPage = () => {
  const { login, signInWithGoogle, currentUserProfile } = useAuth();

  const router = useRouter()

  if(currentUserProfile) {
    router.push('./')
  }

  return (
    <>
    {/* <NavBar /> */}
    <Container>
      <div className={styles.pageContainer}>
        <h1>Login</h1>
        <SignupForm submitHandler={login} />
        <div className={styles.signInFormFooter}>
          <button className={styles.googleSignInBtn} onClick={signInWithGoogle}>
            Sign In with Google
          </button>
          <Link href="/sign-up">
            <a className={styles.registerBtn}>Sign Up Here!</a>
          </Link>
          <Link href="/forgot-password">
            <a className={styles.forgotPasswordBtn}>Forgot your Password?</a>
          </Link>
        </div>
      </div>
    </Container>
    </>
  );
};

export default LoginPage;
