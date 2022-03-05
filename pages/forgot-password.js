/* eslint-disable react-hooks/rules-of-hooks */
import ResetPasswordForm from '../src/components/Form/ResetPasswordForm'
import { useAuth } from "../src/context/AuthContext";

const forgotPasswordPage = (props) => {
  const {forgotPassword, error} = useAuth();

  return (
    <>
    <h1>Forgot Your Password</h1>
      <ResetPasswordForm submitHandler={forgotPassword} type={'email'} />
      {error && <div>{error}</div>}
    </>
  );
};

export default forgotPasswordPage;