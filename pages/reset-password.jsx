/* eslint-disable react-hooks/rules-of-hooks */
import ResetPasswordForm from "../src/components/ResetPasswordForm";
import { useAuth } from "../src/context/AuthContext";
import { useRouter } from "next/router";
import Container from "../src/components/Layout/Container";
import styles from "../styles/pages.module.css";

const resetPasswordPage = (props) => {
  const { resetPassword } = useAuth();
  const router = useRouter();
  const { oobCode } = router.query;

  return (
    <Container>
      <div className={styles.pageContainer}>
        <h1>Reset Your Password</h1>
        <ResetPasswordForm
          submitHandler={resetPassword}
          type={"password"}
          oobCode={oobCode}
        />
      </div>
    </Container>
  );
};

export default resetPasswordPage;
