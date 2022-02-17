import NavBar from "../src/components/NavBar";
import AuthContextProvider from "../src/context/AuthContext";
import "../styles/globals.css";
import useLocalStorage from "use-local-storage";
import { useEffect } from "react/cjs/react.development";

function MyApp({ Component, pageProps }) {
  
  const [theme, setTheme] = useLocalStorage(
    "theme", ''
  );

  useEffect(() => {
    const defaultDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (defaultDark) setTheme('dark')
  }, [])

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
    <AuthContextProvider>
      <NavBar switchTheme={switchTheme} />
      <Component {...pageProps} />
    </AuthContextProvider>
  );
}

export default MyApp;
