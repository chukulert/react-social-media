import "../styles/globals.css";
import { useEffect } from "react";
import AuthContextProvider from "../src/context/AuthContext";
import useLocalStorage from "use-local-storage";
import NavBar from "../src/components/Nav/NavBar";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  const [theme, setTheme] = useLocalStorage("theme", "");

  useEffect(() => {
    const defaultDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    if (defaultDark) setTheme("dark");
  }, []);

  const switchTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    if (newTheme === "light") {
      document.body.classList.add("light-theme");
    } else {
      document.body.classList.remove("light-theme");
    }
    setTheme(newTheme);
  };

  return (
    <>
    <Head>
    <title>Connect Me</title>
    <meta name="Connect Me" content="Social Media App connecting users" />
    <link rel="icon" href="/favicon.png" />
  </Head>
    <AuthContextProvider>
      <NavBar switchTheme={switchTheme}/>
      <Component {...pageProps}  />
    </AuthContextProvider>
    </>
  );
}

export default MyApp;