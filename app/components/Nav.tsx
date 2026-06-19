"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation"; // Import hooku na detekciu aktuálnej URL
import MiniSelfCheckMobile from "./MiniSelfCheckmobile";

const navLinks = [
  { label: "Domov", href: "/" },
  { label: "Články", href: "/clanky" },
  { label: "Informácie o ADHD", href: "/informacie-o-adhd" },
  { label: "O nás", href: "/o-nas" },
  { label: "Kontakt", href: "/kontakt" },
];

// Zoznam jazykov pre tvoje vlastné menu
const languages = [
  { label: "Slovenčina", code: "sk" },
  { label: "English", code: "en" },
  { label: "Čeština", code: "cs" },
  { label: "Maďarčina", code: "hu" },
  { label: "Nemčina", code: "de" },
  { label: "Poľština", code: "pl" },
];

export default function Nav() {
  const pathname = usePathname(); // Získanie aktuálnej cesty (napr. "/" alebo "/clanky")
  const [menuOpen, setMenuOpen] = useState(false);
  const [testOpen, setTestOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("Vyberte jazyk");

  // Načítanie aktuálne zvoleného jazyka z cookie pri prvom načítaní stránky
  useEffect(() => {
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(";").shift();
    };

    const googtrans = getCookie("googtrans");
    if (googtrans) {
      const langCode = googtrans.split("/").pop();
      const foundLang = languages.find((l) => l.code === langCode);
      if (foundLang) {
        setCurrentLang(foundLang.label);
        return;
      }
    }
    setCurrentLang("Vyberte jazyk");
  }, []);

  // Sledovanie zmeny html lang atribútu — zachytí, keď Google Translate
  // reálne preloží stránku a nastaví lang="en" a pod. Vďaka tomu sa
  // tlačidlo a stav currentLang zosynchronizujú okamžite, nielen pri loade.
  useEffect(() => {
    const updateLangFromHtml = () => {
      // Ak sme práve klikli na "Slovenčina", chceme zostať na sk natrvalo
      // pre túto session, aj keby Google Translate skript ešte na chvíľu
      // vrátil starý lang atribút (napr. tesne po reloade).
      if (sessionStorage.getItem("forceLangSk") === "1") {
        setCurrentLang("Slovenčina");
        return;
      }

      const htmlLang = document.documentElement.getAttribute("lang") || "sk";
      const code = htmlLang.split("-")[0];
      const foundLang = languages.find((l) => l.code === code);
      if (foundLang) {
        setCurrentLang(foundLang.label);
      }
    };

    updateLangFromHtml();
    const observer = new MutationObserver(updateLangFromHtml);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["lang"],
    });

    return () => observer.disconnect();
  }, []);

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

  // Funkcia na prepínanie jazyka pomocou Google Translate cookie
  const changeLanguage = (langCode: string) => {
    if (langCode === "sk") {
      // Zmazanie googtrans cookie na všetkých bežných variantoch cesty/domény,
      // pretože Google Translate vie cookie zapísať s rôznym path/domain
      // a stačí jeden "zabudnutý" zápis, aby sa preklad nevypol.
      const hostname = window.location.hostname;
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${hostname};`;
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${hostname};`;

      // Explicitne vrátime html lang na "sk" HNEĎ, predtým než stránka stihne
      // reloadnúť. Google Translate widget niekedy nestihne sám obnoviť
      // lang atribút na <html> len kvôli zmazanej cookie, takže to nastavíme ručne.
      document.documentElement.lang = "sk";

      // Lokálny flag, aby sme po reloade vedeli, že ide o explicitný návrat
      // na slovenčinu, a MutationObserver tým pádom nemal dôvod prepísať
      // currentLang naspäť podľa starého lang atribútu, ak by ho Translate
      // ešte na chvíľu obnovil.
      sessionStorage.setItem("forceLangSk", "1");

      // KĽÚČOVÁ ČASŤ: priamo ovládneme skrytý <select class="goog-te-combo">,
      // ktorý si Google Translate widget vytvára sám. Samotné zmazanie cookie
      // totiž widget často "neposlúchne" pri prvom reloade, lebo widget má
      // svoj vlastný interný stav nezávislý od cookie. Nastavením selectu na
      // prázdnu hodnotu (čo zodpovedá pôvodnému jazyku) a vyvolaním "change"
      // donútime widget reálne sa vrátiť, takže netreba klikať druhýkrát.
      const combo = document.querySelector(
        "select.goog-te-combo"
      ) as HTMLSelectElement | null;
      if (combo) {
        combo.value = "sk";
        combo.dispatchEvent(new Event("change"));
        // Necháme widgetu chvíľu na spracovanie, potom až reloadneme,
        // aby sa zmena stihla prejaviť skôr, než stránku znova načítame.
        setTimeout(() => {
          window.location.reload();
        }, 150);
        return;
      }
    } else {
      document.cookie = `googtrans=/sk/${langCode}; path=/;`;
      document.cookie = `googtrans=/sk/${langCode}; path=/; domain=${window.location.hostname};`;
      sessionStorage.removeItem("forceLangSk");
    }
    window.location.reload();
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
      <nav className="sticky top-0 z-50 flex items-center justify-between px-4 lg:px-8 py-4 border-b border-[#1e1e1e] bg-[rgba(10,10,10,0.92)] backdrop-blur-md w-full">
        {/* Logo */}
        <a
          href="/"
          className="font-display text-xl font-extrabold tracking-tight shrink-0 text-[#f0ede6]"
        >
          ADHD<span className="text-green-400">.</span>Slovakia
        </a>

        {/* Hlavné menu pre PC */}
        <div className="hidden lg:flex gap-6 xl:gap-8 text-[13px]">
          {navLinks.map((item) => {
            const isActive = pathname === item.href;
            return (
              <a
                key={item.label}
                href={item.href}
                className={`transition-colors duration-200 font-semibold whitespace-nowrap ${
                  isActive 
                    ? "text-green-400" 
                    : "text-[#888] hover:text-green-400"
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </div>

        {/* Pravá strana: Jazyk (iba PC) + Hamburger (mobil/tablet) */}
        <div className="flex items-center gap-4 shrink-0">
          
          {/* DESKTOP DIZAJN JAZYKOV: Skrytý na mobiloch a tabletoch (hidden lg:block) */}
          <div className="hidden lg:block relative shrink-0">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="bg-[#141414] border border-[#4ade80] hover:border-green-300 rounded-[6px] py-2 px-3 text-[13px] font-medium text-[#cfcfcf] w-[135px] text-center transition-all cursor-pointer"
            >
              {currentLang}
            </button>

            <div id="google_translate_element" className="hidden" />

            {langOpen && (
              <div className="absolute top-full mt-1.5 right-0 w-[135px] bg-[#141414] border border-[#4ade80] rounded-[6px] overflow-hidden z-[100] flex flex-col shadow-xl">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      changeLanguage(lang.code);
                      setLangOpen(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-[13px] text-[#ffffff] hover:bg-[#1e1e1e] hover:text-[#4ade80] transition-colors bg-transparent border-none cursor-pointer"
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Hamburger tlačidlo – na mobile teraz sedí dokonale na pravom kraji */}
          <button
            className="lg:hidden flex flex-col gap-1.5 p-2 cursor-pointer select-none"
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
        </div>

        {/* Mobilné a tabletové rozbaľovacie Menu.
            DÔLEŽITÉ: menu je v DOMe prítomné VŽDY (žiadne podmienené {menuOpen && ...}).
            Viditeľnosť riešime cez className block/hidden, aby ho Google Translate
            vedel prečítať a preložiť aj keď je vizuálne zatvorené. */}
        <div
          className={`absolute top-full left-0 right-0 bg-[#0a0a0a] border-b border-[#1e1e1e] flex-col lg:hidden max-h-[85vh] overflow-y-auto ${
            menuOpen ? "flex" : "hidden"
          }`}
        >
          {navLinks.map((item) => {
            const isActive = pathname === item.href;
            return (
              <a
                key={item.label}
                href={item.href}
                className={`px-6 py-4 text-[14px] font-semibold border-t border-[#1e1e1e] transition-colors ${
                  isActive 
                    ? "text-green-400" 
                    : "text-[#888] hover:text-green-400"
                }`}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </a>
            );
          })}

          {/* ADHD Test v menu */}
          <button
            onClick={openTest}
            className="px-6 py-4 text-[14px] font-semibold text-green-400 hover:text-green-300 border-t border-[#1e1e1e] transition-colors flex items-center gap-3 text-left cursor-pointer"
          >
            <span className="text-xl">🧠</span>
            <span>Urobiť si ADHD test</span>
            <span className="ml-auto text-xs bg-green-400/10 px-2.5 py-1 rounded text-green-400 font-medium">
              NOVÉ
            </span>
          </button>

          {/* MOBILNÝ RESPONDZÍVNY VÝBER JAZYKOV (Zobrazený iba tu na mobile/tablete) */}
          <div className="px-6 py-5 border-t border-[#1e1e1e] bg-[#0d0d0d] flex flex-col gap-2.5">
            <span className="text-[11px] font-bold text-[#555] uppercase tracking-wider">
              Zmeniť jazyk / Language
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {languages.map((lang) => {
                const isSelected = currentLang === lang.label || (currentLang === "Vyberte jazyk" && lang.code === "sk");
                return (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={`px-3 py-2.5 text-[12px] font-semibold rounded-[6px] text-center transition-all cursor-pointer ${
                      isSelected
                        ? "bg-green-400/10 border border-green-400 text-green-400"
                        : "bg-[#141414] border border-[#1e1e1e] text-[#aaa] hover:text-white hover:border-[#333]"
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

      {/* Fullscreen Modal pre mobilný/tabletový test */}
      {testOpen && (
        <div className="fixed inset-0 z-[100] bg-[#0a0a0a] overflow-y-auto">
          <div className="min-h-screen p-4 pb-20">
            <div className="sticky top-0 z-10 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-[#1e1e1e] -mx-4 px-4 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🧠</span>
                <div>
                  <h2 className="font-display text-lg font-bold text-[#f0ede6]">
                    ADHD Test
                  </h2>
                  <p className="text-[11px] text-[#555]">
                    Orientácia podľa DSM-5
                  </p>
                </div>
              </div>

              <button
                onClick={closeTest}
                className="text-[#888] hover:text-white text-2xl leading-none px-3 py-1 cursor-pointer"
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

      {/* VYČISTENÉ GLOBÁLNE ŠTÝLY */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .goog-te-banner-frame.skiptranslate, 
        .goog-te-banner-frame, 
        #goog-gt-tt,
        .goog-te-banner,
        .skiptranslate.goog-te-gadget {
          display: none !important;
          visibility: hidden !important;
        }
        body {
          top: 0 !important;
          position: static !important;
        }
      `,
        }}
      />
    </>
  );
}
