import Head from "next/head";
import { useContext } from "react";
import { useAuth } from "../src/context/AuthContext";

export default function Home() {
  // const {currentUser} = useContext(AuthContext)
  const {currentUser}  = useAuth();
  console.log(currentUser)

  return (
    <div>
      <div>This is the homepage</div>
      {currentUser && <div>{`The current user is ${currentUser}`}</div>}
    </div>
  );
}
