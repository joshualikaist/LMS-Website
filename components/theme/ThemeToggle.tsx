"use client";

import { useEffect, useState } from "react";
import styles from "./ThemeToggle.module.css";

type Theme = "light" | "dark";

function setDocumentTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const syncTheme = () => {
      const saved = window.localStorage.getItem("theme");
      const nextTheme: Theme =
        saved === "light" || saved === "dark" ? saved : media.matches ? "dark" : "light";
      setDocumentTheme(nextTheme);
      setTheme(nextTheme);
    };

    syncTheme();
    media.addEventListener("change", syncTheme);
    return () => media.removeEventListener("change", syncTheme);
  }, []);

  function toggleTheme() {
    const nextTheme: Theme = theme === "dark" ? "light" : "dark";
    window.localStorage.setItem("theme", nextTheme);
    setDocumentTheme(nextTheme);
    setTheme(nextTheme);
  }

  const target = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      className={styles.button}
      onClick={toggleTheme}
      aria-label={`Switch to ${target} mode`}
      title={`Switch to ${target} mode`}
    >
      <span className={styles.mark} aria-hidden="true" />
      <span className={styles.label}>{theme ? theme.toUpperCase() : "THEME"}</span>
    </button>
  );
}
