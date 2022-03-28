import ResetPasswordForm from "../src/components/Form/ResetPasswordForm";
import { useAuth } from "../src/context/AuthContext";
import { useRouter } from "next/router";
import Container from "../src/components/Layout/Container";
import styles from "../styles/pages.module.css";

const ResetPasswordPage = (props) => {
  const { resetPassword, currentUserProfile } = useAuth();
  const router = useRouter();
  const { oobCode } = router.query;

  if(currentUserProfile) {
    router.push('./')
  }


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

export default ResetPasswordPage;
