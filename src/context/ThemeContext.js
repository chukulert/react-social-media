import { useState, useEffect } from "react";
import { createContext } from "react";

export const themes = {
  dark: "",
  light: "light-theme",
};

export const ThemeContext = createContext({
    theme: themes.dark,
  changeTheme: () => {},
});

export const ThemeContextWrapper = (props) => {
    const [theme, setTheme] = useState(themes.dark);
  
    function changeTheme(theme) {
      setTheme(theme);
    }
  
    useEffect(() => {
      switch (theme) {
        case themes.light:
          document.body.classList.add('light-theme');
          break;
        case themes.dark:
        default:
          document.body.classList.remove('light-theme');
          break;
      }
    }, [theme]);
  
    return (
      <ThemeContext.Provider value={{ theme: theme, changeTheme: changeTheme }}>
        {props.children}
      </ThemeContext.Provider>
    );
  }