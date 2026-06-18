"use client";

import { useState, useEffect } from "react";

export default function TypewriterHeading() {
  const [part1, setPart1] = useState("");
  const [part2, setPart2] = useState("");
  const [part3, setPart3] = useState("");

  useEffect(() => {
    const str1 = "ADHD nie je";
    const str2 = "len pre ";
    const str3 = "deti.";
    
    let i = 0;
    let j = 0;
    let k = 0;

    function type() {
      if (i < str1.length) {
        setPart1(str1.slice(0, i + 1));
        i++;
        setTimeout(type, 70); // Rýchlosť písania prvého riadku (v ms)
      } else if (j < str2.length) {
        setPart2(str2.slice(0, j + 1));
        j++;
        setTimeout(type, 70); // Rýchlosť druhého riadku
      } else if (k < str3.length) {
        setPart3(str3.slice(0, k + 1));
        k++;
        setTimeout(type, 110); // Posledné slovo sa píše o niečo pomalšie pre dôraz
      }
    }

    // Jemný úvodný odklad pred spustením písania (400ms)
    const delayTimeout = setTimeout(type, 400);
    return () => clearTimeout(delayTimeout);
  }, []);

  return (
    <h1 className="font-display text-5xl md:text-6xl font-extrabold leading-[1.05] tracking-[-2px] mb-5 max-w-2xl min-h-[105px] md:min-h-[126px]">
      {part1}
      {part1 === "ADHD nie je" && <br />}
      {part2}
      <em className="not-italic text-green-400">{part3}</em>
      {/* Blikajúci kurzor na konci textu */}
      <span className="animate-pulse text-green-400 ml-1 font-light">|</span>
    </h1>
  );
}
