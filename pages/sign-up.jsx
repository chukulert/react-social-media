import SignupForm from "../src/components/Form/SignUpForm";
import { useAuth } from "../src/context/AuthContext";
import Container from "../src/components/Layout/Container";
import styles from '../styles/pages.module.css'
import { useRouter } from "next/router";

const SignUpPage = () => {
  const { register, currentUserProfile } = useAuth();
  const router = useRouter()

  if(currentUserProfile) {
    router.push('./')
  }


  return (
    <>
    <Container>
      <div className={styles.pageContainer}>
        <h1>Register for an Account</h1>
        <SignupForm submitHandler={register} />
      </div>
    </Container>
    </>
  );
};

export default SignUpPage;
