"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function SplashScreen() {
  const pathname = usePathname();
  // Zobrazené = stále vidno na obrazovke (kým nezmizne fade-out)
  const [visible, setVisible] = useState(false);
  // Mounted = vôbec renderujeme komponent do DOMu (po fade-out ho úplne odstránime)
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let fadeTimer: ReturnType<typeof setTimeout> | undefined;
    let removeTimer: ReturnType<typeof setTimeout> | undefined;

    queueMicrotask(() => {
      const isStandalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        (navigator as Navigator & { standalone?: boolean }).standalone === true;

      if (cancelled || pathname.includes("/kviz") || isStandalone || sessionStorage.getItem("splashShown")) return;

      setMounted(true);
      setVisible(true);
      sessionStorage.setItem("splashShown", "1");

      // Start the fade-out after the short intro and remove the overlay after it finishes.
      fadeTimer = setTimeout(() => setVisible(false), 1300);
      removeTimer = setTimeout(() => setMounted(false), 1600);
    });

    return () => {
      cancelled = true;
      if (fadeTimer) clearTimeout(fadeTimer);
      if (removeTimer) clearTimeout(removeTimer);
    };
  }, [pathname]);

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
