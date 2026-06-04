"use client";
import { useState } from "react";

const navLinks = [
  { label: "Domov", href: "/" },
  { label: "Články", href: "/clanky" },
  { label: "Informácie o ADHD", href: "/informacie-o-adhd" },
  { label: "O nás", href: "/o-nas" },
  { label: "Kontakt", href: "/kontakt" },
];

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-8 py-4 border-b border-[#1e1e1e] bg-[rgba(10,10,10,0.92)] backdrop-blur-md">
      <a href="/" className="font-display text-xl font-extrabold tracking-tight">
        ADHD<span className="text-green-400">.</span>Slovakia
      </a>
      <div className="hidden md:flex gap-7 text-[13px] font-medium text-[#888]">
        {navLinks.map((item) => (
          <a key={item.label} href={item.href} className="hover:text-[#f0ede6] transition-colors">
            {item.label}
          </a>
        ))}
      </div>
      <button
        className="md:hidden flex flex-col gap-1.5 p-2"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Menu"
      >
        <span className={`block w-6 h-0.5 bg-[#f0ede6] transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
        <span className={`block w-6 h-0.5 bg-[#f0ede6] transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
        <span className={`block w-6 h-0.5 bg-[#f0ede6] transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
      </button>
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
        </div>
      )}
    </nav>
  );
}