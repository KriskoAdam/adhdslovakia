"use client";

import { useState, useEffect, useRef } from "react";

// 15 výrokov pre každý jazyk. Každý výrok má tri časti, presne ako v
// pôvodnom dizajne: part1 (prvý riadok), part2 (začiatok druhého riadku,
// nezvýraznený) a part3 (koniec druhého riadku, zvýraznený zelenou).
// Štruktúra musí zostať rovnaká vo všetkých jazykoch, aby layout (zalomenie
// na <br/>) fungoval konzistentne.
type Phrase = { part1: string; part2: string; part3: string };

const PHRASES: Record<string, Phrase[]> = {
  sk: [
    { part1: "ADHD nie je", part2: "len pre ", part3: "deti." },
    { part1: "ADHD nie je to,", part2: "čo si ", part3: "myslíš." },
    { part1: "Viac než nepokoj.", part2: "Viac než ", part3: "neposlušnosť." },
    { part1: "ADHD má", part2: "veľa ", part3: "tvárí." },
    { part1: "Menej mýtov.", part2: "Viac ", part3: "pochopenia." },
    { part1: "Tvoj mozog.", part2: "Iná ", part3: "prevádzka." },
    { part1: "Pochop ADHD.", part2: "Pochopíš ", part3: "viac." },
    { part1: "Celý život si vedel,", part2: "že si ", part3: "iný." },
    { part1: "ADHD má", part2: "cca 5 % ", part3: "detí." },
    { part1: "ADHD je", part2: "neurovývojová ", part3: "porucha." },
    { part1: "ADHD často sprevádza", part2: "aj ", part3: "úzkosť." },
    { part1: "Genetika hrá", part2: "pri ADHD veľkú ", part3: "rolu." },
    { part1: "Väčšina dospelých", part2: "nemá ", part3: "diagnózu." },
    { part1: "ADHD nie je o vôli,", part2: "ale o ", part3: "mozgu." },
    { part1: "ADHD pretrváva", part2: "aj do ", part3: "dospelosti." },
  ],
  en: [
    { part1: "ADHD is not", part2: "just for ", part3: "children." },
    { part1: "ADHD is not", part2: "what you ", part3: "think." },
    { part1: "More than restlessness.", part2: "More than ", part3: "disobedience." },
    { part1: "ADHD has", part2: "many ", part3: "faces." },
    { part1: "Fewer myths.", part2: "More ", part3: "understanding." },
    { part1: "Your brain.", part2: "Wired ", part3: "differently." },
    { part1: "Understand ADHD.", part2: "You'll understand ", part3: "more." },
    { part1: "You always knew", part2: "you were ", part3: "different." },
    { part1: "ADHD affects", part2: "about 5% ", part3: "of children." },
    { part1: "ADHD is a", part2: "neurodevelopmental ", part3: "disorder." },
    { part1: "ADHD often comes", part2: "with ", part3: "anxiety." },
    { part1: "Genetics play", part2: "a major role ", part3: "in ADHD." },
    { part1: "Most adults", part2: "remain ", part3: "undiagnosed." },
    { part1: "ADHD isn't about will,", part2: "it's about the ", part3: "brain." },
    { part1: "ADHD persists", part2: "into ", part3: "adulthood." },
  ],
  cs: [
    { part1: "ADHD není", part2: "jen pro ", part3: "děti." },
    { part1: "ADHD není to,", part2: "co si ", part3: "myslíš." },
    { part1: "Víc než neklid.", part2: "Víc než ", part3: "neposlušnost." },
    { part1: "ADHD má", part2: "mnoho ", part3: "tváří." },
    { part1: "Méně mýtů.", part2: "Více ", part3: "pochopení." },
    { part1: "Tvůj mozek.", part2: "Jiné ", part3: "zapojení." },
    { part1: "Pochop ADHD.", part2: "Pochopíš ", part3: "víc." },
    { part1: "Celý život jsi věděl,", part2: "že jsi ", part3: "jiný." },
    { part1: "ADHD má", part2: "asi 5 % ", part3: "dětí." },
    { part1: "ADHD je", part2: "neurovývojová ", part3: "porucha." },
    { part1: "ADHD často doprovází", part2: "i ", part3: "úzkost." },
    { part1: "Genetika hraje", part2: "u ADHD velkou ", part3: "roli." },
    { part1: "Většina dospělých", part2: "nemá ", part3: "diagnózu." },
    { part1: "ADHD není o vůli,", part2: "ale o ", part3: "mozku." },
    { part1: "ADHD přetrvává", part2: "i do ", part3: "dospělosti." },
  ],
  de: [
    { part1: "ADHD ist nicht", part2: "nur für ", part3: "Kinder." },
    { part1: "ADHD ist nicht,", part2: "was du ", part3: "denkst." },
    { part1: "Mehr als Unruhe.", part2: "Mehr als ", part3: "Ungehorsam." },
    { part1: "ADHD hat", part2: "viele ", part3: "Gesichter." },
    { part1: "Weniger Mythen.", part2: "Mehr ", part3: "Verständnis." },
    { part1: "Dein Gehirn.", part2: "Anders ", part3: "verdrahtet." },
    { part1: "Versteh ADHD.", part2: "Du verstehst ", part3: "mehr." },
    { part1: "Du wusstest immer,", part2: "dass du ", part3: "anders bist." },
    { part1: "ADHD betrifft", part2: "etwa 5 % ", part3: "der Kinder." },
    { part1: "ADHD ist eine", part2: "neurologische ", part3: "Entwicklungsstörung." },
    { part1: "ADHD geht oft", part2: "mit ", part3: "Angst einher." },
    { part1: "Genetik spielt", part2: "bei ADHD eine große ", part3: "Rolle." },
    { part1: "Die meisten Erwachsenen", part2: "bleiben ", part3: "undiagnostiziert." },
    { part1: "ADHD ist keine Frage des Willens,", part2: "sondern des ", part3: "Gehirns." },
    { part1: "ADHD bleibt bestehen", part2: "bis ins ", part3: "Erwachsenenalter." },
  ],
  pl: [
    { part1: "ADHD to nie", part2: "tylko dla ", part3: "dzieci." },
    { part1: "ADHD to nie to,", part2: "co ", part3: "myślisz." },
    { part1: "Więcej niż niepokój.", part2: "Więcej niż ", part3: "nieposłuszeństwo." },
    { part1: "ADHD ma", part2: "wiele ", part3: "twarzy." },
    { part1: "Mniej mitów.", part2: "Więcej ", part3: "zrozumienia." },
    { part1: "Twój mózg.", part2: "Inaczej ", part3: "okablowany." },
    { part1: "Zrozum ADHD.", part2: "Zrozumiesz ", part3: "więcej." },
    { part1: "Zawsze wiedziałeś,", part2: "że jesteś ", part3: "inny." },
    { part1: "ADHD ma", part2: "około 5% ", part3: "dzieci." },
    { part1: "ADHD to", part2: "zaburzenie ", part3: "neurorozwojowe." },
    { part1: "ADHD często towarzyszy", part2: "także ", part3: "lęk." },
    { part1: "Genetyka odgrywa", part2: "w ADHD dużą ", part3: "rolę." },
    { part1: "Większość dorosłych", part2: "nie ma ", part3: "diagnozy." },
    { part1: "ADHD to nie kwestia woli,", part2: "lecz ", part3: "mózgu." },
    { part1: "ADHD utrzymuje się", part2: "także w ", part3: "dorosłości." },
  ],
  hu: [
    { part1: "Az ADHD nem", part2: "csak ", part3: "gyerekeké." },
    { part1: "Az ADHD nem az,", part2: "amit ", part3: "gondolsz." },
    { part1: "Több mint nyugtalanság.", part2: "Több mint ", part3: "engedetlenség." },
    { part1: "Az ADHD-nak", part2: "sok ", part3: "arca van." },
    { part1: "Kevesebb tévhit.", part2: "Több ", part3: "megértés." },
    { part1: "A te agyad.", part2: "Másképp ", part3: "kapcsolva." },
    { part1: "Értsd meg az ADHD-t.", part2: "Többet fogsz ", part3: "érteni." },
    { part1: "Mindig tudtad,", part2: "hogy ", part3: "más vagy." },
    { part1: "Az ADHD a gyerekek", part2: "kb. 5%-át ", part3: "érinti." },
    { part1: "Az ADHD egy", part2: "neurofejlődési ", part3: "zavar." },
    { part1: "Az ADHD-t gyakran", part2: "szorongás is ", part3: "kíséri." },
    { part1: "A genetika nagy szerepet", part2: "játszik az ", part3: "ADHD-ban." },
    { part1: "A legtöbb felnőtt", part2: "diagnózis ", part3: "nélkül él." },
    { part1: "Az ADHD nem akarat kérdése,", part2: "hanem az ", part3: "agyé." },
    { part1: "Az ADHD felnőttkorban", part2: "is ", part3: "fennmarad." },
  ],
};

