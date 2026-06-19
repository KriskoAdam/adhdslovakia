"use client";

import { useState, useEffect } from "react";

export default function SplashScreen() {
  // Zobrazené = stále vidno na obrazovke (kým nezmizne fade-out)
  const [visible, setVisible] = useState(false);
  // Mounted = vôbec renderujeme komponent do DOMu (po fade-out ho úplne odstránime)
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Zobrazíme splash iba pri PRVEJ návšteve v rámci tejto session (tab).
    // Pri ďalšej navigácii v rámci webu (cez Next.js Link routing, čiže
    // bez plného reloadu) sa už neukáže, lebo by to bolo otravné.
    const alreadyShown = sessionStorage.getItem("splashShown");
    if (alreadyShown) {
      return;
    }

    setMounted(true);
    setVisible(true);
    sessionStorage.setItem("splashShown", "1");

    // Po 1.3s spustíme fade-out (visible = false spustí CSS transition).
    const fadeTimer = setTimeout(() => {
      setVisible(false);
    }, 1300);

    // Po doznení fade-out animácie (300ms) komponent úplne odstránime
    // z DOMu, aby neprekážal žiadnym kliknutiam pod sebou.
    const removeTimer = setTimeout(() => {
      setMounted(false);
    }, 1600);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0a0a0a] transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#f0ede6]">
        ADHD<span className="text-green-400">.</span>Slovakia
      </div>

      {/* Jednoduchý loading indikátor - tri bodky, ktoré postupne pulzujú */}
      <div className="flex gap-1.5 mt-5">
        <span className="w-2 h-2 rounded-full bg-green-400 animate-bounce [animation-delay:-0.3s]" />
        <span className="w-2 h-2 rounded-full bg-green-400 animate-bounce [animation-delay:-0.15s]" />
        <span className="w-2 h-2 rounded-full bg-green-400 animate-bounce" />
      </div>
    </div>
  );
}
