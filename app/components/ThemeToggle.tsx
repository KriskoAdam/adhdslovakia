"use client";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  // Stav používame už len na to, aby sme vedeli, čo máme nastaviť po kliknutí
  const [theme, setTheme] = useState<"dark" | "light">("light");

  useEffect(() => {
    // Hneď po načítaní zosynchronizujeme stav s tým, čo je reálne na webe
    const currentTheme = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
    setTheme(currentTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    if (newTheme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label="Prepnúť tému"
      className="relative w-9 h-9 rounded-lg border border-[var(--border-color)] flex items-center justify-center hover:border-green-400/40 transition-colors shrink-0"
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
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
      </svg>
    </button>
  );
}
