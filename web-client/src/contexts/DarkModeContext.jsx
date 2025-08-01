import React, { createContext, useContext, useState, useEffect } from "react";

const DarkModeContext = createContext();

export function DarkModeProvider({ children }) {
  const [dark, setDark] = useState(() => localStorage.getItem("color-theme") === "dark");

  useEffect(() => {
    document.body.classList.toggle("dark", dark);
    document.documentElement.setAttribute("color-theme", dark ? "dark" : "light");
    localStorage.setItem("color-theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <DarkModeContext.Provider value={{ dark, setDark }}>
      {children}
    </DarkModeContext.Provider>
  );
}

export const useDarkMode = () => useContext(DarkModeContext);
