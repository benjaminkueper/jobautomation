"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useTheme } from "next-themes";

interface LandingThemeCtx {
  isDark: boolean;
  toggle: () => void;
}

const Ctx = createContext<LandingThemeCtx>({ isDark: false, toggle: () => {} });

/** Thin adapter over next-themes — single source of truth, no duplicate storage. */
export function LandingThemeProvider({ children }: { children: ReactNode }) {
  const { resolvedTheme, theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  useEffect(() => {
    if (!mounted) return;
    setIsDark((resolvedTheme ?? theme) === "dark");
  }, [mounted, resolvedTheme, theme]);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    setTheme(next ? "dark" : "light");
  };

  return <Ctx.Provider value={{ isDark, toggle }}>{children}</Ctx.Provider>;
}

export const useLandingTheme = () => useContext(Ctx);
