import Link from "next/link";
import SignupForm from "../src/components/Form/SignUpForm";
import styles from "../styles/pages.module.css";
import Container from "../src/components/Layout/Container";
import { useAuth } from "../src/context/AuthContext";
import { useRouter } from "next/router";

const LoginPage = () => {
  const { login, signInWithGoogle, currentUserProfile, error, setError } =
    useAuth();

  const router = useRouter();

  if (currentUserProfile) {
    router.push("./");
  }

  const loginDummyAccount = () => {
    login("testAccount1234@email.com", "testaccount");
  };

  return (
    <>
      <Container>
        <div className={styles.pageContainer}>
          <h1>Login</h1>
          <SignupForm submitHandler={login} error={error} setError={setError} />
          <div>
            <div className={styles.signInFormFooter}>
              <button
                className={styles.googleSignInBtn}
                onClick={signInWithGoogle}
              >
                Sign In with Google
              </button>
              <Link href="/sign-up">
                <a className={styles.registerBtn}>Sign Up Here!</a>
              </Link>
              <Link href="/forgot-password">
                <a className={styles.forgotPasswordBtn}>
                  Forgot your Password?
                </a>
              </Link>
            </div>
            <div className={styles.signInFormFooter}>
              <button
                className={styles.testAccountBtn}
                onClick={loginDummyAccount}
              >
                Login with a test account!
              </button>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default LoginPage;
