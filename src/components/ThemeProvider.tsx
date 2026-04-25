"use client";
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "Light" | "Dark" | "System";

const ThemeCtx = createContext<{
  theme: Theme;
  setTheme: (t: Theme) => void;
}>({ theme: "Light", setTheme: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("Light");

  // Apply class to <html> whenever theme changes
  useEffect(() => {
    const root = document.documentElement;
    const isDark =
      theme === "Dark" ||
      (theme === "System" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    root.classList.toggle("dark", isDark);
    localStorage.setItem("providius-theme", theme);
  }, [theme]);

  // Restore on mount
  useEffect(() => {
    const saved = localStorage.getItem("providius-theme") as Theme | null;
    if (saved) setThemeState(saved);
  }, []);

  const setTheme = (t: Theme) => setThemeState(t);
  return <ThemeCtx.Provider value={{ theme, setTheme }}>{children}</ThemeCtx.Provider>;
}

export const useTheme = () => useContext(ThemeCtx);