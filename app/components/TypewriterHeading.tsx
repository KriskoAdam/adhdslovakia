#"use client";

import { useState, useEffect } from "react";

export default function TypewriterHeading() {
  const [part1, setPart1] = useState("");
  const [part2, setPart2] = useState("");
  const [part3, setPart3] = useState("");
  const [showBreak, setShowBreak] = useState(false);
  const [currentLang, setCurrentLang] = useState("sk");

  // 1. SLEDOVANIE ZMENY JAZYKA (Google Translate mení atribút lang na <html lang="...">)
  useEffect(() => {
    // Funkcia na zistenie aktuálneho jazyka z html tagu alebo z cookie
    const detectLanguage = () => {
      const htmlLang = document.documentElement.getAttribute("lang");
      if (htmlLang) return htmlLang.split("-")[0]; // "en-US" -> "en"

      const getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(";").shift();
      };
      const googtrans = getCookie("googtrans");
      return googtrans ? googtrans.split("/").pop() || "sk" : "sk";
    };

    // Nastavíme počiatočný jazyk
    setCurrentLang(detectLanguage());

    // MutationObserver sleduje, kedy Google Translate zmení atribút na <html> tagu
    const observer = new MutationObserver(() => {
      setCurrentLang(detectLanguage());
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["lang"],
    });

    return () => observer.disconnect();
  }, []);

  // 2. SAMOTNÝ PÍSACÍ STROJ (Spustí sa nanovo VŽDY, keď sa zmení currentLang)
  useEffect(() => {
    // Vynulovanie stavov pred novým písaním
    setPart1("");
    setPart2("");
    setPart3("");
    setShowBreak(false);

    let str1 = "ADHD nie je";
    let str2 = "len pre ";
    let str3 = "deti.";

    if (currentLang === "en") {
      str1 = "ADHD is not";
      str2 = "just for ";
      str3 = "children.";
    } else if (currentLang === "cs") {
      str1 = "ADHD není";
      str2 = "jen pro ";
      str3 = "děti.";
    } else if (currentLang === "de") {
      str1 = "ADHD ist nicht";
      str2 = "nur für ";
      str3 = "Kinder.";
    } else if (currentLang === "pl") {
      str1 = "ADHD to nie";
      str2 = "tylko dla ";
      str3 = "dzieci.";
    } else if (currentLang === "hu") {
      str1 = "Az ADHD nem";
      str2 = "csak ";
      str3 = "gyerekeké.";
    }
    
    let i = 0;
    let j = 0;
    let k = 0;
    let isCancelled = false;

    function type() {
      if (isCancelled) return;

      if (i < str1.length) {
        setPart1(str1.slice(0, i + 1));
        i++;
        if (i === str1.length) {
          setShowBreak(true);
        }
        setTimeout(type, 70);
      } else if (j < str2.length) {
        setPart2(str2.slice(0, j + 1));
        j++;
        setTimeout(type, 70);
      } else if (k < str3.length) {
        setPart3(str3.slice(0, k + 1));
        k++;
        setTimeout(type, 110);
      }
    }

    const delayTimeout = setTimeout(type, 400);

    return () => {
      isCancelled = true;
      clearTimeout(delayTimeout);
    };
  }, [currentLang]); // <-- Dôležité: Reaguje na zmenu jazyka

  return ( 
<h1 
className="notranslate font-display text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.05] tracking-[-2px] mb-5 max-w-full break-words min-h-[105px] md:min-h-[126px] overflow-hidden"
translate="no"
> 
{part1} 
{showBreak && <br />} 
{part2} 
<span className="text-green-400">{part3}</span> 
{/* Blikajúci kurzor na konci textu */} 
<span className="animate-pulse text-green-400 ml-1 font-light">|</span> 
</h1> 
);
}
