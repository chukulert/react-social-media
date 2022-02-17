/* eslint-disable react-hooks/rules-of-hooks */
import Link from "next/link";
import SignupForm from "../src/components/Form/SignUpForm";

import { useAuth } from "../src/context/AuthContext";

const logInPage = (props) => {
//   const [error, setError] = useState(null);

  const {login, signInWithGoogle, error} = useAuth()

  return (
    <>
    <h1>Login</h1>
      <SignupForm submitHandler={login} />
    <button onClick={signInWithGoogle}>Sign In with Google</button>
      {error && <div>{error}</div>}
      <Link href='/forgot-password'><a>Forgot your Password</a></Link>
    </>
  );
};

export default logInPage;
