"use client";
import { useSyncExternalStore } from "react";
import { useLocale } from "next-intl";

const THEME_CHANGE_EVENT = "adhd-theme-change";

function subscribeToTheme(callback: () => void) {
  window.addEventListener(THEME_CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(THEME_CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

function getThemeSnapshot(): "dark" | "light" {
  return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

export default function ThemeToggle() {
  const locale = useLocale();
  const theme = useSyncExternalStore(subscribeToTheme, getThemeSnapshot, () => "light");

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    if (newTheme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("theme", "light");
    }
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label={locale === "en"
        ? (theme === "dark" ? "Switch to light theme" : "Switch to dark theme")
        : (theme === "dark" ? "Prepnúť na svetlý režim" : "Prepnúť na tmavý režim")}
      aria-pressed={theme === "dark"}
      className="relative min-h-11 min-w-11 rounded-lg border border-[var(--border-color)] flex items-center justify-center hover:border-green-400/40 transition-colors shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
    >
      {/*
        Tento malý kúsok CSS zariadi, že prehliadač okamžite vie, ktorú ikonu schovať.
        Funguje to okamžite aj pri tvrdom reloade stránky bez akéhokoľvek blikania.
      */}
      <style dangerouslySetInnerHTML={{__html: `
        html[data-theme="dark"] .theme-icon-sun { display: block !important; }
        html[data-theme="dark"] .theme-icon-moon { display: none !important; }
        html:not([data-theme="dark"]) .theme-icon-sun { display: none !important; }
        html:not([data-theme="dark"]) .theme-icon-moon { display: block !important; }
      `}} />

      {/* IKONA: SLNKO (zobrazí sa len v dark režime) */}
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="theme-icon-sun text-[var(--text-secondary)]"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2" />
        <path d="M12 20v2" />
        <path d="m4.93 4.93 1.41 1.41" />
        <path d="m17.66 17.66 1.41 1.41" />
        <path d="M2 12h2" />
        <path d="M20 12h2" />
        <path d="m6.34 17.66-1.41 1.41" />
        <path d="m19.07 4.93-1.41 1.41" />
      </svg>

      {/* IKONA: MESIAC (zobrazí sa len v light režime) */}
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="theme-icon-moon text-[var(--text-secondary)]"
        aria-hidden="true"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
      </svg>
    </button>
  );
}
