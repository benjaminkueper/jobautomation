"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

interface LandingThemeCtx {
  isDark: boolean;
  toggle: () => void;
}

const THEME_KEY = "theme";

const Ctx = createContext<LandingThemeCtx>({ isDark: false, toggle: () => {} });

export function LandingThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    let dark = false;
    try {
      dark = window.localStorage.getItem(THEME_KEY) === "dark";
    } catch {
      /* ignore */
    }
    setIsDark(dark);
    document.documentElement.classList.toggle("dark", dark);
  }, []);

  const toggle = () => {
    setIsDark((prev) => {
      const next = !prev;
      try {
        window.localStorage.setItem(THEME_KEY, next ? "dark" : "light");
      } catch {
        /* ignore */
      }
      document.documentElement.classList.toggle("dark", next);
      return next;
    });
  };

  return (
    <Ctx.Provider value={{ isDark, toggle }}>
      {children}
    </Ctx.Provider>
  );
}

export const useLandingTheme = () => useContext(Ctx);