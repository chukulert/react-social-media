/* eslint-disable react-hooks/rules-of-hooks */
import ResetPasswordForm from "../src/components/ResetPasswordForm";
import { useAuth } from "../src/context/AuthContext";
import { useRouter } from "next/router";

const resetPasswordPage = (props) => {
  const {resetPassword, error} = useAuth();
  const router = useRouter();
    // console.log(router.query
    const {oobCode} = router.query; 

  return (
    <>
    <h1>Reset Your Password</h1>
      <ResetPasswordForm submitHandler={resetPassword} type={'password'} oobCode={oobCode} />
      {error && <div>{error}</div>}
    </>
  );
};

export default resetPasswordPage;