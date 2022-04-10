import "../styles/globals.css";
import AuthContextProvider from "../src/context/AuthContext";
import useLocalStorage from "use-local-storage";
import { useState, useEffect } from "react";
import NavBar from "../src/components/Nav/NavBar";
import Router from "next/router";
import Head from "next/head";
import Loader from "../src/components/Loader/Loader";

function MyApp({ Component, pageProps }) {
  const [theme, setTheme] = useLocalStorage("theme", "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const start = () => {
      setLoading(true);
    };
    const end = () => {
      setLoading(false);
    };
    Router.events.on("routeChangeStart", start);
    Router.events.on("routeChangeComplete", end);
    Router.events.on("routeChangeError", end);
    return () => {
      Router.events.off("routeChangeStart", start);
      Router.events.off("routeChangeComplete", end);
      Router.events.off("routeChangeError", end);
    };
  }, []);

  useEffect(() => {
    if (theme) {
      theme === "light"
        ? document.body.classList.add("light-theme")
        : document.body.classList.remove("light-theme");
    } else {
      const defaultDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      if (defaultDark) setTheme("dark");
    }
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
        <NavBar switchTheme={switchTheme} />
        {loading ? (
          <div className="loader">
            <Loader />
          </div>
        ) : (
          <Component {...pageProps} />
        )}
      </AuthContextProvider>
    </>
  );
}

export default MyApp;
