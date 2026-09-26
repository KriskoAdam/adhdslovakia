"use client";

import { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "../../i18n/navigation";
import MiniSelfCheckMobile from "./MiniSelfCheckmobile";
import ThemeToggle from "./ThemeToggle";

const navLinks = [
  { key: "home", href: "/" },
  { key: "articles", href: "/clanky" },
  { key: "adhdInfo", href: "/informacie-o-adhd" },
  { key: "about", href: "/o-nas" },
  { key: "contact", href: "/kontakt" },
] as const;

const languages = [
  { label: "Slovenčina", code: "sk" as const },
  { label: "English", code: "en" as const },
];

export default function Nav() {
  const t = useTranslations("Navigation");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [testOpen, setTestOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const currentLanguage =
    languages.find((lang) => lang.code === locale)?.label ?? "Slovenčina";

  useEffect(() => {
    document.body.style.overflow = testOpen ? "hidden" : "unset";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [testOpen]);

 const changeLanguage = (langCode: "sk" | "en") => {
  setLangOpen(false);
  setMenuOpen(false);

  // Odstráni locale prefix, ak sa náhodou nachádza v pathname
  const cleanPathname = pathname.replace(/^\/(sk|en)(?=\/|$)/, "");

  // Zachová aktuálnu stránku a nastaví nový locale
  router.replace(cleanPathname || "/", {
    locale: langCode,
  });
};

  const openTest = () => {
    setMenuOpen(false);
    setTestOpen(true);
  };

  const closeTest = () => {
    setTestOpen(false);
  };

  return (
    <>
      <nav className="sticky top-0 z-50 flex items-center justify-between px-4 lg:px-8 py-4 border-b border-[var(--border-color)] bg-[var(--bg-primary)]/92 backdrop-blur-md w-full">

        {/* Logo */}
        <Link
          href="/"
          className="font-display text-xl font-extrabold tracking-tight shrink-0 text-[var(--text-primary)]"
        >
          ADHD<span className="text-green-400">.</span>Slovakia
        </Link>

        {/* Desktop menu */}
        <div className="hidden lg:flex gap-6 xl:gap-8 text-[13px]">
          {navLinks.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.key}
                href={item.href}
                className={`transition-colors duration-200 font-semibold whitespace-nowrap ${
                  isActive
                    ? "text-green-400"
                    : "text-[var(--text-secondary)] hover:text-green-400"
                }`}
              >
                {t(item.key)}
              </Link>
            );
          })}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3 shrink-0">

          {/* Theme */}
          <ThemeToggle />

          {/* Language selector */}
          {/* Language selector */}
<div className="hidden lg:block relative shrink-0">
  <button
    onClick={() => setLangOpen(!langOpen)}
    aria-label={locale === "sk" ? "Zmeniť jazyk" : "Change language"}
    aria-expanded={langOpen}
    className={`
      group flex items-center
      h-9 w-[132px]
      px-3
      rounded-md
      border border-[var(--border-color)]
      bg-[var(--bg-secondary)]
      transition-all duration-200
      cursor-pointer
      ${
        langOpen
          ? "border-green-400/50 bg-[var(--bg-tertiary)]"
          : "hover:border-green-400/30 hover:bg-[var(--bg-tertiary)]"
      }
    `}
  >
    <span
      className="w-4 shrink-0 text-[13px] text-[var(--text-muted)] group-hover:text-green-400 transition-colors"
      aria-hidden="true"
    >
      ◉
    </span>

    <span className="ml-1.5 mr-2 whitespace-nowrap text-[11px] font-medium text-[var(--text-secondary)]">
      {locale === "sk" ? "Jazyk" : "Language"}
    </span>

    <span className="ml-auto shrink-0 text-[11px] font-bold text-[var(--text-primary)]">
      {locale === "sk" ? "SK" : "EN"}
    </span>

    <span
      className={`
        ml-1.5 shrink-0
        text-[8px] leading-none
        text-[var(--text-muted)]
        transition-transform duration-200
        ${langOpen ? "rotate-180" : ""}
      `}
      aria-hidden="true"
    >
      ▼
    </span>
  </button>

  {langOpen && (
    <div
      className="
        absolute top-[calc(100%+6px)] right-0
        w-[132px]
        overflow-hidden
        rounded-md
        border border-[var(--border-color)]
        bg-[var(--bg-secondary)]
        shadow-[0_12px_30px_rgba(0,0,0,0.25)]
        z-[100]
      "
    >
      <div className="px-3 py-2 border-b border-[var(--border-color)]">
        <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-[var(--text-muted)]">
          {locale === "sk" ? "Jazyk" : "Language"}
        </span>
      </div>

      <div className="p-1">
        {languages.map((lang) => {
          const isSelected = locale === lang.code;

          return (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`
                w-full flex items-center gap-2
                px-2.5 py-2
                rounded-[4px]
                text-left
                transition-colors duration-150
                cursor-pointer
                ${
                  isSelected
                    ? "bg-green-400/10 text-green-400"
                    : "text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]"
                }
              `}
            >
              <span className="shrink-0 text-[15px] leading-none">
                {lang.code === "sk" ? "🇸🇰" : "🇬🇧"}
              </span>

              <span className="min-w-0 flex-1 truncate text-[11px] font-medium">
                {lang.label}
              </span>

              {isSelected && (
                <span className="shrink-0 text-[11px] text-green-400">
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  )}
</div>
          {/* Hamburger */}
          <button
            className="lg:hidden flex flex-col gap-1.5 p-2 cursor-pointer select-none"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <span
              className={`block w-6 h-0.5 bg-[var(--text-primary)] transition-all duration-300 ${
                menuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />

            <span
              className={`block w-6 h-0.5 bg-[var(--text-primary)] transition-all duration-300 ${
                menuOpen ? "opacity-0" : ""
              }`}
            />

            <span
              className={`block w-6 h-0.5 bg-[var(--text-primary)] transition-all duration-300 ${
                menuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </button>
        </div>

        {/* Mobile menu */}
        <div
          className={`absolute top-full left-0 right-0 bg-[var(--bg-primary)] border-b border-[var(--border-color)] flex-col lg:hidden max-h-[85vh] overflow-y-auto ${
            menuOpen ? "flex" : "hidden"
          }`}
        >
          {navLinks.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.key}
                href={item.href}
                className={`px-6 py-4 text-[14px] font-semibold border-t border-[var(--border-color)] transition-colors ${
                  isActive
                    ? "text-green-400"
                    : "text-[var(--text-secondary)] hover:text-green-400"
                }`}
                onClick={() => setMenuOpen(false)}
              >
                {t(item.key)}
              </Link>
            );
          })}

          {/* ADHD test */}
          <button
            onClick={openTest}
            className="px-6 py-4 text-[14px] font-semibold text-green-400 hover:text-green-300 border-t border-[var(--border-color)] transition-colors flex items-center gap-3 text-left cursor-pointer"
          >
            <span className="text-xl">🧠</span>

            <span>
              {locale === "sk"
                ? "Urobiť si ADHD test"
                : "Take the ADHD test"}
            </span>

            <span className="ml-auto text-xs bg-green-400/10 px-2.5 py-1 rounded text-green-400 font-medium">
              {locale === "sk" ? "NOVÉ" : "NEW"}
            </span>
          </button>

          {/* Mobile language selector */}
          <div className="px-6 py-5 border-t border-[var(--border-color)] bg-[var(--bg-tertiary)] flex flex-col gap-2.5">
            <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
              {locale === "sk" ? "Zmeniť jazyk" : "Change language"}
            </span>

            <div className="grid grid-cols-2 gap-2">
              {languages.map((lang) => {
                const isSelected = locale === lang.code;

                return (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={`px-3 py-2.5 text-[12px] font-semibold rounded-[6px] text-center transition-all cursor-pointer ${
                      isSelected
                        ? "bg-green-400/10 border border-green-400 text-green-400"
                        : "bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[#333]"
                    }`}
                  >
                    {lang.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* ADHD test modal */}
      {testOpen && (
        <div className="fixed inset-0 z-[100] bg-[var(--bg-primary)] overflow-y-auto">
          <div className="min-h-screen p-4 pb-20">

            <div className="sticky top-0 z-10 bg-[var(--bg-primary)]/95 backdrop-blur-md border-b border-[var(--border-color)] -mx-4 px-4 py-4 flex items-center justify-between">

              <div className="flex items-center gap-3">
                <span className="text-2xl">🧠</span>

                <div>
                  <h2 className="font-display text-lg font-bold text-[var(--text-primary)]">
                    ADHD Test
                  </h2>

                  <p className="text-[11px] text-[var(--text-muted)]">
                    {locale === "sk"
                      ? "Orientácia podľa DSM-5"
                      : "Screening based on DSM-5"}
                  </p>
                </div>
              </div>

              <button
                onClick={closeTest}
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-2xl leading-none px-3 py-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="mt-4">
              <MiniSelfCheckMobile />
            </div>
          </div>
        </div>
      )}
    </>
  );
}