"use client";
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "Light" | "Dark" | "System";

const ThemeCtx = createContext<{
  theme: Theme;
  setTheme: (t: Theme) => void;
}>({ theme: "Light", setTheme: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("System");

  // Restore on mount
  useEffect(() => {
    const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith('providius-theme='))
      ?.split('=')[1];
    const saved = (cookieValue || localStorage.getItem("providius-theme")) as Theme | null;
    
    if (saved === "Light" || saved === "Dark" || saved === "System") {
      setThemeState(saved);
    }
  }, []);

  // Apply class to <html> whenever theme changes
  useEffect(() => {
    const root = document.documentElement;
    const isDark =
      theme === "Dark" || 
      (theme === "System" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    
    // Apply class to both html and body for maximum compatibility with Tailwind 'class' mode
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    
    localStorage.setItem("providius-theme", theme);
    document.cookie = `providius-theme=${theme}; path=/; max-age=31536000; SameSite=Lax`;

    // If "System", listen for OS changes
    if (theme === "System") {
      const mql = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = (e: MediaQueryListEvent) => {
        root.classList.toggle("dark", e.matches);
      };
      mql.addEventListener("change", handler);
      return () => mql.removeEventListener("change", handler);
    }
  }, [theme]);

  const setTheme = (t: Theme) => setThemeState(t);
  return <ThemeCtx.Provider value={{ theme, setTheme }}>{children}</ThemeCtx.Provider>;
}

export const useTheme = () => useContext(ThemeCtx);