const SUPPORTED_LANGS = Object.keys(PHRASES);

export default function TypewriterHeading() {
  const [part1, setPart1] = useState("");
  const [part2, setPart2] = useState("");
  const [part3, setPart3] = useState("");
  const [showBreak, setShowBreak] = useState(false);
  const [currentLang, setCurrentLang] = useState("sk");
  // Index aktuálneho výroku v rotácii. Uložený v ref, nie v state, lebo ho
  // potrebujeme čítať synchrónne vo vnútri setTimeout reťazí bez toho, aby
  // sme efekt znova spúšťali pri každej zmene (to by reštartovalo písanie).
  const phraseIndexRef = useRef(0);

  // 1. SLEDOVANIE ZMENY JAZYKA (Google Translate mení atribút lang na <html lang="...">)
  useEffect(() => {
    const detectLanguage = () => {
      const htmlLang = document.documentElement.getAttribute("lang");
      const code = htmlLang ? htmlLang.split("-")[0] : null;
      if (code && SUPPORTED_LANGS.includes(code)) return code;

      const getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(";").shift();
      };
      const googtrans = getCookie("googtrans");
      const cookieLang = googtrans ? googtrans.split("/").pop() : null;
      return cookieLang && SUPPORTED_LANGS.includes(cookieLang) ? cookieLang : "sk";
    };

    setCurrentLang(detectLanguage());

    const observer = new MutationObserver(() => {
      setCurrentLang(detectLanguage());
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["lang"],
    });

    return () => observer.disconnect();
  }, []);

  // 2. PÍSACÍ STROJ S ROTÁCIOU VÝROKOV
  // Spustí sa nanovo pri zmene jazyka (reštartuje rotáciu od prvého výroku
  // v danom jazyku) a inak beží nekonečne sám: napíše výrok, počká, zmaže
  // ho, prejde na ďalší výrok v poli (cyklicky), zopakuje.
  useEffect(() => {
    const phrases = PHRASES[currentLang] || PHRASES.sk;
    phraseIndexRef.current = 0;

    setPart1("");
    setPart2("");
    setPart3("");
    setShowBreak(false);

    let isCancelled = false;
    let activeTimeout: ReturnType<typeof setTimeout>;

    function typePhrase() {
      if (isCancelled) return;

      const { part1: str1, part2: str2, part3: str3 } = phrases[phraseIndexRef.current];
      let i = 0;
      let j = 0;
      let k = 0;

      function type() {
        if (isCancelled) return;

        if (i < str1.length) {
          setPart1(str1.slice(0, i + 1));
          i++;
          if (i === str1.length) setShowBreak(true);
          activeTimeout = setTimeout(type, 70);
        } else if (j < str2.length) {
          setPart2(str2.slice(0, j + 1));
          j++;
          activeTimeout = setTimeout(type, 70);
        } else if (k < str3.length) {
          setPart3(str3.slice(0, k + 1));
          k++;
          activeTimeout = setTimeout(type, 110);
        } else {
          // Výrok je celý napísaný — počkáme, kým si ho človek stihne
          // prečítať, potom ho zmažeme a prejdeme na ďalší v poradí.
          activeTimeout = setTimeout(erasePhrase, 2200);
        }
      }

      type();
    }

    function erasePhrase() {
      if (isCancelled) return;

      const { part1: str1, part2: str2, part3: str3 } = phrases[phraseIndexRef.current];
      let i = str1.length;
      let j = str2.length;
      let k = str3.length;

      function erase() {
        if (isCancelled) return;

        if (k > 0) {
          k--;
          setPart3(str3.slice(0, k));
          activeTimeout = setTimeout(erase, 35);
        } else if (j > 0) {
          j--;
          setPart2(str2.slice(0, j));
          activeTimeout = setTimeout(erase, 35);
        } else if (i > 0) {
          i--;
          setPart1(str1.slice(0, i));
          if (i === str1.length - 1) setShowBreak(false);
          activeTimeout = setTimeout(erase, 35);
        } else {
          // Celý výrok zmazaný — posunieme sa na ďalší (cyklicky) a po
          // krátkej pauze začneme písať znova.
          phraseIndexRef.current = (phraseIndexRef.current + 1) % phrases.length;
          activeTimeout = setTimeout(typePhrase, 400);
        }
      }

      erase();
    }

    // Prvotné spustenie s rovnakým úvodným oneskorením ako v origináli
    activeTimeout = setTimeout(typePhrase, 400);

    return () => {
      isCancelled = true;
      clearTimeout(activeTimeout);
    };
  }, [currentLang]);

  return (
    <h1
      className="notranslate font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.15] tracking-[-1px] sm:tracking-[-2px] mb-5 max-w-full break-words [overflow-wrap:break-word] [hyphens:auto] min-h-[140px] sm:min-h-[140px] md:min-h-[160px] lg:min-h-[170px] overflow-hidden"
      translate="no"
      lang={currentLang}
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
