"use client";

import { useState, useEffect } from "react";

export default function TypewriterHeading() {
  const [part1, setPart1] = useState("");
  const [part2, setPart2] = useState("");
  const [part3, setPart3] = useState("");
  const [showBreak, setShowBreak] = useState(false); // Dynamické zalamovanie riadku

  useEffect(() => {
    // 1. Načítanie vybraného jazyka z Google Translate cookie
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(";").shift();
    };

    const googtrans = getCookie("googtrans");
    const lang = googtrans ? googtrans.split("/").pop() : "sk";

    // 2. Predvolené slovenské texty
    let str1 = "ADHD nie je";
    let str2 = "len pre ";
    let str3 = "deti.";

    // 3. Preklady pre tvoje podporované jazyky z nav.tsx
    if (lang === "en") {
      str1 = "ADHD is not";
      str2 = "just for ";
      str3 = "children.";
    } else if (lang === "cs") {
      str1 = "ADHD není";
      str2 = "jen pro ";
      str3 = "děti.";
    } else if (lang === "de") {
      str1 = "ADHD ist nicht";
      str2 = "nur für ";
      str3 = "Kinder.";
    } else if (lang === "pl") {
      str1 = "ADHD to nie";
      str2 = "tylko dla ";
      str3 = "dzieci.";
    } else if (lang === "hu") {
      str1 = "Az ADHD nem";
      str2 = "csak ";
      str3 = "gyerekeké.";
    }
    
    let i = 0;
    let j = 0;
    let k = 0;

    function type() {
      if (i < str1.length) {
        setPart1(str1.slice(0, i + 1));
        i++;
        // Keď dopíše prvú časť, povie Reactu, že môže zalomiť riadok
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
    return () => clearTimeout(delayTimeout);
  }, []);

  return (
    /* 
      KĽÚČOVÁ ZMENA: "notranslate" a translate="no" zakážu Googlu zasahovať do DOMu.
      Vďaka tomu ti už prekladač nerozbije JavaScriptovú animáciu.
    */
    <h1 
      className="notranslate font-display text-5xl md:text-6xl font-extrabold leading-[1.05] tracking-[-2px] mb-5 max-w-2xl min-h-[105px] md:min-h-[126px]"
      translate="no"
    >
      {part1}
      {showBreak && <br />}
      {part2}
      <em className="not-italic text-green-400">{part3}</em>
      {/* Blikajúci kurzor na konci textu */}
      <span className="animate-pulse text-green-400 ml-1 font-light">|</span>
    </h1>
  );
}
