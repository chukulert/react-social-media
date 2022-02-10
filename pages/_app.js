import NavBar from "../src/components/NavBar";
import AuthContextProvider from "../src/context/AuthContext";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <AuthContextProvider>
      <NavBar/>
      <Component {...pageProps} />
    </AuthContextProvider>      
  );
}

export default MyApp;
