/* eslint-disable react-hooks/rules-of-hooks */
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";

export function protectedRoutes(Component) {
  return function protectedRoutes(props) {
    const { currentUser } = useAuth();
    const router = useRouter();

    if (!currentUser) {
      router.replace("/login");
      return <h1>Loading...</h1>
    }
    return <Component {...props} />;
  };
};
