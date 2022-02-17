/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from "react";
import SignupForm from "../src/components/Form/SignUpForm";
import { useAuth } from "../src/context/AuthContext";

const signUpPage = (props) => {
  const [error, setError] = useState(null);

  const {register} = useAuth();


  return (
    <>
    <h1>Registration</h1>
      <SignupForm submitHandler={register} />
      {error && <div>{error}</div>}
    </>
  );
};

export default signUpPage;
