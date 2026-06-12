"use client";

import { useState, useEffect } from "react";
import MiniSelfCheckMobile from "./MiniSelfCheckmobile";

const navLinks = [
  { label: "Domov", href: "/" },
  { label: "Články", href: "/clanky" },
  { label: "Informácie o ADHD", href: "/informacie-o-adhd" },
  { label: "O nás", href: "/o-nas" },
  { label: "Kontakt", href: "/kontakt" },
];

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [testOpen, setTestOpen] = useState(false);

  // Blokovanie scrollovania stránky pri otvorenom teste
  useEffect(() => {
    if (testOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [testOpen]);

  const openTest = () => {
    setMenuOpen(false);
    setTestOpen(true);
  };

  const closeTest = () => {
    setTestOpen(false);
  };

  return (
    <>
      <nav className="sticky top-0 z-50 flex items-center justify-between px-4 md:px-8 py-4 border-b border-[#1e1e1e] bg-[rgba(10,10,10,0.92)] backdrop-blur-md w-full">
        <a href="/" className="font-display text-xl font-extrabold tracking-tight">
          ADHD<span className="text-green-400">.</span>Slovakia
        </a>

        <div className="hidden md:flex gap-7 text-[13px] font-medium text-[#888]">
          {navLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="hover:text-[#f0ede6] transition-colors"
            >
              {item.label}
            </a>
          ))}
        </div>

        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span
            className={`block w-6 h-0.5 bg-[#f0ede6] transition-all duration-300 ${
              menuOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-[#f0ede6] transition-all duration-300 ${
              menuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-[#f0ede6] transition-all duration-300 ${
              menuOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="absolute top-full left-0 right-0 bg-[#0a0a0a] border-b border-[#1e1e1e] flex flex-col md:hidden">
            {navLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="px-8 py-4 text-[14px] font-medium text-[#888] hover:text-[#f0ede6] border-t border-[#1e1e1e] transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}

            {/* Nová položka - ADHD Test */}
            <button
              onClick={openTest}
              className="px-8 py-4 text-[14px] font-semibold text-green-400 hover:text-green-300 border-t border-[#1e1e1e] transition-colors flex items-center gap-3 text-left"
            >
              <span className="text-xl">🧠</span>
              <span>Urobiť si ADHD test</span>
              <span className="ml-auto text-xs bg-green-400/10 px-2.5 py-1 rounded text-green-400 font-medium">
                NOVÉ
              </span>
            </button>
          </div>
        )}
      </nav>

      {/* Fullscreen Modal pre mobilný test */}
      {testOpen && (
        <div className="fixed inset-0 z-[100] bg-[#0a0a0a] overflow-y-auto">
          <div className="min-h-screen p-4 pb-20">
            {/* Header modálu */}
            <div className="sticky top-0 z-10 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-[#1e1e1e] -mx-4 px-4 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🧠</span>
                <div>
                  <h2 className="font-display text-lg font-bold text-[#f0ede6]">
                    ADHD Test
                  </h2>
                  <p className="text-[11px] text-[#555]">Orientácia podľa DSM-5</p>
                </div>
              </div>

              <button
                onClick={closeTest}
                className="text-[#888] hover:text-white text-2xl leading-none px-3 py-1"
              >
                ✕
              </button>
            </div>

            {/* Mobilný test */}
            <div className="mt-4">
              <MiniSelfCheckMobile />
            </div>
          </div>
        </div>
      )}
    </>
  );
}