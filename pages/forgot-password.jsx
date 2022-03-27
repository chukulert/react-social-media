import ResetPasswordForm from "../src/components/Form/ResetPasswordForm";
import { useAuth } from "../src/context/AuthContext";
import Container from "../src/components/Layout/Container";
import styles from "../styles/pages.module.css";

const ForgotPasswordPage = () => {
  const { forgotPassword } = useAuth();

  return (
    <Container>
      <div className={styles.pageContainer}>
        <h1>Forgot Your Password</h1>
        <ResetPasswordForm submitHandler={forgotPassword} type={"email"} />
      </div>
    </Container>
  );
};

export default ForgotPasswordPage;
